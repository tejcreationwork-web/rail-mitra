import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
// NOTE: fetchPNRStatus is assumed to be implemented in '@/lib/apis'
import fetchPNRStatus from '@/lib/apis'; 

import {
  ChevronDown,
  ChevronUp,
  Plus,
  RefreshCw,
  Trash2,
  Train,
  ArrowLeft,
  Star,
  StarOff
} from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';

type SavedPNR = {
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
    age?: number;
    status: string;
    coach: string;
    berth: string | number;
    seat: number | string;
  }[];
  lastChecked: string;
  savedAt: string;
  isRefreshing?: boolean;
};

type APIResponse = {
  status: boolean;
  message: string;
  timestamp: number;
  data?: {
    Pnr: string;
    TrainNo: string;
    TrainName: string;
    SourceDoj: string;
    DestinationDoj : string;
    Class: string;
    ReservationUpto: string;
    BoardingPoint: string;
    ArrivalTime: string;
    DepartureTime: string;
    ChartPrepared : boolean;
    PassengerStatus: {
      BookingStatus?: string;
      CurrentStatus?: string;
      BookingCoachId?: string;
      CurrentCoachId?: string;
      CurrentStatusNew?: string;
      BookingStatusNew?: string;
      BookingBerthCode?: string;
      CurrentBerthCode?: string;
      BookingBerthNo?: string;
      CurrentBerthNo?: string;
    }[];
  };
};

// --- Utility Functions ---

export const getStatusColor = (status: string) => {
  const normalizedStatus = status.toUpperCase().replace(/\/\d+/, '').trim();
  switch (normalizedStatus) {
    case 'CONFIRMED':
    case 'CNF':
      return '#059669'; // Green
    case 'WAITLISTED':
    case 'WL':
      return '#F59E0B'; // Amber/Orange
    case 'RAC':
      return '#2563EB'; // Blue
    case 'CANCELLED':
    case 'CAN':
      return '#DC2626'; // Red
    default:
      return '#64748B'; // Gray/Slate
  }
};

const formatStatus = (status: string) => {
  const normalizedStatus = status.toUpperCase().replace(/\/\d+/, '').trim();
  switch (normalizedStatus) {
    case 'CNF':
      return 'Confirmed';
    case 'WL':
      return 'Waitlisted';
    case 'RAC':
      return 'RAC';
    case 'CAN':
      return 'Cancelled';
    default:
      return status;
  }
};

export const formatJourneyDate = (dateString: string): string => {
  // Attempt to parse the date. It handles both YYYY-MM-DD and DD-MM-YYYY formats.
  const dateParts = dateString.split(/[-/]/);
  let date: Date;

  if (dateParts.length === 3) {
      // Check for DD-MM-YYYY format (common in India) or YYYY-MM-DD
      const [p1, p2, p3] = dateParts;
      if (p1.length === 4) {
          // YYYY-MM-DD format (Standard)
          date = new Date(Number(p1), Number(p2) - 1, Number(p3));
      } else {
          // DD-MM-YYYY format
          date = new Date(Number(p3), Number(p2) - 1, Number(p1));
      }
  } else {
      date = new Date(dateString);
  }
  
  if (isNaN(date.getTime())) {
      return 'Date Not Found';
  }

  const day = date.getDate();
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Sun"
  const month = date.toLocaleDateString('en-US', { month: 'short' });      // e.g., "Sep"

  // Function to get the ordinal suffix (st, nd, rd, th)
  const getOrdinal = (d: number): string => {
      if (d > 3 && d < 21) return 'th'; // 11th, 12th, 13th
      switch (d % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
      }
  };

  return `${dayOfWeek}, ${month} ${day}${getOrdinal(day)}`; // e.g., "Sun, Sep 21st"
};

