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
import { MapPin, TrainFront, ChevronDown, ChevronUp, Search, ArrowLeft } from "lucide-react-native";

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
        <TrainFront size={14} color="#FFF" />
    </Animated.View>
);

// --- LIVE STATUS TIMELINE COMPONENT (The main display) ---
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

    // Blinking animation
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

    // Toggle non-stop visibility
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
            
            // Check for specific API error messages (like invalid train number)
            if (json?.error) {
                // If API returns a known error structure, use its message
                throw new Error(json.error);
            }

            if (!json?.data) throw new Error("Invalid data format or train not running today.");
            setTrainData(json.data);
        } catch (err: any) {
            console.error("Error fetching train data:", err);
            // Ensure error message is user-friendly
            const message = err.message.includes('Server error') ? "Could not connect to service." : err.message;
            setError(message || "Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainData();
    }, [trainNumber]); // Re-fetch if trainNumber changes

    // Processed Stations (Memoized for performance)
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

        // 1. Deduplicate stations and sort by distance
        const uniqueStations = allStations
            .filter(
                (st, idx, self) =>
                    idx === self.findIndex((s) => s.station_code === st.station_code)
            )
            .sort((a, b) => a.distance_from_source - b.distance_from_source);

        // 2. Filter based on search term (only internal filtering, not changing train)
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

    // Auto-scroll to current station
    useEffect(() => {
        if (loading || !stationsToDisplay.length || searchTerm || !scrollRef.current) return;
        
        const idx = stationsToDisplay.findIndex((st) => st.status === "current");
        
        if (idx >= 0) {
            const rowHeightEstimate = 90; 
            scrollRef.current.scrollTo({
                y: idx * rowHeightEstimate - Dimensions.get('window').height / 2 + rowHeightEstimate / 2,
                animated: true,
            });
        }
    }, [stationsToDisplay, loading, searchTerm]);

    // --- Render Logic ---

    if (loading)
        return (
            <View style={styles.centerContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
                <ActivityIndicator size="large" color="#60A5FA" />
                <Text style={styles.loadingText}>Fetching live status for train {trainNumber}...</Text>
            </View>
        );

    if (error)
        return (
            <View style={styles.fullContainer}>
                <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={onReset} style={styles.backButton}>
                        <ArrowLeft size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { flex: 1, textAlign: 'center' }]}>Error</Text>
                    <View style={{ width: 24 }} />
                </View>
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
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            
            {/* Top Bar (Header) */}
            <View style={styles.header}>
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
                <View style={{ width: 24 }} /> {/* Spacer */}
            </View>
            
            {/* Header Details (Delay/On Time and Search) */}
            <View style={styles.headerDetails}>
              {trainData.delay > 0 ? (
                  <Text style={styles.delayText}>
                      Delayed by {trainData.delay} min
                  </Text>
              ) : (
                  <Text style={styles.onTimeText}>
                      Running On Time!
                  </Text>
              )}
            </View>

            {/* Status Bar */}
            <View style={styles.statusBar}>
                <View style={styles.statusRow}>
                    <MapPin size={16} color="#fff" style={styles.statusIcon} />
                    <Text style={styles.statusText}>
                        Current: {String(trainData.ahead_distance_text ?? "--")}
                    </Text>
                </View>
                <Text style={styles.statusUpdateText}>
                    Updated {trainData.status_as_of}
                </Text>
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
                                    <Text style={styles.dayText}>{getDayLabel(st.a_day)}</Text>
                                    <View style={styles.dayLine} />
                                </View>
                            )}

                            {/* Main Station Row */}
                            <View 
                                style={[
                                    styles.stationRow,
                                    isCurrent && styles.currentStationBackground
                                ]}
                            >
                                {/* Left Times (STA/ETA) */}
                                <View style={styles.timeColumn}>
                                    <Text style={styles.scheduledTime}>{st.sta || "--"}</Text>
                                    <Text 
                                        style={[
                                            styles.actualTime,
                                            isPrev && styles.prevTimeColor,
                                            isCurrent && styles.currentTimeColor,
                                        ]}
                                    >
                                        {st.eta || "--"}
                                    </Text>
                                </View>

                                {/* Timeline */}
                                <View style={styles.timelineColumn}>
                                    {isCurrent ? (
                                        <BlinkingTrainMarker scale={blinkingDotScale} />
                                    ) : (
                                        <View 
                                            style={[
                                                styles.dot,
                                                isPrev ? styles.prevDot : styles.upcomingDot
                                            ]}
                                        />
                                    )}
                                    {/* Vertical Line */}
                                    {idx < stationsToDisplay.length - 1 && (
                                        <View style={styles.verticalLine} />
                                    )}
                                </View>

                                {/* Right Info */}
                                <View style={styles.detailsColumn}>
                                    <Text style={styles.stationName}>
                                        {st.station_name} ({st.station_code})
                                    </Text>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.distanceText}>
                                            {st.distance_from_source} km
                                        </Text>
                                        {st.distance_from_current_station_txt != null && (
                                            <Text style={styles.distanceTextSmall}>
                                                ({String(st.distance_from_current_station_txt)})
                                            </Text>
                                        )}
                                        {st.platform_number !== undefined && st.platform_number > 0 && (
                                            <View style={styles.platformBadge}>
                                                <Text style={styles.platformText}>PF</Text>
                                                <Text style={styles.platformNumber}>
                                                    {String(st.platform_number)}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                    
                                    {/* Departure Info (STD/ETD) */}
                                    <View style={styles.detailRow}>
                                        <Text style={styles.depTimeLabel}>Departure:</Text>
                                        <Text style={styles.depTime}>
                                            {st.std || "--"} → 
                                        </Text>
                                        <Text style={[styles.depTime, st.std !== st.etd && { color: '#FCD34D' }]}>
                                            {st.etd || "--"}
                                        </Text>
                                    </View>


                                    {/* Non-stop Toggle Button */}
                                    {isUpcoming && nonStops && nonStops.length > 0 && (
                                        <TouchableOpacity 
                                            onPress={() => toggleNonStops(st.station_code)}
                                            style={styles.toggleButton}
                                        >
                                            <Text style={styles.toggleButtonText}>
                                                {isExpanded ? 'Hide' : 'Show'} {nonStops.length} non-stop {nonStops.length === 1 ? 'station' : 'stations'}
                                            </Text>
                                            {isExpanded ? 
                                                <ChevronUp size={14} color="#60A5FA" style={styles.toggleIcon} /> : 
                                                <ChevronDown size={14} color="#60A5FA" style={styles.toggleIcon} />
                                            }
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            
                            {/* Non-stop Dropdown Content */}
                            {isExpanded && isUpcoming && nonStops && (
                                <View style={styles.nonStopContainer}>
                                    {nonStops.map((ns) => (
                                        <View key={ns.station_code} style={styles.nonStopRow}>
                                            {/* Spacer for Time Column */}
                                            <View style={styles.nonStopSpacer} />

                                            {/* Timeline Column for Non-stops */}
                                            <View style={styles.nonStopTimeline}>
                                                <View style={styles.nonStopDot} />
                                            </View>
                                            
                                            {/* Non-stop Station Details */}
                                            <View style={styles.nonStopDetails}>
                                                <Text style={styles.nonStopName}>
                                                    {ns.station_name} ({ns.station_code})
                                                </Text>
                                                <Text style={styles.nonStopDistance}>
                                                    {ns.distance_from_source} km
                                                </Text>
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

// --- APP COMPONENT (Handles Search/Status View Switching) ---

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
        <View style={styles.centerContainer}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            <View style={styles.searchCard}>
                <TrainFront size={48} color="#60A5FA" style={{ marginBottom: 20 }} />
                <Text style={styles.searchTitle}>Live Train Status</Text>
                <Text style={styles.searchSubtitle}>Track your train in real-time.</Text>
                
                <View style={styles.trainInputContainer}>
                    <TextInput
                        placeholder="Enter Train Number (e.g., 12133)"
                        placeholderTextColor="#64748B"
                        value={inputTrainNumber}
                        onChangeText={setInputTrainNumber}
                        keyboardType="numeric"
                        style={styles.trainInput}
                        maxLength={6} 
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity onPress={handleSearch} style={styles.goButton}>
                        <Search size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {searchError && (
                    <Text style={styles.searchErrorText}>{searchError}</Text>
                )}
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

// --- STYLES (Consolidated and applied) ---

const styles = StyleSheet.create({
    fullContainer: { flex: 1, backgroundColor: "#0F172A" },
    centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
    loadingText: { color: "#94A3B8", marginTop: 8, fontSize: 16, textAlign: 'center' },
    
    // Error Box Styles
    errorBox: {
        alignItems: "center",
        padding: 30,
        backgroundColor: "#1E293B",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        width: width * 0.9,
    },
    errorText: { color: "#F87171", fontSize: 18, fontWeight: "700", marginBottom: 10 },
    errorTextDetail: { color: "#E2E8F0", fontSize: 14, textAlign: 'center', marginBottom: 20 },
    retryBtn: {
        backgroundColor: "#0284C7",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 10,
    },
    searchNewBtn: {
        backgroundColor: "#475569",
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginTop: 10,
    },
    retryText: { color: "#fff", fontWeight: "700" },

    // Header Styles (Used for both Timeline and Error View)
    header: {
        paddingTop: 50,
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: "#0F172A",
        borderBottomWidth: 1,
        borderBottomColor: "#1E293B",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        paddingRight: 15,
        paddingVertical: 5,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
    headerSubtitle: { color: "#94A3B8", fontSize: 12, marginTop: 2 },
    
    // Header Details (Specific to Timeline view)
    headerDetails: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        backgroundColor: "#0F172A",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#1E293B",
    },
    delayText: { color: "#F87171", fontSize: 14, fontWeight: "600", marginTop: 4 },
    onTimeText: { color: "#22C55E", fontSize: 14, fontWeight: "600", marginTop: 4 },

    // Internal Station Search Styles
    searchContainer: {
        width: width * 0.9,
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E293B',
        borderRadius: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#334155',
    },
    searchIcon: { marginRight: 8 },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#E2E8F0',
        fontSize: 16,
    },

    // Status Bar Styles
    statusBar: {
        backgroundColor: "#334155",
        paddingVertical: 12,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statusRow: { flexDirection: "row", alignItems: "center" },
    statusIcon: { marginRight: 8 },
    statusText: { color: "#fff", fontSize: 14, fontWeight: "600" },
    statusUpdateText: { color: "#CBD5E1", fontSize: 12 },

    // ScrollView/Timeline Styles
    scrollView: { flex: 1, backgroundColor: "#1E293B" },
    scrollContent: { paddingBottom: 20, paddingTop: 10 },

    // Day Header Styles
    dayHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        width: width * 0.94,
        alignSelf: "center",
    },
    dayLine: { flex: 1, height: 1, backgroundColor: "#475569", marginHorizontal: 8 },
    dayText: { color: "#E2E8F0", fontSize: 14, fontWeight: "600" },

    // Station Row Styles
    stationRow: {
        flexDirection: "row",
        paddingVertical: 10,
        width: width * 0.94,
        alignSelf: "center",
    },
    currentStationBackground: {
        backgroundColor: "#334155",
        borderRadius: 10,
        paddingVertical: 12,
        marginVertical: 4,
        borderWidth: 2,
        borderColor: '#60A5FA', // Highlight current station border
    },

    // Time Column
    timeColumn: {
        width: width * 0.22,
        alignItems: "flex-end",
        paddingRight: 8,
        justifyContent: 'center',
    },
    scheduledTime: { color: "#94A3B8", fontSize: 14 },
    actualTime: { fontSize: 16, fontWeight: "700" },
    prevTimeColor: { color: "#94A3B8" },
    currentTimeColor: { color: "#22C55E" },
    
    // Timeline Column
    timelineColumn: { width: width * 0.1, alignItems: "center" },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        zIndex: 2,
    },
    prevDot: { backgroundColor: "#3B82F6" },
    upcomingDot: { backgroundColor: "#94A3B8" },
    
    blinkingMarkerContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#F87171",
        borderWidth: 2,
        borderColor: "#1E293B",
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
    },
    verticalLine: {
        position: "absolute",
        top: 12,
        bottom: -10,
        width: 2,
        backgroundColor: "#475569",
        zIndex: 1,
    },
    
    // Details Column
    detailsColumn: { flex: 1, paddingLeft: 10 },
    stationName: { color: "#fff", fontSize: 16, fontWeight: "700" },
    detailRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
    distanceText: { color: "#94A3B8", fontSize: 13, marginRight: 8 },
    distanceTextSmall: { color: "#94A3B8", fontSize: 11, marginRight: 8 },
    platformBadge: {
        flexDirection: "row",
        backgroundColor: "#0F172A",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 'auto',
    },
    platformText: { fontSize: 12, color: "#475569", marginRight: 3, fontWeight: '600' },
    platformNumber: { fontSize: 12, color: "#60A5FA", fontWeight: "bold" },
    depTimeLabel: { color: "#94A3B8", fontSize: 13, marginRight: 4, fontWeight: '500' },
    depTime: { color: "#E2E8F0", fontSize: 13, fontWeight: '500' },

    // Non-stop Toggle
    toggleButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 8 
    },
    toggleButtonText: { 
        color: "#60A5FA", 
        fontSize: 14, 
        fontWeight: '600' 
    },
    toggleIcon: { marginLeft: 5 },

    // Non-stop Details
    nonStopContainer: { 
      flexDirection: "column",
      marginLeft: width * 0.25, // Aligns with timeline column start
      paddingBottom: 5,
    },
    nonStopRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 5,
    },
    nonStopSpacer: {
        width: 0, // remove extra spacer
    },
    nonStopTimeline: {
        width: width * 0.1, 
        alignItems: 'center', 
        paddingTop: 4,
    },
    nonStopDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#64748B',
    },
    nonStopDetails: {
        flex: 1, 
        paddingLeft: 10
    },
    nonStopName: { 
        color: '#94A3B8', 
        fontSize: 13, 
        fontWeight: '500' 
    },
    nonStopDistance: { 
        color: '#64748B', 
        fontSize: 11 
    },
    searchCard: {
        width: width * 0.9,
        padding: 30,
        backgroundColor: "#1E293B",
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 15,
        borderWidth: 1,
        borderColor: '#334155',
    },
    searchTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E2E8F0',
        marginBottom: 8,
    },
    searchSubtitle: {
        fontSize: 16,
        color: '#94A3B8',
        marginBottom: 30,
        textAlign: 'center',
    },
    trainInputContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#0F172A',
        borderRadius: 10,
        overflow: 'hidden',
        height: 55,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    trainInput: {
        flex: 1,
        paddingHorizontal: 20,
        color: '#fff',
        fontSize: 18,
    },
    goButton: {
        backgroundColor: '#60A5FA',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchErrorText: {
        marginTop: 15,
        color: '#F87171',
        fontSize: 14,
        fontWeight: '600',
    }
});
