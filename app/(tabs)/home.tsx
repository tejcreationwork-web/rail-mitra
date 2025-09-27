
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, TextInput, Image, 
  Alert
} from 'react-native';
import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { router } from 'expo-router';
import { ChevronDown,ChevronUp,ChevronRight,Train,Trash2,RefreshCw, MapPin, Bell, Ticket, Search, Mic, FileText,CircleHelp,Bed} from 'lucide-react-native';
import { qaService, Question } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';  //get next journey pnr from async storage
import { getStatusColor ,formatJourneyDate} from './savedPNR';
import { APIResponse} from '@/components/types';
import fetchPNRStatus from '@/lib/apis';


// Define type for SavedPNR
interface SavedPNR {
  id: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  sourceDoj: string;
  destinationDoj: string;
  journeyClass: string;
  boardingPoint: string;
  reservationUpto : string;
  arrivalTime: string;
  departureTime: string;
  expectedPlatformNumber : number | string;
  ticketFare : number;
  hasPantry : boolean;
  bookingDate : string;
  quota : string;
  coachPosition : string;
  passengerCount : number;
  chartPrepared : boolean;
  passengers: {
    number: string;
    status: string;
    coach: string;
    berth: string | number;
    seat: number | string;
  }[];
  lastChecked: string;
  savedAt: string;
  isRefreshing?: boolean;
};