interface BookingCardProps {
  booking: SavedPNR;
  expandedPNRs: Set<string>;
  toggleExpanded: (pnrId: string) => void;
  formatStatus: (status: string) => string;
  getStatusColor: (status: string) => string;
  nextJourneyPNR: string | null;
  handleMarkNextJourney: (booking: SavedPNR) => Promise<void>;
  handleRefreshPNR: (pnrId: string) => Promise<void>;
  handleDeletePNR: (pnrId: string) => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  expandedPNRs,
  toggleExpanded,
  formatStatus,
  getStatusColor,
  nextJourneyPNR,
  handleMarkNextJourney,
  handleRefreshPNR,
  handleDeletePNR,
}) => {
  const isExpanded = expandedPNRs.has(booking.id);
  const firstPassenger = booking.passengers[0];

  const pnrStatusDisplay = firstPassenger?.status || 'Unknown';
  const pnrStatusColor = getStatusColor(pnrStatusDisplay);

  const chartNotPrepared = !booking.chartPrepared;

  return (
    <View style={styles.bookingCard}>
      {/* 1. Top Header - PNR and Actions */}
      <View style={styles.cardTopHeader}>
        <View style={{ flexShrink: 1 }}>
          <Text style={styles.pnrNumber}>
            PNR: {booking.pnr}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={styles.trainInfo}>{booking.trainNumber} - {booking.trainName}</Text>
            <View style={styles.chartStatusBlock}>
              <Text style={[styles.chartText, { color: chartNotPrepared ? '#DC2626' : '#059669' }]}>
                {chartNotPrepared ? 'Chart Not Prepared' : 'Chart Prepared'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            onPress={() => handleRefreshPNR(booking.id)}
            disabled={booking.isRefreshing}
            style={styles.actionButtonIcon}
          >
            {booking.isRefreshing ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <RefreshCw size={18} color="#64748B" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeletePNR(booking.id)}
            style={styles.actionButtonIcon}
          >
            <Trash2 size={18} color="#64748B" />
          </TouchableOpacity>
          
          {/* Main Toggle Button: Controls the visibility of the whole expanded section */}
          <TouchableOpacity
            onPress={() => toggleExpanded(booking.id)}
            style={styles.actionButtonIcon}
          >
            {isExpanded ? <ChevronUp size={18} color="#2563EB" /> : <ChevronDown size={18} color="#2563EB" />}
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Main Journey Section */}
      <View style={styles.journeySection}>
        <View style={styles.stationBlock}>
          <Text style={styles.stationDateText}>{formatJourneyDate(booking.sourceDoj)}</Text>
          <Text style={styles.stationCode}>{booking.boardingPoint.substring(0, 4)}</Text>
          <Text style={styles.timeText}>{booking.arrivalTime}</Text>
        </View>
        <View style={styles.journeyLineContainer}>
          {/* <View style={styles.journeyLine} /> */}
           <Text style={[styles.dojText, styles.journeyArrow]}>{'→'}</Text> 
        </View>
        <View style={styles.stationBlock}>
          <Text style={styles.stationDateText}>{formatJourneyDate(booking.destinationDoj)}</Text>
          <Text style={styles.stationCode}>{booking.reservationUpto.substring(0, 4)}</Text>
          <Text style={styles.timeText}>{booking.departureTime}</Text> 
        </View>
      </View>

      {/* 3. Class and Chart Status Row */}
      <View style={styles.statusRow}>
        <Text style={styles.classText}>Class : {booking.journeyClass}</Text>
        <Text style={styles.platformText}>PF : {booking.expectedPlatformNumber}</Text>
        <Text style={styles.quotaText}>Quota : {booking.quota || 'N/A'}</Text>
      </View>

      {/* --- 4. CONDITIONAL PASSENGER DETAILS SECTION --- */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.passengersDetailsContainer}>
            <Text style={styles.passengerDetailsTitle}>👤 Passenger Details</Text>
            
            {/* Render ALL passengers if expanded */}
            {booking.passengers.map((p, i) => (
              <View key={i} style={i === 0 ? styles.firstPassengerCard : styles.additionalPassengerCard}>
                <View style={styles.passengerInfoRow}>
                  <Text style={styles.passengerName}>
                    Passenger {p.number || `${i + 1}`}
                  </Text>
                  <View style={[styles.statusTagSmall, { backgroundColor: getStatusColor(p.status) }]}>
                    <Text style={styles.statusTagTextSmall}>{p.status}</Text>
                  </View>
                </View>
                {/* New: Two-row layout for Coach, Berth, Seat */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6,marginHorizontal:16 }}>
                  <Text style={{ flex: 1, textAlign: 'left', color: '#64748B', fontWeight: '600' }}>Coach</Text>
                  <Text style={{ flex: 1, textAlign: 'center', color: '#64748B', fontWeight: '600' }}>Berth</Text>
                  <Text style={{ flex: 1, textAlign: 'right', color: '#64748B', fontWeight: '600' }}>Seat</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2,marginHorizontal:20  }}>
                  <Text style={{ flex: 1, textAlign: 'left', color: '#1E293B',fontWeight: '600' }}>{p.coach || '-'}</Text>
                  <Text style={{ flex: 1, textAlign: 'center', color: '#1E293B',fontWeight: '600' }}>{p.berth || '-'}</Text>
                  <Text style={{ flex: 1, textAlign: 'right', color: '#1E293B',fontWeight: '600'}}>{p.seat || '-'}</Text>
                </View>
              </View>
            ))}
          </View>
          
          {/* Next Journey Button is now inside the expanded section */}
          <TouchableOpacity
            style={[
              styles.nextJourneyButton,
              nextJourneyPNR === booking.pnr && styles.nextJourneyButtonActive,
              !!nextJourneyPNR && nextJourneyPNR !== booking.pnr && styles.nextJourneyButtonDisabled,
              { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, // Add row layout
            ]}
            disabled={!!nextJourneyPNR && nextJourneyPNR !== booking.pnr}
            onPress={() => handleMarkNextJourney(booking)}
          >
            {nextJourneyPNR === booking.pnr ? (
              <Star fill="#fff" color="#fff" size={18} style={{ marginRight: 8 }} />
            ) : (
              <Star color="#2563EB" size={18} style={{ marginRight: 8 }} />
            )}
            <Text
              style={[
                styles.nextJourneyText,
                nextJourneyPNR === booking.pnr && styles.nextJourneyTextActive,
                !!nextJourneyPNR && nextJourneyPNR !== booking.pnr && styles.nextJourneyTextDisabled,
              ]}
            >
              {nextJourneyPNR === booking.pnr ? "My Next Journey" : "Mark as Next Journey"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Last Checked Info (Always visible, adjusted margin) */}
      <Text style={[styles.lastChecked, {marginTop: isExpanded ? 12 : 8}]}>Last checked: {booking.lastChecked}</Text>
    </View>
  );
};


