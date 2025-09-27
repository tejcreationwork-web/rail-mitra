import fetchPNRStatus from '@/lib/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookmarkPlus,
  Clock,
  MapPin,
  Search,
  TrainFront as Train
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

/**
 * Passenger details exactly as returned from API
 */
type APIPassenger = {
  ReferenceId: string | null;
  Pnr: string | null;
  Number: number;
  Prediction: string | null;
  PredictionPercentage: number | null;
  ConfirmTktStatus: string | null;
  Coach: string;
  Berth: number | string;
  BookingStatus: string;
  CurrentStatus: string;
  CoachPosition: string;
  BookingBerthNo: string;
  BookingCoachId: string;
  BookingStatusNew: string;
  BookingStatusIndex: string;
  CurrentBerthNo: string;
  CurrentCoachId: string;
  BookingBerthCode: string;
  CurrentBerthCode: string;
  CurrentStatusNew: string;
  CurrentStatusIndex: string;
};

/**
 * API Response (based on your pasted JSON)
 */
type APIResponse = {
  status: boolean;
  message: string;
  timestamp: number;
  data?: {
    Pnr: string;
    TrainNo: string;
    TrainName: string;
    Doj: string;
    BookingDate: string;
    Quota: string;
    DestinationDoj: string;
    SourceDoj: string;
    From: string;
    To: string;
    ReservationUpto: string;
    Class: string;
    ChartPrepared: boolean;
    TrainStatus: string;
    TrainCancelledFlag: boolean;
    ReservationUptoName: string;
    PassengerCount: number;
    PassengerStatus: APIPassenger[];
    DepartureTime: string;
    ArrivalTime: string;
    ExpectedPlatformNo: string;
    BookingFare: string;
    TicketFare: string;
    CoachPosition: string;
    Rating: number;
    FoodRating: number;
    PunctualityRating: number;
    CleanlinessRating: number;
    BoardingPoint: string;
    Duration: string;
    RatingCount: number;
    HasPantry: boolean;
    FromDetails: {
      category: string;
      division: string;
      latitude: string;
      longitude: string;
      state: string;
      stationCode: string;
      stationName: string;
    };
    BoardingPointDetails: {
      category: string;
      division: string;
      latitude: string;
      longitude: string;
      state: string;
      stationCode: string;
      stationName: string;
    };
  };
};

/**
 * Saved PNR structure for AsyncStorage
 */
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
  bookingDate : Date;
  quota : string;
  coachPosition : string;
  passengerCount : number;
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
};

