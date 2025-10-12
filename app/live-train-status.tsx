import React, { useEffect, useState, useRef, useMemo } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Animated,
    Easing,
    TextInput,
    Keyboard, 
    StatusBar,
} from "react-native";
import { MapPin, TrainFront, ChevronDown, ChevronUp, Search, ArrowLeft, Clock, Navigation } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");

interface NonStopStation {
    station_code: string;
    station_name: string;
    distance_from_source: number;
    a_day: number;
}

interface Station {
    station_code: string;
    station_name: string;
    platform_number?: number;
    distance_from_source: number;
    distance_from_current_station_txt?: string;
    sta?: string;
    std?: string;
    eta?: string;
    etd?: string;
    halt?: number;
    a_day: number;
    arrival_delay?: number;
    status?: "previous" | "current" | "upcoming";
    non_stops?: NonStopStation[]; 
}

interface TrainData {
    train_number: string;
    train_name: string;
    current_station_name: string;
    current_station_code: string;
    delay: number;
    status_as_of: string;
    ahead_distance_text: string;
    distance_from_source: number;
    total_distance: number;
    upcoming_stations: Station[];
    previous_stations: Station[];
    platform_number: number;
    cur_stn_sta: string;
    cur_stn_std: string;
    eta: string;
    etd: string;
}

const getDayLabel = (dayIndex: number) => `Day ${dayIndex}`;

interface BlinkingTrainMarkerProps {
    scale: Animated.Value;
}

const BlinkingTrainMarker: React.FC<BlinkingTrainMarkerProps> = ({ scale }) => (
    <Animated.View
        style={[
            styles.blinkingMarkerContainer,
            { transform: [{ scale }] }
        ]}
    >
        <TrainFront size={16} color="#FFF" />
    </Animated.View>
);

interface LiveTrainStatusTimelineProps {
    trainNumber: string;
    onReset: () => void;
}