// --- BookingScreen Main Component ---

export default function BookingScreen() {
  const [savedPNRs, setSavedPNRs] = useState<SavedPNR[]>([]);
  const [expandedPNRs, setExpandedPNRs] = useState<Set<string>>(new Set());
  const [nextJourneyPNR, setNextJourneyPNR] = useState<string | null>(null);

  // Load saved PNRs
  const loadSavedPNRs = async () => {
    try {
      const savedData = await AsyncStorage.getItem('savedPNRs');
      if (savedData) {
        setSavedPNRs(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading saved PNRs:', error);
    }
  };

  const loadNextJourney = async () => {
    try {
      const data = await AsyncStorage.getItem('nextJourney');
      if (data) setNextJourneyPNR(JSON.parse(data)?.pnr);
    } catch (error) {
      console.error('Error loading next journey:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedPNRs();
      loadNextJourney();
    }, [])
  );

  const toggleExpanded = (pnrId: string) => {
    setExpandedPNRs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pnrId)) newSet.delete(pnrId);
      else newSet.add(pnrId);
      return newSet;
    });
  };

  const handleMarkNextJourney = async (booking: SavedPNR) => {
    if (nextJourneyPNR && nextJourneyPNR !== booking.pnr) {
      Alert.alert(
        'Next Journey Exists',
        'You already have a Next Journey selected. Remove it before selecting a new one.'
      );
      return;
    }
    try {
      if (nextJourneyPNR === booking.pnr) {
        // Unmark if already marked
        await AsyncStorage.removeItem('nextJourney');
        setNextJourneyPNR(null);
        Alert.alert('✅ Success', 'Removed from Next Journey');
      } else {
        await AsyncStorage.setItem('nextJourney', JSON.stringify(booking));
        setNextJourneyPNR(booking.pnr);
        Alert.alert('✅ Success', 'Marked as your Next Journey');
      }
    } catch (error) {
      console.error('Failed to save next journey:', error);
      Alert.alert('❌ Failed', 'Could not save Next Journey status.');
    }
  };

  const handleRefreshPNR = async (pnrId: string) => {
    const pnrToRefresh = savedPNRs.find((p) => p.id === pnrId);
    if (!pnrToRefresh) return;

    setSavedPNRs((prev) =>
      prev.map((pnr) =>
        pnr.id === pnrId ? { ...pnr, isRefreshing: true } : pnr
      )
    );

    try {
      // NOTE: Replace this with your actual API call
      const response: APIResponse = await fetchPNRStatus(pnrToRefresh.pnr); 

      if (response.status && response.data) {
        const updatedPNR: SavedPNR = {
          ...pnrToRefresh,
          trainNumber: response.data.TrainNo,
          trainName: response.data.TrainName,
          from: response.data.BoardingPoint, 
          to: response.data.ReservationUpto,
          sourceDoj: response.data.SourceDoj,
          destinationDoj : response.data.DestinationDoj,
          journeyClass: response.data.Class,
          boardingPoint: response.data.BoardingPoint,
          arrivalTime: response.data.ArrivalTime,
          chartPrepared: response.data.ChartPrepared,
          passengers: response.data.PassengerStatus?.map((p, index) => ({
            number: pnrToRefresh.passengers[index]?.number || '', // Preserve original name if possible
            status: p.CurrentStatusNew || p.BookingStatusNew || 'Unknown',
            coach: p.CurrentCoachId || p.BookingCoachId || '-',
            berth: p.CurrentBerthCode || p.BookingBerthCode || '-',
            seat: p.CurrentBerthNo || p.BookingBerthNo || '-',
          })) || [],
          lastChecked: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
          isRefreshing: false,
        };

        const updatedPNRs = savedPNRs.map((pnr) =>
          pnr.id === pnrId ? updatedPNR : pnr
        );
        setSavedPNRs(updatedPNRs);
        await AsyncStorage.setItem('savedPNRs', JSON.stringify(updatedPNRs));

        Alert.alert('✅ Updated', 'PNR status refreshed successfully');
      } else {
        throw new Error(response.message || 'Failed to fetch PNR status');
      }
    } catch (error) {
      setSavedPNRs((prev) =>
        prev.map((pnr) =>
          pnr.id === pnrId ? { ...pnr, isRefreshing: false } : pnr
        )
      );

      Alert.alert('❌ Refresh Failed', error instanceof Error ? error.message : 'Network error');
    }
  };

  const handleDeletePNR = async (pnrId: string) => {
    Alert.alert('Delete PNR', 'Are you sure you want to delete this PNR?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedPNRs = savedPNRs.filter((p) => p.id !== pnrId);
          setSavedPNRs(updatedPNRs);
          await AsyncStorage.setItem('savedPNRs', JSON.stringify(updatedPNRs));
          
          if (nextJourneyPNR === savedPNRs.find(p => p.id === pnrId)?.pnr) {
            await AsyncStorage.removeItem('nextJourney');
            setNextJourneyPNR(null);
          }
        },
      },
    ]);
  };

  const handleAddNewPNR = () => router.push('/pnr-checker');

  // List header: stats + add button
  const renderListHeader = () => (
    <>
      {/* ... (Stats Container Code) ... */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{savedPNRs.length}</Text>
          <Text style={styles.statLabel}>Saved PNRs</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {savedPNRs.filter((pnr) =>
              pnr.passengers.some((p) => p.status.includes('CNF') || p.status.includes('Confirmed'))
            ).length}
          </Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {savedPNRs.filter((pnr) =>
              pnr.passengers.some((p) => p.status.includes('WL') || p.status.includes('Waitlisted'))
            ).length}
          </Text>
          <Text style={styles.statLabel}>Waitlisted</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNewPNR}>
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add PNR</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.push('/home')}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved PNR</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* FlatList of saved PNRs */}
      <FlatList
        data={savedPNRs}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        renderItem={({ item: booking }) => (
          <BookingCard
            booking={booking}
            expandedPNRs={expandedPNRs}
            toggleExpanded={toggleExpanded}
            formatStatus={formatStatus}
            getStatusColor={getStatusColor}
            nextJourneyPNR={nextJourneyPNR}
            handleMarkNextJourney={handleMarkNextJourney}
            handleRefreshPNR={handleRefreshPNR}
            handleDeletePNR={handleDeletePNR}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Train size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Saved PNRs</Text>
            <Text style={styles.emptySubtitle}>
              Use the PNR Checker to search and save your booking details
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddNewPNR}>
              <Text style={styles.emptyButtonText}>Check PNR Status</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

// --- Stylesheet ---
// (NOTE: Styles are kept consistent with previous versions but organized below)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 48,
  },
  backButton: {
    padding: 12,
    marginLeft: -12,
    width: 48,
  },
  flatListContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // --- BookingCard Styles ---
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  leftHeaderBlock: {
    flexShrink: 1, // Allows it to shrink if actions take up too much space
    marginRight: 8, // Add spacing before the chart status/actions
  },
  chartStatusBlock: {
    marginLeft: 10, 
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  pnrNumber: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  trainInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 10,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButtonIcon: {
    padding: 6,
    marginLeft: 4,
  },

  // Journey Section Styles
  journeySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  stationBlock: {
    alignItems: 'center',
    flex: 1,
  },
  stationCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  journeyLineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
  },
  journeyLine: {
    height: 1,
    backgroundColor: '#94A3B8',
    width: '100%',
    position: 'absolute',
  },
  dojText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    // We are keeping the background white so the line is broken by the text/arrow
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  journeyArrow: {
    fontSize: 35, // Slightly larger arrow for visibility
    fontWeight: '700',
    color: 'Black', // Blue color to highlight movement
    paddingHorizontal: 4, // Reduced horizontal padding
    paddingVertical: 0,   // Remove vertical padding
    borderWidth: 0,       // Remove border
  },

  // Status Row Styles
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  classText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft:10,
    color: '#1E293B',
    flex: 1,
  },
  platformText : {
    fontSize: 16,
    fontWeight: '500',
    alignContent: 'center',
    marginRight:45,
  },
  quotaText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  statusTagText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626', // Default to red
    textAlign: 'right',
    marginTop: 4,
  },

  // --- Expanded Content Styles ---
  expandedContent: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  // Passenger Details Styles
  passengersDetailsContainer: {
    paddingBottom: 4,
  },
  passengerDetailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  firstPassengerCard: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  additionalPassengerCard: {
    padding: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    marginBottom: 6,
    marginTop: 6,
  },
  passengerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  passengerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  passengerAgeGender: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  statusTagSmall: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
    alignItems: 'center',
  },
  statusTagTextSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  allocationText: {
    fontSize: 14,
    color: '#64748B',
  },
  
  nextJourneyButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#E0E7FF',
  },
  nextJourneyButtonActive: {
    backgroundColor: '#2563EB',
  },
  nextJourneyButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  nextJourneyText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  nextJourneyTextActive: {
    color: '#FFFFFF',
  },
  nextJourneyTextDisabled: {
    color: '#94A3B8',
  },
  lastChecked: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'left',
  },
  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stationDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155', // Darker gray for prominence
    marginBottom: 6,
    textAlign: 'center',
  },
});