export default function PNRChecker() {
  const router = useRouter();
  const [pnrNumber, setPnrNumber] = useState('');
  const [pnrData, setPnrData] = useState<APIResponse['data'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search handler
   */
  const handleSearch = async () => {
    if (!pnrNumber.trim()) {
      Alert.alert('Error', 'Please enter PNR number');
      return;
    }
    if (pnrNumber.length !== 10) {
      Alert.alert('Error', 'PNR number should be 10 digits');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPnrData(null);

    try {
      const response: APIResponse = await fetchPNRStatus(pnrNumber);
      // console.log(response);

      if (response.status && response.data) {
        setPnrData(response.data);
      } else {
        setError(response.message || 'Failed to fetch PNR status');
        Alert.alert('Error', response.message || 'Failed to fetch PNR status');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save PNR to AsyncStorage
   */
  const handleSavePNR = () => {
    if (!pnrData) return;

    setIsSaving(true);

    setTimeout(async () => {
      try {
        const savedPNR: SavedPNR = {
          id: Date.now().toString(),
          pnr: pnrData.Pnr,
          trainNumber: pnrData.TrainNo,
          trainName: pnrData.TrainName,
          from: pnrData.BoardingPoint,
          to: pnrData.ReservationUpto,
          sourceDoj: pnrData.SourceDoj,
          destinationDoj: pnrData.DestinationDoj,
          journeyClass: pnrData.Class,
          boardingPoint: pnrData.BoardingPoint,
          reservationUpto : pnrData.ReservationUpto,
          arrivalTime : pnrData.ArrivalTime,
          departureTime : pnrData.DepartureTime,
          expectedPlatformNumber : pnrData.ExpectedPlatformNo,
          ticketFare : pnrData.TicketFare ? parseFloat(pnrData.TicketFare) : 0,
          hasPantry : pnrData.HasPantry,
          bookingDate : pnrData.BookingDate ? new Date(pnrData.BookingDate) : new Date(),
          quota : pnrData.Quota,
          coachPosition : pnrData.CoachPosition,
          passengerCount : pnrData.PassengerCount,
          passengers:
            pnrData.PassengerStatus?.map((p) => ({
              number: p.Number.toString(),
              status: p.CurrentStatusNew || p.BookingStatusNew || 'Unknown',
              coach: p.CurrentCoachId || p.BookingCoachId || '-',
              berth: p.CurrentBerthCode || p.BookingBerthCode || '-',
              seat: p.CurrentBerthNo || p.BookingBerthNo || '-',
            })) || [],
          lastChecked: new Date().toLocaleString(),
          savedAt: new Date().toLocaleString(),
        };

        const existingSavedPNRs = await AsyncStorage.getItem('savedPNRs');
        const savedPNRs: SavedPNR[] = existingSavedPNRs
          ? JSON.parse(existingSavedPNRs)
          : [];

        const existingIndex = savedPNRs.findIndex((p) => p.pnr === pnrData.Pnr);

        if (existingIndex >= 0) {
          savedPNRs[existingIndex] = {
            ...savedPNRs[existingIndex],
            ...savedPNR,
            lastChecked: savedPNR.lastChecked,
          };
        } else {
          savedPNRs.unshift(savedPNR);
        }

        await AsyncStorage.setItem('savedPNRs', JSON.stringify(savedPNRs));

        setIsSaving(false);
        Alert.alert(
          'PNR Saved',
          '✅ PNR has been successfully saved to your bookings.',
          [
            { text: 'OK' },
            {
              text: 'View Bookings',
              onPress: () => {
                router.back();
                router.push('/(tabs)/booking');
              },
            },
          ]
        );
      } catch (error) {
        setIsSaving(false);
        Alert.alert('❌ Save Failed', 'Failed to save PNR. Please try again.');
      }
    }, 1000);
  };

  const clearData = () => {
    setPnrData(null);
    setPnrNumber('');
    setError(null);
  };

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('cnf')) return '#059669';
    if (lower.includes('wl')) return '#F59E0B';
    if (lower.includes('rac')) return '#2563EB';
    if (lower.includes('can')) return '#DC2626';
    return '#64748B';
  };

  const formatStatus = (status: string) => {
    const lower = status.toLowerCase();
    if (lower.includes('cnf')) return 'Confirmed';
    if (lower.includes('wl')) return 'Waitlisted';
    if (lower.includes('rac')) return 'RAC';
    if (lower.includes('can')) return 'Cancelled';
    return status;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PNR Status</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter PNR Number</Text>
          <View style={styles.inputWrapper}>
            <Train size={22} color="#525861ff" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={pnrNumber}
              onChangeText={setPnrNumber}
              placeholder="Enter 10-digit PNR"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={10}
            />
            {pnrNumber.length > 0 && (
              <TouchableOpacity onPress={clearData}>
                <Text style={styles.clearButton}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.searchButton,
              isLoading && styles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={isLoading}
          >
            <Search size={22} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>
              {isLoading ? 'Checking...' : 'Check Status'}
            </Text>
          </TouchableOpacity>
        </View>
        {/* PNR Data Section */}
        {pnrData && (
          <View style={styles.resultContainer}>
            {/* Journey Details */}
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Journey Details</Text>
              <View style={styles.journeyRow}>
                <View style={styles.journeyPoint}>
                  <MapPin size={30} color="#153cb9ff" />
                  <View style={styles.journeyInfo}>
                    <Text style={styles.journeyLabel}>From</Text>
                    <Text style={styles.journeyValue}>
                      {pnrData.BoardingPoint}
                    </Text>
                  </View>
                </View>
                <View style={styles.journeyArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
                <View style={styles.journeyPoint}>
                  <MapPin size={30} color="#DC2626" />
                  <View style={styles.journeyInfo}>
                    <Text style={styles.journeyLabel}>To</Text>
                    <Text style={styles.journeyValue}>
                      {pnrData.ReservationUpto}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* PNR Header */}
            <View style={styles.pnrHeader}>
              <Text style={styles.pnrNumber}>PNR : {pnrData.Pnr}</Text>
            </View>

            {/* Train Info */}
            <Text style={styles.trainInfo}>
              Train : {pnrData.TrainNo} - {pnrData.TrainName}
            </Text>
            {/* <Text style={styles.BoardingInfo}>
              DOJ : {pnrData.Doj} | <Clock>Time : {pnrData.ArrivalTime} </Clock>
            </Text> */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.BoardingInfo}>DOJ : {pnrData.SourceDoj} | </Text>
              <Clock size={16} color="#64748B" style={{ marginHorizontal: 4 }} />
              <Text style={styles.BoardingInfo}>Time : {pnrData.ArrivalTime}</Text>
            </View>
            <Text style={styles.classInfo}>
              Boarding : {pnrData.BoardingPoint}  | Class : {pnrData.Class}
            </Text>

            <Text style={styles.BookingQuota}>
              Ticket Fare : ₹{pnrData.TicketFare}  | Booking Quota :{' '}
              {pnrData.Quota}
            </Text>

            {/* Passenger List */}
            {pnrData.PassengerStatus?.map((passenger, index) => (
              <View key={index} style={styles.detailsContainer}>
                <Text style={styles.sectionTitle}>
                  Passenger {passenger.Number}
                </Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Booking Status : </Text>
                  <Text style={styles.detailValue}>
                    {passenger.BookingStatus || 'Unknown'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Current Status : </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: getStatusColor(passenger.CurrentStatus) },
                    ]}
                  >
                    {formatStatus(passenger.CurrentStatus || 'Unknown')}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Coach : </Text>
                  <Text style={styles.detailValue}>
                    {passenger.CurrentCoachId ||
                      passenger.BookingCoachId ||
                      '-'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Berth : </Text>
                  <Text style={styles.detailValue}>
                    {passenger.CurrentBerthCode ||
                      passenger.BookingBerthCode ||
                      '-'}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Seat : </Text>
                  <Text style={styles.detailValue}>
                    {passenger.CurrentBerthNo ||
                      passenger.BookingBerthNo ||
                      '-'}
                  </Text>
                </View>
              </View>
            ))}

            {/* Save Section */}
            <View style={styles.saveSection}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isSaving && styles.saveButtonDisabled,
                ]}
                onPress={handleSavePNR}
                disabled={isSaving}
              >
                <BookmarkPlus size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save to My Bookings'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.saveHint}>
                Save this PNR to track status changes and access it quickly later
              </Text>
            </View>
          </View>
        )}
        {/* Error State */}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleSearch()}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

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
  backButton: {
    padding: 12,
    marginLeft: -12,
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 16,
  },
  textInput: {
    flex: 1,
    height: 56,
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '500',
  },
  clearButton: {
    fontSize: 20,
    color: '#64748B',
    paddingHorizontal: 12,
  },
  searchButton: {
    backgroundColor: '#1E40AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  searchButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  pnrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  pnrNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 28,
    color: '#1E293B',
    fontFamily: 'Poppins-Bold',
  },
  statusBadge: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  trainInfo: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  classInfo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  BoardingInfo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  BookingQuota: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
  },
  TicketFare: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  detailContent: {
    marginLeft: 16,
    flex: 1,
  },
  detailLabel: {
    fontSize: 15,
    color: '#64748B',
    minWidth: 100,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  journeyPoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeyInfo: {
    marginLeft: 30,
    flex: 1,
  },
  journeyLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 0,
  },
  journeyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: -3,
    marginVertical: 4,
    marginTop: 0,
  },
  journeyTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  journeyArrow: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -10,
    paddingHorizontal: 30,
  },
  arrowText: {
    fontSize: 30,
    color: '#64748B',
    fontWeight: 'bold',
  },
  saveSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  saveButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  saveButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  saveHint: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
