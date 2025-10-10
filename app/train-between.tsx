import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Animated,
} from "react-native";
import {
  ArrowLeft,
  TrainFront as Train,
  Calendar,
  Search,
  RefreshCw,
  ArrowDownUp,
  Filter,
  Zap,
} from "lucide-react-native";
import { router } from "expo-router";
import SearchableDropdown from "../components/SearchableDropdown";

// Helper component for the date button to match the visual style
const DateInput = ({ dateText, onPress }: { dateText: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.dateButton} onPress={onPress}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Calendar size={20} color="#64748B" style={{ marginRight: 8 }} />
      <View>
        <Text style={styles.dateLabel}>Departure Date</Text>
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
    </View>
    <View style={styles.filterButtonPlaceholder} />
  </TouchableOpacity>
);

interface TrainResult {
  train_number: string;
  train_name: string;
  train_type: string;
  has_pantry: boolean;
  score: number;
  from: string;
  from_station_name: string;
  from_std: string;
  from_day: number;
  to: string;
  to_station_name: string;
  to_std: string;
  to_day: number;
  duration: string;
  distance: number;
  halt_stn: number;
  class_type: string[];
  run_days: string[];
  is_monsoon_timing_applicable: boolean;
}

export default function TrainBetween() {
  const [fromCode, setFromCode] = useState("KUDL");
  const [toCode, setToCode] = useState("TNA");
  const [date, setDate] = useState(() => {
    const d = new Date();
    // Setting default date to tomorrow to better simulate real usage
    d.setDate(d.getDate() + 1); 
    return d.toISOString().slice(0, 10);
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TrainResult[]>([]); // Use the new interface
  const [showDatePicker, setShowDatePicker] = useState(false);

  const parsed = date.split("-");
  const initYear = parseInt(parsed[0], 10) || new Date().getFullYear();
  const initMonth = parseInt(parsed[1], 10) || (new Date().getMonth() + 1);
  const initDay = parseInt(parsed[2], 10) || new Date().getDate();

  const [pickYear, setPickYear] = useState(initYear);
  const [pickMonth, setPickMonth] = useState(initMonth);
  const [pickDay, setPickDay] = useState(initDay);

  const selectionScale = useRef(new Animated.Value(1)).current;

  // Open date picker and pre-fill to today's date
  const openDatePicker = () => {
    const now = new Date();
    setPickYear(now.getFullYear());
    setPickMonth(now.getMonth() + 1);
    setPickDay(now.getDate());
    setShowDatePicker(true);
  };

  const selectDay = (day: number) => {
    setPickDay(day);
    // simple bounce animation
    selectionScale.setValue(0.8);
    Animated.spring(selectionScale, { toValue: 1, useNativeDriver: true, friction: 6 }).start();
  };

  const stationOptions = [
    // Added NDLS and BCT to better simulate the image's context
    { id: "NDLS", label: "New Delhi (NDLS)", value: "NDLS" },
    { id: "BCT", label: "Mumbai Central (BCT)", value: "BCT" },
    { id: "KUDL", label: "KUDAL", value: "KUDL" },
    { id: "TNA", label: "TNA - THANE", value: "TNA" },
    { id: "PNVL", label: "PNVL - PANVEL", value: "PNVL" },
  ];

  // Logic to find station names for display in the dropdowns (optional but good UX)
  const fromStation = stationOptions.find(opt => opt.value === fromCode)?.label || 'From Station';
  const toStation = stationOptions.find(opt => opt.value === toCode)?.label || 'To Station';


  const fetchTrains = async () => {
    if (!fromCode || !toCode || !date) {
      setError("Please select both stations and a date.");
      return;
    }
    setError(null);
    setLoading(true);
    setResults([]);

    try {
      // Build API URL
      const url = `https://fastapi-backend-production-23ac.up.railway.app/irctc/train_btwn_stations/?fromstationcode=${encodeURIComponent(fromCode)}&tostationscode=${encodeURIComponent(toCode)}&dateofjourney=${encodeURIComponent(date)}`;
      const res = await fetch(url, { headers: { accept: 'application/json' } });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      if (!json || !json.data) throw new Error('Invalid API response');

      // Map API items to the UI shape expected by renderItem
      const mapped = (json.data || []).map((t: any) => ({
        train_number: t.train_number || String(t.train_number),
        train_name: t.train_name || t.train_name,
        train_type: t.train_type || t.train_type,
        has_pantry: t.has_pantry,
        score: t.score,
        from: t.from || fromCode,
        from_station_name: t.from_station_name || t.from_sta || '',
        from_std: t.from_std || t.from_sta || '',
        from_day: t.from_day ?? 0,
        to: t.to || toCode,
        to_station_name: t.to_station_name || t.to_sta || '',
        to_std: t.to_std || t.to_sta || '',
        to_day: t.to_day ?? 0,
        duration: t.duration || '',
        distance: t.distance,
        halt_stn: t.halt_stn,
        class_type: t.class_type || [],
        run_days: t.run_days || [],
        is_monsoon_timing_applicable: t.is_monsoon_timing_applicable,
      }));

      setResults(mapped);
    } catch (err: any) {
      console.warn('fetchTrains error', err);
      setError(err?.message || 'Failed to fetch trains');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: TrainResult }) => {
    // Helper to produce a status for each class (uses train id to vary for mock data)
    const getClassStatus = (trainNumber: string, cls: string) => {
      if (trainNumber === "12345") {
        if (cls === "3A") return { label: "Available", type: "available" };
        if (cls === "2A") return { label: "WL/12", type: "wl" };
        if (cls === "1A") return { label: "Available", type: "available" };
      }
      if (trainNumber === "12346") {
        if (cls === "3A") return { label: "WL/23", type: "wl" };
        if (cls === "2A") return { label: "Available", type: "available" };
        if (cls === "1A") return { label: "Available", type: "available" };
      }
      return { label: "Available", type: "available" };
    };

    return (
      <View style={styles.resultCard}>
        <View style={styles.resultHeader}>
          <View style={styles.trainMeta}>
            <Text style={styles.trainName}>{item.train_name}</Text>
            <View style={styles.trainDetails}>
              <Text style={styles.trainNumberText}>#{item.train_number}</Text>
              <Text style={styles.bulletSeparator}>•</Text>
              <Text style={styles.trainRunsText}>{item.run_days.join(", ")}</Text>
            </View>
          </View>

          <View style={styles.superfastBadge}>
            <Zap size={14} color="#FFFFFF" />
            <Text style={styles.superfastText}>{item.train_type}</Text>
          </View>
        </View>

        <View style={styles.timelineRow}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLarge}>{item.from_std}</Text>
            <Text style={styles.stationSmall}>{item.from_station_name}</Text>
          </View>

          <View style={styles.timelineCenter}>
            <View style={styles.lineWrapper}>
              <View style={styles.line} />
              <View style={styles.durationBubble}><Text style={styles.durationBubbleText}>{item.duration}</Text></View>
              <View style={styles.trainIconPlaceholder} />
            </View>
          </View>

          <View style={[styles.timeColumn, styles.timeColumnRight]}>
            <Text style={styles.timeLarge}>{item.to_std}{item.to_day > item.from_day}</Text>
            <Text style={styles.stationSmall}>{item.to_station_name}</Text>
          </View>
        </View>

        <View style={styles.classesContainerCard}>
          {item.class_type.map((cls: string) => {
            const st = getClassStatus(item.train_number, cls);
            return (
              <View key={cls} style={styles.classCard}>
                <Text style={styles.className}>{cls}</Text>
                <Text style={[styles.classStatus, st.type === 'available' ? styles.classAvailable : styles.classWL]}>{st.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };
  
  // Formats the date string for display
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  // Calendar helpers
  const getDaysInMonth = (year: number, month: number) => {
    // month: 1-12
    return new Date(year, month, 0).getDate();
  };

  const firstWeekdayOfMonth = (year: number, month: number) => {
    // returns 0 (Sun) - 6 (Sat)
    return new Date(year, month - 1, 1).getDay();
  };

  const buildMonthGrid = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = firstWeekdayOfMonth(year, month);
    const cells: Array<{ day: number | null }> = [];

    // leading blanks
    for (let i = 0; i < firstDay; i++) cells.push({ day: null });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });
    // pad the rest to complete weeks
    while (cells.length % 7 !== 0) cells.push({ day: null });
    return cells;
  };

  const monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];


  return (
    <View style={styles.container}>
      {/* Blue Header Section */}
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Search Trains</Text>
          <Text style={styles.headerSubtitle}>Find your perfect journey</Text>
        </View>

        {/* right spacer for perfect centering */}
        <View style={styles.headerRightPlaceholder} />
      </View>
      
      {/* Search Form Card is rendered as the FlatList header so it scrolls with results */}
      
      {/* Results List - the FlatList now includes the search form as its header so it scrolls */}
      <View style={styles.resultsListContainer}>
        {error ? (
          <View style={{ padding: 12 }}>
            <Text style={{ color: "#B91C1C" }}>Error: {error}</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item, i) => (item?.train_number || String(i))}
            renderItem={renderItem}
            contentContainerStyle={styles.flatListContent}
            ListHeaderComponent={() => (
              <View>
                {/* compact search card header */}
                <View style={styles.formSection}>
                  <View style={styles.searchContainer}>
                    <View style={styles.stationContainer}>
                      {/* Station Marker and Input Fields */}
                      <View style={styles.stationMarker}>
                        <View style={[styles.stationDot, { backgroundColor: "#22C55E" }]} />
                        <View style={styles.stationLine} />
                        <View style={[styles.stationDot, { backgroundColor: "#EF4444" }]} />
                      </View>

                      <View style={{ flex: 1 }}>
                        {/* From Input */}
                        <View style={styles.stationInput}>
                          <SearchableDropdown
                            options={stationOptions}
                            selectedValue={fromCode}
                            onSelect={(opt) => setFromCode(opt?.value || "")}
                            placeholder="New Delhi (NDLS)"
                          />
                        </View>
                        {/* To Input */}
                        <View style={styles.stationInput}>
                          <SearchableDropdown
                            options={stationOptions}
                            selectedValue={toCode}
                            onSelect={(opt) => setToCode(opt?.value || "")}
                            placeholder="Mumbai Central (BCT)"
                          />
                        </View>
                      </View>

                      {/* Switch Button (compact) */}
                      <TouchableOpacity
                        style={styles.switchButton}
                        onPress={() => {
                          const temp = fromCode;
                          setFromCode(toCode);
                          setToCode(temp);
                        }}
                      >
                        <ArrowDownUp size={18} color="#2563EB" />
                      </TouchableOpacity>
                    </View>

                    {/* Date and Search Actions */}
                            <View style={styles.dateAndSearchActions}>
                              <DateInput dateText={formattedDate} onPress={openDatePicker} />
                      
                      {/* Search Button and Filter Button */}
                      <View style={styles.searchActions}>
                        <TouchableOpacity style={[styles.searchButton, loading && { opacity: 0.7 }]} onPress={fetchTrains} disabled={loading}>
                          <Zap size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                          <Text style={styles.searchButtonText}>Search Trains</Text>
                          {loading && <ActivityIndicator size="small" color="#FFFFFF" style={{ marginLeft: 8 }} />}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {/* results header */}
                <View style={styles.resultsHeader}>
                  <Text style={styles.resultsTitle}>{results.length} Trains Found</Text>
                  <TouchableOpacity onPress={() => console.log('Sort by Departure')}>
                    <Text style={styles.sortText}>Sort by Departure</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={() => (
              !loading && (
                <View style={{ padding: 12 }}>
                  <Text style={{ color: "#475569", textAlign: 'center' }}>No trains found for this route and date.</Text>
                </View>
              )
            )}
          />
        )}
      </View>
      
      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Journey Date</Text>

            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  style={styles.monthNavButton}
                  onPress={() => {
                    // prev month
                    let m = pickMonth - 1;
                    let y = pickYear;
                    if (m < 1) { m = 12; y -= 1; }
                    setPickMonth(m); setPickYear(y);
                    setPickDay(1);
                  }}
                >
                  <Text style={{ color: '#2563EB' }}>{'<'}</Text>
                </TouchableOpacity>

                <Text style={styles.monthText}>{monthNames[pickMonth - 1]} {pickYear}</Text>

                <TouchableOpacity
                  style={styles.monthNavButton}
                  onPress={() => {
                    // next month
                    let m = pickMonth + 1;
                    let y = pickYear;
                    if (m > 12) { m = 1; y += 1; }
                    setPickMonth(m); setPickYear(y);
                    setPickDay(1);
                  }}
                >
                  <Text style={{ color: '#2563EB' }}>{'>'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekdaysRow}>
                {['S','M','T','W','T','F','S'].map((w, index) => (
                    <Text key={index} style={styles.weekdayText}>{w}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {buildMonthGrid(pickYear, pickMonth).map((cell, idx) => {
                  const isSelected = cell.day === pickDay;
                  const today = new Date();
                  const isPast = cell.day !== null && (new Date(pickYear, pickMonth - 1, cell.day) < new Date(today.getFullYear(), today.getMonth(), today.getDate()));
                  return (
                    <TouchableOpacity
                      key={`${pickYear}-${pickMonth}-${idx}`}
                      style={styles.dayCell}
                      onPress={() => { if (cell.day && !isPast) selectDay(cell.day); }}
                      activeOpacity={cell.day && !isPast ? 0.7 : 1}
                      disabled={!cell.day || isPast}
                    >
                      {cell.day ? (
                        isSelected ? (
                          <Animated.View style={[styles.dayCellSelectedWrap, { transform: [{ scale: selectionScale }] }]}>
                            <Text style={styles.dayTextSelected}>{String(cell.day)}</Text>
                          </Animated.View>
                        ) : (
                          <Text style={[styles.dayText, isPast ? styles.dayCellInactive : {}]}>{String(cell.day)}</Text>
                        )
                      ) : (
                        <Text style={styles.dayCellInactive}> </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowDatePicker(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={() => {
                  const mm = String(pickMonth).padStart(2, "0");
                  const dd = String(pickDay).padStart(2, "0");
                  const newDate = `${pickYear}-${mm}-${dd}`;
                  setDate(newDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.modalButtonTextPrimary}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // --- Header Styles (Enhanced to match the image's "Search Trains" and "Find your perfect journey") ---
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 40,
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // avoid wrapping which caused header to expand vertically
    flexWrap: 'nowrap',
    minHeight: 56,
  },
  backButton: { padding: 8, marginLeft: 0 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 12, color: '#DBEAFE', marginTop: 2 },
  headerCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerRightPlaceholder: { width: 40 },

  // --- Search Form Styles (Key changes for the image match) ---
  formSection: {
    paddingHorizontal: 12,
    marginTop: -4, // Slightly lower the search card so it sits a bit further from the header
  },
  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  stationContainer: { 
    flexDirection: 'row', 
    alignItems: 'stretch', 
    position: 'relative', // For positioning the switch button
    paddingRight: 40, // Make room for the switch button
  },
  stationMarker: { 
    width: 20, 
    alignItems: 'center', 
    marginRight: 8, 
    paddingVertical: 4, // allow marker to span inputs
    marginTop: 8,
    justifyContent: 'space-between',
    height: 56,
  },
  stationDot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    zIndex: 1, 
    borderWidth: 2, 
    borderColor: '#FFFFFF' 
  },
  stationLine: { 
    width: 2, 
    flex: 1, 
    backgroundColor: '#E2E8F0', 
    marginVertical: 2, 
    position: 'absolute', 
    top: 12, 
    bottom: 12,
  },
  stationInput: { marginBottom: 8 },
  
  // Switch Button (Highly customized to match the image)
  switchButton: {
    position: 'absolute',
    top: '50%',
    right: 0, // Position to the far right of the station inputs area
    transform: [{ translateY: -14 }], // Center it vertically
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DBEAFE', // Lighter blue background
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 2,
    elevation: 2,
  },

  dateAndSearchActions: {
    marginTop: 10,
  },

  // Date Button (Highly customized to match the image)
  dateButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButtonPlaceholder: {
    // Hidden in the date picker, but used to occupy the space to keep the layout consistent
  },
  dateLabel: { fontSize: 13, color: '#64748B', marginBottom: 2 },
  dateText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },

  // Search Actions (Highly customized to match the image)
  searchActions: { 
    marginTop: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchButton: { 
    flex: 1,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#2563EB', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 12, 
  },
  searchButtonText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '700' 
  },
  
  // --- Results List Styles ---
  resultsListContainer: { 
    flex: 1, 
    paddingHorizontal: 15,
    marginTop: 15, 
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginTop: 15,
  },
  sortText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginTop: 15,

  },
  flatListContent: {
    paddingBottom: 20, // Add padding to the end of the list
  },
  resultCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 10, 
    marginTop: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 2.5, 
    elevation: 1 
  },
  resultHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  trainMeta: { 
    flex: 1 
  },
  trainName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1E293B', 
    marginBottom: 2 
  },
  trainDetails: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  trainNumberText: { 
    fontSize: 13, 
    color: '#64748B' 
  },
  bulletSeparator: { 
    marginHorizontal: 4, 
    color: '#CBD5E1' 
  },
  trainRunsText: { 
    fontSize: 13, 
    color: '#64748B' 
  },
  superfastBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316', // Orange for Superfast
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  superfastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },

  journeyTimeline: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 8,
  },
  timeBlock: { 
    flex: 1, 
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  timeBlockEnd: { 
    alignItems: 'flex-end' 
  },
  timeValue: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#0F172A' 
  },
  timeValueEnd: { 
    marginTop: 10,
  },
  durationText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#64748B', 
    marginVertical: 4 
  },
  stationCode: {
    fontSize: 16, 
    fontWeight: '600', 
    color: '#1E293B', 
    marginBottom: 2
  },
  stationCodeEnd: {
    marginTop: 10,
  },
  dayIndicator: { 
    fontSize: 12, 
    color: '#64748B' 
  },
  
  journeyMeta: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: 60,
    height: '100%',
    position: 'relative',
  },
  timelineDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#22C55E', 
    position: 'absolute', 
    top: 5 
  },
  timelineLine: { 
    width: 2, 
    height: '100%', 
    backgroundColor: '#E2E8F0' 
  },
  timelineDotEnd: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#EF4444', 
    position: 'absolute', 
    bottom: 5 
  },

  timelineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  timeColumn: { flex: 1, alignItems: 'flex-start' },
  timeColumnRight: { alignItems: 'flex-end' },
  timeLarge: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  stationSmall: { fontSize: 11, color: '#64748B', marginTop: 4 },
  timelineCenter: { width: 120, alignItems: 'center', justifyContent: 'center' },
  lineWrapper: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  line: { height: 2, backgroundColor: '#60A5FA', width: '80%', borderRadius: 2 },
  durationBubble: { position: 'absolute', top: -12, backgroundColor: '#BFDBFE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  durationBubbleText: { color: '#075985', fontWeight: '700', fontSize: 12 },
  trainIconPlaceholder: { width: 28, height: 14, backgroundColor: '#FFFFFF', borderRadius: 6, marginTop: 12 },

  classesContainerCard: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderColor: '#F1F5F9' },
  classCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center', marginRight: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 1.5, elevation: 0 },
  className: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  classStatus: { fontSize: 12, fontWeight: '600' },
  classAvailable: { color: '#10B981' },
  classWL: { color: '#F97316' },

  classesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  durationBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12,
    marginRight: 8,
  },
  durationTimeText: {
    fontSize: 13, 
    fontWeight: '600', 
    color: '#334155' 
  },
  durationDayText: {
    fontSize: 10, 
    fontWeight: '700', 
    color: '#64748B',
    marginLeft: 4,
  },
  classChips: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    flex: 1,
    justifyContent: 'flex-end',
  },
  classChip: { 
    backgroundColor: '#EFF6FF', 
    paddingHorizontal: 8, 
    paddingVertical: 3, 
    borderRadius: 8, 
    marginLeft: 6 
  },
  classText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#2563EB' 
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(2,6,23,0.6)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginBottom: 12, textAlign: 'center' },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  // Calendar styles
  calendarContainer: { backgroundColor: '#FFFFFF' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  monthNavButton: { padding: 8, borderRadius: 8, backgroundColor: '#EFF6FF' },
  monthText: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  weekdaysRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  weekdayText: { width: 32, textAlign: 'center', color: '#64748B', fontSize: 12, fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  dayCell: { width: `${100/7}%`, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' },
  dayText: { color: '#0F172A' },
  dayCellInactive: { color: '#CBD5E1' },
  dayCellSelectedWrap: { backgroundColor: '#2563EB', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  dayTextSelected: { color: '#FFFFFF', fontWeight: '700' },
  modalButton: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, marginLeft: 8 },
  modalButtonPrimary: { backgroundColor: '#2563EB' },
  modalButtonText: { color: '#64748B', fontSize: 14, fontWeight: '500' },
  modalButtonTextPrimary: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});