export default function HomeScreen() {
  const [latestQuestions, setLatestQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  
  const [savedPNRs, setSavedPNRs] = useState<SavedPNR[]>([]);
  const [nextJourneyPNR, setNextJourneyPNR] = useState<string | null>(null);
  const [nextJourney, setNextJourney] = useState<SavedPNR | null>(null);
  
  useEffect(() => {
    loadPNRs();
    loadNextJourney();
  }, []);

   // Load saved PNRs list
  const loadPNRs = async () => {
    try {
      const data = await AsyncStorage.getItem("savedPNRs");
      if (data) {
        setSavedPNRs(JSON.parse(data));
      }
    } catch (error) {
      console.error("Error loading saved PNRs:", error);
    } finally {
      setIsDataLoaded(true);  // ✅ ensures UI loads
    }
  };


  // Load Next Journey booking
  const loadNextJourney = async () => {
    try {
      const data = await AsyncStorage.getItem("nextJourney");
      if (data) {
        const parsed = JSON.parse(data) as SavedPNR;
        setNextJourneyPNR(parsed.pnr);   // store PNR id
        setNextJourney(parsed);          // store full object
      }
    } catch (error) {
      console.error("Error loading next journey:", error);
    }
  };

  const [isNextJourneyExpanded, setIsNextJourneyExpanded] = useState(false);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const chartNotPrepared = nextJourney?.chartPrepared === false;

  const handleRefreshPNR = async (pnrId: string) => {
    const pnrToRefresh = savedPNRs.find((p) => p.id === pnrId);
    if (!pnrToRefresh) return;

    setSavedPNRs((prev) =>
      prev.map((pnr) =>
        pnr.id === pnrId ? { ...pnr, isRefreshing: true } : pnr
      )
    );

    try {
      const response: APIResponse = await fetchPNRStatus(pnrToRefresh.pnr); 

      if (response.status && response.data) {
        const updatedPNR: SavedPNR = {
          ...pnrToRefresh,
          trainNumber: response.data.TrainNo,
          trainName: response.data.TrainName,
          from: response.data.BoardingPoint || "-",
          to: response.data.ReservationUpto || "-",
          sourceDoj: response.data.SourceDoj || "-",
          destinationDoj : response.data.DestinationDoj || "-",
          journeyClass: response.data.Class || "-",
          boardingPoint: response.data.BoardingPoint || "-",
          arrivalTime: response.data.ArrivalTime || "-",
          departureTime: response.data.DepartureTime || "-",
          chartPrepared: response.data.ChartPrepared || false,
          passengers: response.data.PassengerStatus?.map((p, index) => ({
            number: pnrToRefresh.passengers[index]?.number || `P${index+1}`,
            status: p.CurrentStatusNew || p.BookingStatusNew || "Unknown",
            coach: p.CurrentCoachId || p.BookingCoachId || "-",
            berth: p.CurrentBerthCode || p.BookingBerthCode || "-",
            seat: p.CurrentBerthNo || p.BookingBerthNo || "-",
          })) || [],
          savedAt: pnrToRefresh.savedAt || new Date().toLocaleDateString("en-IN"),
          lastChecked: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }),
          isRefreshing: false,
        };

        const updatedPNRs = savedPNRs.map((pnr) =>
          pnr.id === pnrId ? updatedPNR : pnr
        );
        setSavedPNRs(updatedPNRs);
        await AsyncStorage.setItem("savedPNRs", JSON.stringify(updatedPNRs));

        Alert.alert("✅ Updated", "PNR status refreshed successfully");
      } else {
        throw new Error(response.message || "Failed to fetch PNR status");
      }
    } catch (error) {
      setSavedPNRs((prev) =>
        prev.map((pnr) =>
          pnr.id === pnrId ? { ...pnr, isRefreshing: false } : pnr
        )
      );

      Alert.alert("❌ Refresh Failed", error instanceof Error ? error.message : "Network error");
    }
  };


  const handleDeletePNR = async (pnrId: string) => {
    // 1. Find the PNR object before deleting it from state/storage
    const pnrToDelete = savedPNRs.find((p) => p.id === pnrId);
    
    // Safety check
    if (!pnrToDelete) {
      console.error('PNR not found for deletion:', pnrId);
      return;
    }

    Alert.alert('Delete PNR', `Are you sure you want to delete PNR ${pnrToDelete.pnr}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          // --- 2. Remove the PNR from the main list ---
          const updatedPNRs = savedPNRs.filter((p) => p.id !== pnrId);
          setSavedPNRs(updatedPNRs);
          await AsyncStorage.setItem('savedPNRs', JSON.stringify(updatedPNRs));
          
          if (nextJourneyPNR === pnrToDelete.pnr) {
            await AsyncStorage.removeItem('nextJourney');
            setNextJourneyPNR(null);
            // Optional: Add a subtle confirmation for the user
            // Toast.show({ type: 'success', text1: 'Next Journey removed' });
          }
          // Optional: Confirmation for the main deletion
          // Toast.show({ type: 'info', text1: `PNR ${pnrToDelete.pnr} deleted` });
        },
      },
    ]);
  };

  // Defined inside the HomeScreen component
  const toggleNextJourneyExpanded = () => {
    setIsNextJourneyExpanded(prev => !prev);
  };


  const services = [
    { id: 'pnr_status', title: 'PNR\nStatus', icon: Ticket, route: '/pnr-checker', color: '#3A8DFF' },
    { id: 'nearby_stations', title: 'Nearby\nStations', icon: MapPin, route: '/station-layout', color: '#F2994A' },
    { id: 'track_train', title: 'Train\nTimes', icon: Train, route: '/train-timetable', color: '#3D99C2' },
    { id: 'chart_vacancy', title: 'Chart Vacancy', icon: FileText, route: '/chart_vacancy', color: '#3A8DFF' },
    { id: 'retiring_rooms', title: 'Retiring Rooms', icon: Bed, route: '/retiring_rooms', color: '#F2994A' },
    { id: 'help_support', title: 'Help &\nSupport', icon: CircleHelp, route: '/emergency_contact', color: '#3D99C2' },
  ];

  useEffect(() => {
    const loadLatestQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const questions = await qaService.getQuestions();
        setLatestQuestions(questions.slice(0, 3));
      } catch (error) {
        console.error('Error loading latest questions:', error);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    loadLatestQuestions();
  }, []);

  const handleServicePress = (route: string) => router.push(route as any);
  if (!isDataLoaded) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={require("../../assets/logo/raileaselogo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>RailEase</Text>
            <Text style={styles.headerSubtitle}>Your Railway Travel Companion</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#0e0d0dff" />
            <View style={styles.notificationDot} /> 
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trains, stations or PNR"
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity style={styles.micButton}>
            <Mic size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* My Next Journey Section (Widget) */}
        <View style={[
          styles.journeySection, 
          nextJourney ? styles.nextJourneyActiveCard : styles.nextJourneyEmptyCard
        ]}>
          
          {nextJourney ? (
            <>
              {/* HEADER: Title, Actions, Train Info, PNR, Status, and Updated Time */}
              <View style={styles.nextJourneyHeader}>
                <View style={styles.nextJourneyHeaderRow}>
                  <Text style={styles.nextJourneyTitle}>My Next Journey</Text>
                  <View style={styles.nextJourneyActions}>
                    <TouchableOpacity onPress={() => handleRefreshPNR(nextJourney.id)} style={{marginRight: 10}}>
                      <RefreshCw size={18} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePNR(nextJourney.id)} style={{marginRight: 10}}>
                      <Trash2 size={18} color="#64748B" />
                    </TouchableOpacity>
                    
                    {/* EXPAND/COLLAPSE BUTTON: Uses dedicated state and toggler */}
                    <TouchableOpacity onPress={toggleNextJourneyExpanded}>
                      {isNextJourneyExpanded ? (
                        <ChevronUp size={18} color="#64748B" />
                      ) : (
                        <ChevronDown size={18} color="#64748B" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 1. Train Info (Larger/Top) */}
                <Text style={styles.journeyTrainInfo}>
                  {nextJourney.trainNumber} - {nextJourney.trainName}
                </Text>
                {/* 2. PNR Info (Smaller/Below) */}
                <View style={styles.pnrRow}>
                  <Text style={styles.journeyPnrInfo}>
                    PNR: {nextJourney.pnr}
                  </Text>
                  <Text
                    style={[
                      styles.chartText,
                      { color: chartNotPrepared ? "#DC2626" : "#059669" },
                    ]}
                  >
                    {chartNotPrepared ? "Chart Not Prepared" : "Chart Prepared"}
                  </Text>
                </View>
              </View>  
           
              {/* JOURNEY TIMELINE (Always visible) */}
              <View style={styles.nextJourneyTimeline}>
                <View style={styles.timelineStationBlock}>
                  <Text style={styles.timelineDateText}>{formatJourneyDate(nextJourney?.sourceDoj)}</Text>
                  <Text style={styles.timelineStationCode}>{nextJourney?.boardingPoint?.substring(0, 4) || "----"}</Text>
                  <Text style={styles.timelineTime}>{nextJourney.arrivalTime}</Text> 
                </View>

                <View style={styles.timelineCenter}>
                  <Text style={styles.timelineArrowText}>→</Text>
                </View>

                <View style={styles.timelineStationBlock}>
                  <Text style={styles.timelineDateText}>{formatJourneyDate(nextJourney?.destinationDoj)}</Text>
                  <Text style={styles.timelineStationCode}>{nextJourney.reservationUpto.substring(0, 4)}</Text>
                  <Text style={styles.timelineTime}>
                    {nextJourney.departureTime}
                  </Text>
                </View>
              </View>
              
              {/* EXPANDED CONTENT: Only render if isNextJourneyExpanded is TRUE */}
              {isNextJourneyExpanded && (
                <>
                  {/* PASSENGER DETAILS (Matches image styling) */}
                  <View style={styles.nextJourneyPassengerBlock}>
                    <Text style={styles.nextJourneySectionTitle}>👤 Passenger Details</Text> 
                    
                    {/* Passgenger 1 Details */}
                    <View style={styles.nextJourneyFirstPassenger}>
                      <View style={styles.passengerInfoDetails}>
                        <Text style={styles.passengerName}>
                          Passenger : {nextJourney.passengers[0]?.number || 'Passenger 1'} {/* Use 'name' property */}
                        </Text>
                      </View>
                      <View style={[
                        styles.statusTagSmall, 
                        { backgroundColor: getStatusColor(nextJourney.passengers[0]?.status || 'Unknown') }
                      ]}>
                        <Text style={styles.statusTagTextSmall}>
                          {nextJourney.passengers[0]?.status || 'N/A'}
                        </Text>
                      </View>
                    </View>
                    {/* New: Two-row layout for Coach, Berth, Seat */}
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,marginHorizontal:16 }}>
                        <Text style={{ flex: 1, textAlign: 'left', color: '#64748B', fontWeight: '600' }}>Coach</Text>
                        <Text style={{ flex: 1, textAlign: 'center', color: '#64748B', fontWeight: '600' }}>Berth</Text>
                        <Text style={{ flex: 1, textAlign: 'right', color: '#64748B', fontWeight: '600' }}>Seat</Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,marginHorizontal:20  }}>
                        <Text style={{ flex: 1, textAlign: 'left', color: '#1E293B',fontWeight: '600' }}>{nextJourney.passengers[0]?.coach || '-'}</Text>
                        <Text style={{ flex: 1, textAlign: 'center', color: '#1E293B',fontWeight: '600' }}>{nextJourney.passengers[0]?.berth || '-'}</Text>
                        <Text style={{ flex: 1, textAlign: 'right', color: '#1E293B',fontWeight: '600'}}>{nextJourney.passengers[0]?.seat || '-'}</Text>
                    </View>
                    
                    {/* Booking Details Section */}
                    <View style={styles.nextJourneySectionSeparator} />
                    <Text style={styles.nextJourneySectionTitle}>Booking Details</Text>
                    
                    <View style={styles.bookingDetailsRow}>
                      <View style={styles.bookingDetailItem}>
                        <Text style={styles.bookingDetailLabel}>Class:</Text>
                        <Text style={styles.bookingDetailValue}>{nextJourney.journeyClass}</Text>
                      </View>
                      <View style={styles.bookingDetailItem}>
                        <Text style={styles.bookingDetailLabel}>Quota:</Text>
                        <Text style={styles.bookingDetailValue}>{nextJourney.quota || 'GN'}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.bookingDetailsRow}>
                      <View style={styles.bookingDetailItem}>
                        <Text style={styles.bookingDetailLabel}>Expected PF:</Text>
                        <Text style={styles.bookingDetailValue}>{nextJourney.expectedPlatformNumber}</Text>
                      </View>
                      <View style={styles.bookingDetailItem}>
                        <Text style={styles.bookingDetailLabel}>Total Fare:</Text>
                        <Text style={styles.bookingDetailValue}>₹{nextJourney.ticketFare}</Text>
                      </View>
        
                    </View>
                  </View>

                  {/* CALL TO ACTION BUTTON */}
                  <TouchableOpacity 
                    style={styles.liveStatusButton} 
                    onPress={() => router.push(`/train-timetable`)}
                  >
                    <Text style={styles.liveStatusText}>View Live Status</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              {/* EMPTY STATE */}
              <Text style={styles.journeyPlus}>+</Text>
              <Text style={styles.nextJourneyTitle}>My Next Journey</Text>
              <Text style={styles.journeySubtitleEmpty}>
                Add your PNR and make your journey better
              </Text>
              <TouchableOpacity
                style={styles.addPnrButton}
                onPress={() => router.push("/pnr-checker")}
              >
                <Text style={styles.addPnrText}>Add PNR</Text>
              </TouchableOpacity>
            </>
          )}
        </View>


        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickActionsScroll}
        >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.quickActionCard, { backgroundColor: service.color }]}
                onPress={() => handleServicePress(service.route)}
                activeOpacity={0.7}
              >
                <IconComponent size={28} color="#FFFFFF" />
                <Text style={styles.quickActionTitle}>{service.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Latest Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>News alert</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.newsCard}>
            <Image
              source={require("../../assets/images/train_news.jpg")}
              style={styles.newsImage}
            />
            <View style={styles.newsText}>
              <Text style={styles.newsTitle}>Aadhaar-linked train ticket booking mandate from October 1</Text>
              <Text style={styles.newsSubtitle} numberOfLines={2}>
                From Oct 1, only Aadhaar-linked IRCTC accounts can book train tickets in the first 15 mins of reservations.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFFFFF', paddingTop: 50, paddingBottom: 24, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  logoImage: { width: 60, height: 60, marginRight: 12 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#052861ff' },
  headerSubtitle: { fontSize: 11, color: '#15181bff' },
  notificationButton: { marginLeft: 'auto', position: 'relative', padding: 6 },
  notificationDot: { position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 16, paddingHorizontal: 10, paddingVertical: 8, marginTop:0, elevation: 3 },
  searchInput: { flex: 1, fontSize: 16, color: '#1E293B', marginLeft: 8 },
  micButton: { backgroundColor: "#2563EB", borderRadius: 20, padding: 8, marginLeft: 8 },

  content: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },

  // My Journey Section
  journeySection: { backgroundColor: "#d4e2f3ff", borderRadius: 12, padding: 20,borderWidth:1,borderColor:"#b9d1f5ff", marginBottom: 20,alignItems:'stretch'},
  journeyTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B" ,marginBottom:4},
  journeyPlus: { fontSize:40,color:"#3A8DFF",marginBottom:6},
  journeySubtitle: { fontSize: 13, color: "#64748B",textAlign: "center",marginBottom: 12},
  addPnrButton: { backgroundColor: "#2563EB", paddingVertical: 8, paddingHorizontal: 20, borderRadius: 15,marginTop:8 },
  addPnrText: { color: "#FFFFFF", fontWeight: "700" },

  // Sections
  section: { marginBottom: 24, paddingHorizontal: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
  newsCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  newsImage: { width: 100, height: 80 },
  newsText: { flex: 1, padding: 10 },
  newsTitle: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  newsSubtitle: { fontSize: 12, color: '#64748B' },
  //quick Actions
  quickActionsScroll: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  quickActionCard: {
    width: 80,
    height: 90,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 15,
  },
  quickActionTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  //nextJourneystylesheet
  nextJourneyTitle: {
    fontSize: 16,
    fontWeight: "700",
    alignContent: "flex-start",
  },
  nextJourneyActiveCard: {
    backgroundColor: '#e5eff8ff', // White background for active card
  },
  nextJourneyEmptyCard: {
    backgroundColor: '#E0E7FF', // Light blue background for empty state
    alignItems: 'center',
  },

  // Active Card Header Styles
  nextJourneyHeader: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 10,
  },
  nextJourneyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nextJourneyActions: {
    flexDirection: 'row',
  },
  journeyTrainInfo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  journeyPnrInfo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    marginTop: 4,
  },

  // Status Row
  nextJourneyStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusTag: { // Reused from BookingScreen, ensure colors are accessible
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusTagText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  journeyUpdatedTime: {
    fontSize: 12,
    color: '#94A3B8',
  },

  // Journey Timeline Styles
  nextJourneyTimeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",   // ✅ keeps vertical alignment consistent
    paddingVertical: 1,
    marginBottom: 10,
  },
  timelineStationBlock: {
    alignItems: 'center',
    flex: 1,
  },
  timelineStationCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
    textAlign: 'center',
  },
  timelineStationName: {
    fontSize: 14,
    color: '#64748B',
  },
  timelineTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: "center",   // ✅

  },
  timelineCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.5,
    paddingTop: 10,
  },
  timelineLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    width: '100%',
    position: 'absolute',
    top: 10,
  },
  timelineDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    position: 'absolute',
    top: 20,
    left: 0,
  },
  timelineArrowText: { // New style for the arrow text
    fontSize: 30,
    color: '#94A3B8',
    position: 'absolute',
    zIndex: 3,
    paddingHorizontal: 5,
  },
  timelineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#94A3B8',
    position: 'absolute',
    top: 22,
    right: 0,
  },
  timelineArrow: {
    fontSize: 20,
    color: '#94A3B8',
    position: 'absolute',
    top: 15,
  },
  timelineDateIcon: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'absolute',
    top: 40,
  },
  timelineDateText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },

  // Passenger Block
  nextJourneyPassengerBlock: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: "flex-start",   // ✅ align left
    width: "100%",
  },
  nextJourneyFirstPassenger: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },

  // CTA Button
  liveStatusButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  liveStatusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  nextJourneySubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  // Empty State Styles
  journeySubtitleEmpty: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  nextJourneySectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  passengerInfoDetails: {
    flexDirection: 'column',
  }, 
  // Reusing small status tag styles from BookingScreen for the passenger status
  statusTagSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statusTagTextSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  nextJourneySectionSeparator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 15,
  },

  // Booking details grid
  bookingDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: "flex-start",    // ✅ keeps text aligned at top
    width: "100%",
  },
  bookingDetailItem: {
    flex: 1,
    flexDirection: 'column',
    paddingRight: 10,   // ✅ spacing between columns
  },

  bookingDetailLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  bookingDetailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
    marginLeft:10
  },
  pnrRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    marginTop:5,
  },

  chartStatusBlock: {
    marginLeft: 10, 
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  chartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626', // Default to red
    textAlign: 'right',
    marginTop: 4,
  },
});