const LiveTrainStatusTimeline: React.FC<LiveTrainStatusTimelineProps> = ({ trainNumber, onReset }) => {
    const [trainData, setTrainData] = useState<TrainData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedNonStops, setExpandedNonStops] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const scrollRef = useRef<ScrollView>(null);
    const blinkingDotScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(blinkingDotScale, {
                    toValue: 1.3,
                    duration: 700,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkingDotScale, {
                    toValue: 1,
                    duration: 700,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, [blinkingDotScale]);

    const toggleNonStops = (stationCode: string) => {
        setExpandedNonStops(prev =>
            prev.includes(stationCode)
                ? prev.filter(code => code !== stationCode)
                : [...prev, stationCode]
        );
    };

    const fetchTrainData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(
                `https://fastapi-backend-production-23ac.up.railway.app/irctc/live_train_status/${trainNumber}?startDay=1`
            );
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const json = await res.json();
            
            if (json?.error) {
                throw new Error(json.error);
            }

            if (!json?.data) throw new Error("Invalid data format or train not running today.");
            setTrainData(json.data);
        } catch (err: any) {
            console.error("Error fetching train data:", err);
            const message = err.message.includes('Server error') ? "Could not connect to service." : err.message;
            setError(message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainData();
    }, [trainNumber]);

    const stationsToDisplay = useMemo(() => {
        if (!trainData) return [];

        const prev = trainData.previous_stations || [];
        const upcoming = trainData.upcoming_stations || [];

        const currentStation: Station = {
            station_code: trainData.current_station_code,
            station_name: trainData.current_station_name,
            distance_from_source: trainData.distance_from_source,
            platform_number: trainData.platform_number,
            eta: trainData.eta,
            etd: trainData.etd,
            sta: trainData.cur_stn_sta,
            std: trainData.cur_stn_std,
            a_day: (prev.length > 0 && prev.slice(-1)[0]?.a_day) ? prev.slice(-1)[0].a_day : 1, 
            status: "current",
        };

        const allStations: Station[] = [
            ...prev.map((s) => ({ ...s, status: "previous" as const })),
            currentStation,
            ...upcoming.map((s) => ({ ...s, status: "upcoming" as const })),
        ];

        const uniqueStations = allStations
            .filter(
                (st, idx, self) =>
                    idx === self.findIndex((s) => s.station_code === st.station_code)
            )
            .sort((a, b) => a.distance_from_source - b.distance_from_source);

        if (!searchTerm) {
            return uniqueStations;
        }

        const lowerCaseSearch = searchTerm.toLowerCase();

        return uniqueStations.filter(st => 
            st.status === "current" ||
            st.station_name.toLowerCase().includes(lowerCaseSearch) ||
            st.station_code.toLowerCase().includes(lowerCaseSearch)
        );
        
    }, [trainData, searchTerm]);

    useEffect(() => {
        if (loading || !stationsToDisplay.length || searchTerm || !scrollRef.current) return;
        
        const idx = stationsToDisplay.findIndex((st) => st.status === "current");
        
        if (idx >= 0) {
            const rowHeightEstimate = 100; 
            scrollRef.current.scrollTo({
                y: idx * rowHeightEstimate - Dimensions.get('window').height / 2 + rowHeightEstimate / 2,
                animated: true,
            });
        }
    }, [stationsToDisplay, loading, searchTerm]);

    if (loading)
        return (
            <View style={styles.centerContainer}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
                <ActivityIndicator size="large" color="#FF6B35" />
                <Text style={styles.loadingText}>Fetching live status for train {trainNumber}...</Text>
            </View>
        );

    if (error)
        return (
            <View style={styles.fullContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
                <LinearGradient
                    colors={['#FF6B35', '#FF8C42']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.header}
                >
                    <TouchableOpacity onPress={onReset} style={styles.backButton}>
                        <ArrowLeft size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center' }]}>Error</Text>
                    <View style={{ width: 24 }} />
                </LinearGradient>
                <View style={styles.centerContainer}>
                    <View style={styles.errorBox}>
                        <Text style={styles.errorText}>⚠️ Status Check Failed</Text>
                        <Text style={styles.errorTextDetail}>{error}</Text>
                        <TouchableOpacity onPress={fetchTrainData} style={styles.retryBtn}>
                            <Text style={styles.retryText}>Retry Train {trainNumber}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onReset} style={styles.searchNewBtn}>
                            <Text style={styles.retryText}>Search New Train</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );

    if (!trainData) return null;

    let lastDay = 0;
    return (
        <View style={styles.fullContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
            
            {/* Top Bar (Header) with Gradient */}
            <LinearGradient
                colors={['#FF6B35', '#FF8C42']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <TouchableOpacity onPress={onReset} style={styles.backButton}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {trainData.train_name}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        Train No: {trainData.train_number}
                    </Text>
                </View>
                <View style={{ width: 24 }} />
            </LinearGradient>
            
            {/* Status Info Card */}
            <View style={styles.statusInfoCard}>
                <View style={styles.statusTopRow}>
                    <View style={styles.statusInfoItem}>
                        <View style={[
                            styles.delayBadge,
                            { backgroundColor: trainData.delay > 0 ? '#FEE2E2' : '#D1FAE5' }
                        ]}>
                            <Clock size={16} color={trainData.delay > 0 ? '#DC2626' : '#059669'} />
                            <Text style={[
                                styles.delayText,
                                { color: trainData.delay > 0 ? '#DC2626' : '#059669' }
                            ]}>
                                {trainData.delay > 0 ? `Delayed by ${trainData.delay} min` : 'On Time'}
                            </Text>
                        </View>
                    </View>
                </View>
                
                <View style={styles.currentLocationCard}>
                    <View style={styles.locationIconContainer}>
                        <Navigation size={20} color="#FF6B35" />
                    </View>
                    <View style={styles.locationInfo}>
                        <Text style={styles.currentLocationLabel}>Current Location</Text>
                        <Text style={styles.currentLocationText}>
                            {String(trainData.ahead_distance_text ?? "--")}
                        </Text>
                        <Text style={styles.statusUpdateText}>
                            Updated {trainData.status_as_of}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Timeline Scroll Container */}
            <ScrollView 
                ref={scrollRef} 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                {stationsToDisplay.map((st, idx) => {
                    const isPrev = st.status === "previous";
                    const isCurrent = st.status === "current";
                    const isUpcoming = st.status === "upcoming";
                    
                    const nonStops = isUpcoming ? st.non_stops : undefined;
                    const isExpanded = expandedNonStops.includes(st.station_code);

                    const newDay = st.a_day !== lastDay;
                    if (newDay) lastDay = st.a_day;

                    return (
                        <View key={st.station_code}>
                            {/* Day Header */}
                            {newDay && (
                                <View style={styles.dayHeader}>
                                    <View style={styles.dayLine} />
                                    <View style={styles.dayBadge}>
                                        <Text style={styles.dayText}>{getDayLabel(st.a_day)}</Text>
                                    </View>
                                    <View style={styles.dayLine} />
                                </View>
                            )}

                            {/* Main Station Card */}
                            <View 
                                style={[
                                    styles.stationCard,
                                    isCurrent && styles.currentStationCard
                                ]}
                            >
                                {/* Timeline Column */}
                                <View style={styles.timelineColumn}>
                                    {isCurrent ? (
                                        <BlinkingTrainMarker scale={blinkingDotScale} />
                                    ) : (
                                        <View 
                                            style={[
                                                styles.dot,
                                                isPrev ? styles.prevDot : styles.upcomingDot
                                            ]}>
                                            {isPrev && <View style={styles.dotInner} />}
                                        </View>
                                    )}
                                    {/* Vertical Line */}
                                    {idx < stationsToDisplay.length - 1 && (
                                        <View style={[
                                            styles.verticalLine,
                                            isPrev && styles.verticalLinePrev
                                        ]} />
                                    )}
                                </View>

                                {/* Station Info */}
                                <View style={styles.stationInfoColumn}>
                                    {/* Station Header */}
                                    <View style={styles.stationHeader}>
                                        <View style={styles.stationNameContainer}>
                                            <Text style={[
                                                styles.stationName,
                                                isCurrent && styles.currentStationName
                                            ]}>
                                                {st.station_name}
                                            </Text>
                                            <Text style={styles.stationCode}>({st.station_code})</Text>
                                        </View>
                                        
                                        {st.platform_number !== undefined && st.platform_number > 0 && (
                                            <View style={styles.platformBadge}>
                                                <Text style={styles.platformLabel}>Platform</Text>
                                                <Text style={styles.platformNumber}>
                                                    {String(st.platform_number)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Times Row */}
                                    <View style={styles.timesRow}>
                                        <View style={styles.timeBlock}>
                                            <Text style={styles.timeLabel}>Arrival</Text>
                                            <View style={styles.timeValues}>
                                                <Text style={styles.scheduledTime}>{st.sta || "--"}</Text>
                                                <Text style={styles.timeSeparator}>→</Text>
                                                <Text style={[
                                                    styles.actualTime,
                                                    isCurrent && styles.currentTime
                                                ]}>
                                                    {st.eta || "--"}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.timeBlock}>
                                            <Text style={styles.timeLabel}>Departure</Text>
                                            <View style={styles.timeValues}>
                                                <Text style={styles.scheduledTime}>{st.std || "--"}</Text>
                                                <Text style={styles.timeSeparator}>→</Text>
                                                <Text style={[
                                                    styles.actualTime,
                                                    isCurrent && styles.currentTime
                                                ]}>
                                                    {st.etd || "--"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Distance */}
                                    <View style={styles.distanceRow}>
                                        <MapPin size={14} color="#94A3B8" />
                                        <Text style={styles.distanceText}>
                                            {st.distance_from_source} km from source
                                        </Text>
                                        {st.distance_from_current_station_txt != null && (
                                            <Text style={styles.distanceFromCurrent}>
                                                • {String(st.distance_from_current_station_txt)}
                                            </Text>
                                        )}
                                    </View>

                                    {/* Non-stop Toggle Button */}
                                    {isUpcoming && nonStops && nonStops.length > 0 && (
                                        <TouchableOpacity 
                                            onPress={() => toggleNonStops(st.station_code)}
                                            style={styles.toggleButton}
                                        >
                                            <Text style={styles.toggleButtonText}>
                                                {isExpanded ? 'Hide' : 'Show'} {nonStops.length} non-stop station{nonStops.length !== 1 ? 's' : ''}
                                            </Text>
                                            {isExpanded ? 
                                                <ChevronUp size={16} color="#FF6B35" /> : 
                                                <ChevronDown size={16} color="#FF6B35" />
                                            }
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            
                            {/* Non-stop Dropdown Content */}
                            {isExpanded && isUpcoming && nonStops && (
                                <View style={styles.nonStopContainer}>
                                    {nonStops.map((ns) => (
                                        <View key={ns.station_code} style={styles.nonStopCard}>
                                            <View style={styles.nonStopDot} />
                                            <View style={styles.nonStopInfo}>
                                                <Text style={styles.nonStopName}>
                                                    {ns.station_name} ({ns.station_code})
                                                </Text>
                                                <View style={styles.nonStopMeta}>
                                                    <MapPin size={12} color="#94A3B8" />
                                                    <Text style={styles.nonStopDistance}>
                                                        {ns.distance_from_source} km
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const TrainSearchScreen: React.FC<{ onSearch: (trainNumber: string) => void }> = ({ onSearch }) => {
    const [inputTrainNumber, setInputTrainNumber] = useState<string>('');
    const [searchError, setSearchError] = useState<string | null>(null);

    const handleSearch = () => {
        const trimmedNumber = inputTrainNumber.trim();
        if (/^\d{5,6}$/.test(trimmedNumber)) {
            setSearchError(null);
            Keyboard.dismiss();
            onSearch(trimmedNumber);
        } else {
            setSearchError("Please enter a valid 5 or 6 digit train number.");
        }
    };

    return (
        <View style={styles.searchScreenContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#FF6B35" />
            
            <LinearGradient
                colors={['#FF6B35', '#FF8C42']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.searchGradientBg}
            >
                <View style={styles.searchIllustration}>
                    <View style={styles.trainIconContainer}>
                        <TrainFront size={60} color="#FFFFFF" />
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.searchCardContainer}>
                <View style={styles.searchCard}>
                    <Text style={styles.searchTitle}>Live Train Status</Text>
                    <Text style={styles.searchSubtitle}>Track your train in real-time</Text>
                    
                    <View style={styles.trainInputContainer}>
                        <Search size={20} color="#94A3B8" style={styles.searchIcon} />
                        <TextInput
                            placeholder="Enter Train Number (e.g., 12133)"
                            placeholderTextColor="#94A3B8"
                            value={inputTrainNumber}
                            onChangeText={setInputTrainNumber}
                            keyboardType="numeric"
                            style={styles.trainInput}
                            maxLength={6} 
                            onSubmitEditing={handleSearch}
                        />
                    </View>

                    {searchError && (
                        <Text style={styles.searchErrorText}>{searchError}</Text>
                    )}

                    <TouchableOpacity 
                        onPress={handleSearch} 
                        style={styles.searchButton}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#FF6B35', '#FF8C42']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.searchButtonGradient}
                        >
                            <Search size={20} color="#FFF" />
                            <Text style={styles.searchButtonText}>Track Train</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function App() {
    const [currentTrainNumber, setCurrentTrainNumber] = useState<string | null>(null);

    const handleSearch = (trainNumber: string) => {
        setCurrentTrainNumber(trainNumber);
    };

    const handleReset = () => {
        setCurrentTrainNumber(null);
    };

    if (currentTrainNumber) {
        return <LiveTrainStatusTimeline trainNumber={currentTrainNumber} onReset={handleReset} />;
    }

    return <TrainSearchScreen onSearch={handleSearch} />;
}

const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: "#F8FAFC" },
    centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" },
    loadingText: { color: "#64748B", marginTop: 12, fontSize: 16, textAlign: 'center', fontWeight: '600' },
    
    errorBox: {
        alignItems: "center",
        padding: 30,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        width: width * 0.9,
        borderWidth: 2,
        borderColor: '#FEE2E2',
    },
    errorText: { color: "#DC2626", fontSize: 20, fontWeight: "700", marginBottom: 10 },
    errorTextDetail: { color: "#64748B", fontSize: 14, textAlign: 'center', marginBottom: 20 },
    retryBtn: {
        backgroundColor: "#FF6B35",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginTop: 10,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    searchNewBtn: {
        backgroundColor: "#94A3B8",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginTop: 10,
    },
    retryText: { color: "#fff", fontWeight: "700" },

    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    backButton: {
        paddingRight: 12,
        paddingVertical: 5,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    headerTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800" },
    headerSubtitle: { color: "#FFF7ED", fontSize: 12, marginTop: 2, fontWeight: '600' },
    
    statusInfoCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 12,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    statusTopRow: {
        marginBottom: 12,
    },
    statusInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    delayBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    delayText: {
        fontSize: 14,
        fontWeight: '700',
    },
    currentLocationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#FFE4C4',
    },
    locationIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
    },
    currentLocationLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        marginBottom: 2,
    },
    currentLocationText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginBottom: 2,
    },
    statusUpdateText: { 
        fontSize: 11, 
        color: '#94A3B8',
        fontWeight: '500',
    },

    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 24, paddingTop: 8, paddingHorizontal: 16 },

    dayHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 16,
    },
    dayLine: { 
        flex: 1, 
        height: 1, 
        backgroundColor: "#E2E8F0",
    },
    dayBadge: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        marginHorizontal: 12,
    },
    dayText: { 
        color: "#FFFFFF", 
        fontSize: 13, 
        fontWeight: "700",
    },

    stationCard: {
        flexDirection: "row",
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    currentStationCard: {
        backgroundColor: '#FFF7ED',
        borderWidth: 2,
        borderColor: '#FF6B35',
        shadowColor: '#FF6B35',
        shadowOpacity: 0.2,
        elevation: 6,
    },

    timelineColumn: { 
        width: 40, 
        alignItems: "center",
        marginRight: 12,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 3,
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
        zIndex: 2,
    },
    prevDot: { 
        borderColor: '#2563EB',
        backgroundColor: '#2563EB',
    },
    upcomingDot: { 
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    dotInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        top: 2,
        left: 2,
    },
    
    blinkingMarkerContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#FF6B35",
        borderWidth: 3,
        borderColor: "#FFFFFF",
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    verticalLine: {
        position: "absolute",
        top: 20,
        bottom: -12,
        width: 2,
        backgroundColor: "#E2E8F0",
        left: 7,
        zIndex: 1,
    },
    verticalLinePrev: {
        backgroundColor: '#2563EB',
    },
    
    stationInfoColumn: { 
        flex: 1,
    },
    stationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    stationNameContainer: {
        flex: 1,
    },
    stationName: { 
        color: "#1E293B", 
        fontSize: 16, 
        fontWeight: "700",
        marginBottom: 2,
    },
    currentStationName: {
        color: '#FF6B35',
        fontSize: 17,
    },
    stationCode: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
    },
    platformBadge: {
        backgroundColor: "#EBF4FF",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    platformLabel: { 
        fontSize: 10, 
        color: "#64748B", 
        fontWeight: '600',
        marginBottom: 2,
    },
    platformNumber: { 
        fontSize: 16, 
        color: "#2563EB", 
        fontWeight: "800",
        textAlign: 'center',
    },

    timesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timeBlock: {
        flex: 1,
    },
    timeLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
        marginBottom: 4,
    },
    timeValues: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    scheduledTime: { 
        color: "#94A3B8", 
        fontSize: 14,
        fontWeight: '600',
    },
    timeSeparator: {
        color: '#CBD5E1',
        fontSize: 12,
    },
    actualTime: { 
        fontSize: 15, 
        fontWeight: "700",
        color: '#1E293B',
    },
    currentTime: { 
        color: "#FF6B35",
        fontSize: 16,
    },

    distanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    distanceText: { 
        color: "#64748B", 
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '500',
    },
    distanceFromCurrent: { 
        color: "#94A3B8", 
        fontSize: 12,
        marginLeft: 6,
    },

    toggleButton: { 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 4,
    },
    toggleButtonText: { 
        color: "#FF6B35", 
        fontSize: 13, 
        fontWeight: '700',
    },

    nonStopContainer: { 
        marginLeft: 52,
        marginBottom: 12,
    },
    nonStopCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: 10,
        marginBottom: 6,
    },
    nonStopDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1',
        marginRight: 10,
    },
    nonStopInfo: {
        flex: 1,
    },
    nonStopName: { 
        color: '#64748B', 
        fontSize: 13, 
        fontWeight: '600',
        marginBottom: 4,
    },
    nonStopMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nonStopDistance: { 
        color: '#94A3B8', 
        fontSize: 12,
        marginLeft: 4,
    },

    // Search Screen Styles
    searchScreenContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    searchGradientBg: {
        height: '40%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchIllustration: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    trainIconContainer: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    searchCardContainer: {
        flex: 1,
        marginTop: -30,
    },
    searchCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 12,
    },
    searchTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
    },
    searchSubtitle: {
        fontSize: 15,
        color: '#64748B',
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: '500',
    },
    trainInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 10,
    },
    trainInput: {
        flex: 1,
        color: '#1E293B',
        fontSize: 16,
        fontWeight: '600',
    },
    searchErrorText: {
        color: '#DC2626',
        fontSize: 13,
        fontWeight: '600',
        marginTop: -8,
        marginBottom: 16,
        textAlign: 'center',
    },
    searchButton: {
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    searchButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    searchButtonText: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: '800',
    },
});
