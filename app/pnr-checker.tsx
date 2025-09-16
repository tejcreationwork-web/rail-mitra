import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, TrainFront as Train, User, MapPin, CircleCheck as CheckCircle, BookmarkPlus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type APIPassenger = {
  passengerSerialNumber: number;
  passengerFoodChoice: string;
  concessionOpted: boolean;
  forGoConcessionOpted: boolean;
  passengerIcardFlag: boolean;
  childBerthFlag: boolean;
  passengerNationality: string;
  passengerQuota: string;
  passengerCoachPosition: number;
  waitListType: number;
  bookingStatus: string;
  bookingBerthNo: number;
  bookingCoachId : string;
  bookingBerthCode: string;
  bookingStatusDetails: string;
  currentStatus: string;
  currentCoachId: string;
  currentBerthNo: number;
  currentStatusDetails?: string;
};

type APIResponse = {
  success: boolean;
  data?: {
    pnrNumber: string;
    dateOfJourney: string;
    trainNumber: string;
    trainName: string;
    sourceStation: string;
    destinationStation: string;
    reservationUpto: string;
    boardingPoint: string;
    journeyClass: string;
    numberOfpassenger: number;
    chartStatus: string;
    passengerList: APIPassenger[];
    bookingFare: number;
    ticketFare: number;
    quota: string;
    bookingDate: string;
    arrivalDate: string;
    distance: number;
  };
  message?: string;
};

type SavedPNR = {
  id: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  date: string;
  journeyClass: string;
  boardingPoint: string;
  passengers: {
    name: string;
    age: number;
    status: string;
    coach: string;
    berth : string;
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

  const fetchPNRStatus = async (pnr: string): Promise<APIResponse> => {
    const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnr}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'dc102d5e60msh5947347b2e8df5bp14ddebjsnd8a83e21de4c',
        'x-rapidapi-host': 'irctc-indian-railway-pnr-status.p.rapidapi.com'
      }
    };

    const response = await fetch(url, options);
    const result = await response.text();
    
    try {
      return JSON.parse(result);
    } catch (parseError) {
      throw new Error('Invalid response format from API');
    }
  };

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
      const response = await fetchPNRStatus(pnrNumber);
      
      if (response.success && response.data) {
        setPnrData(response.data);
      } else {
        setError(response.message || 'Failed to fetch PNR status');
        Alert.alert('Error', response.message || 'Failed to fetch PNR status');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePNR = () => {
    if (!pnrData) return;
    
    setIsSaving(true);
    
    setTimeout(async () => {
      try {
        const savedPNR: SavedPNR = {
          id: Date.now().toString(),
          pnr: pnrData.pnrNumber,
          trainNumber: pnrData.trainNumber,
          trainName: pnrData.trainName,
          from: pnrData.sourceStation,
          to: pnrData.destinationStation,
          date: pnrData.dateOfJourney,
          journeyClass: pnrData.journeyClass,
          boardingPoint: pnrData.boardingPoint,
          passengers: pnrData.passengerList?.map(p => ({
            name: '',
            age: 0,
            status: p.currentStatus || p.bookingStatus || 'Unknown',
            coach: p.currentCoachId || p.bookingCoachId || '-',
            berth: p.bookingBerthCode || '-',  // ✅ added
            seat: p.currentBerthNo || p.bookingBerthNo || '-',
          })) || '',
          lastChecked: new Date().toLocaleString(),
          savedAt: new Date().toLocaleString(),
        };

        // Get existing saved PNRs
        const existingSavedPNRs = await AsyncStorage.getItem('savedPNRs');
        const savedPNRs: SavedPNR[] = existingSavedPNRs ? JSON.parse(existingSavedPNRs) : [];
        
        // Check if PNR already exists
        const existingIndex = savedPNRs.findIndex(p => p.pnr === pnrData.pnrNumber);
        
        if (existingIndex >= 0) {
          // Update existing PNR
          savedPNRs[existingIndex] = { ...savedPNRs[existingIndex], ...savedPNR, lastChecked: savedPNR.lastChecked };
        } else {
          // Add new PNR
          savedPNRs.unshift(savedPNR);
        }
        
        // Save to storage
        await AsyncStorage.setItem('savedPNRs', JSON.stringify(savedPNRs));
        
        setIsSaving(false);
        Alert.alert(
          'PNR Saved',
          '✅ PNR has been successfully saved to your bookings for future reference and status updates.',
          [
            { text: 'OK' },
            { 
              text: 'View Bookings', 
              onPress: () => {
                router.back();
                router.push('/(tabs)/booking');
              }
            }
          ]
        );
      } catch (error) {
        setIsSaving(false);
        Alert.alert('❌ Save Failed', 'Failed to save PNR. Please try again.');
      }
    }, 1000); // 1 second delay to show saving animation
  };

  const handleSavePNROld = () => {
    if (!pnrData) return;
    
    setIsSaving(true);
    
    // Simulate saving to storage/database
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert(
        'PNR Saved',
        'This PNR has been saved to your bookings for future reference and status updates.',
        [
          { text: 'OK' },
          { 
            text: 'View Bookings', 
            onPress: () => {
              router.back();
              router.push('/(tabs)/booking');
            }
          }
        ]
      );
    }, 1000);
  };
  const clearData = () => {
    setPnrData(null);
    setPnrNumber('');
    setError(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'cnf':
      case 'confirmed':
        return '#059669';
      case 'wl':
      case 'waitlisted':
        return '#F59E0B';
      case 'rac':
        return '#2563EB';
      case 'can':
      case 'cancelled':
        return '#DC2626';
      default:
        return '#64748B';
    }
  };

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'cnf':
        return 'Confirmed';
      case 'wl':
        return 'Waitlisted';
      case 'rac':
        return 'RAC';
      case 'can':
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>PNR Status</Text>
      <View style={styles.placeholder} />
    </View>
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Input Section */}
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
          style={[styles.searchButton, isLoading && styles.searchButtonDisabled]}
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
          {/* Header */}
          <View style={styles.pnrHeader}>
            <Text style={styles.pnrNumber}>PNR : {pnrData.pnrNumber}</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getStatusColor(
                    pnrData.passengerList?.[0]?.currentStatus || ''
                  ),
                },
              ]}
            >
              <CheckCircle size={18} color="#FFFFFF" />
              <Text style={styles.statusText}>
                {formatStatus(
                  pnrData.passengerList?.[0]?.currentStatus || 'Unknown'
                )}
              </Text>
            </View>
          </View>

          {/* Train Info */}
          <Text style={styles.trainInfo}>
            Train : {pnrData.trainNumber} - {pnrData.trainName}
          </Text>
          <Text style={styles.classInfo}>
            Class : {pnrData.journeyClass} | Date : {pnrData.dateOfJourney}
          </Text>
          <Text style={styles.BoardingInfo}>
            Boarding Point : {pnrData.boardingPoint}
          </Text>
          <Text style={styles.BookingQuota}>
            Booking Quata : {pnrData.quota}
          </Text>
          <Text style={styles.TicketFare}>
            Ticket Fare : {pnrData.ticketFare} INR
          </Text>

          {/* Passenger List */}
          {pnrData.passengerList?.map((passenger, index) => (
            <View key={index} style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>
                Passenger {passenger.passengerSerialNumber}
              </Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Booking Status : </Text>
                <Text style={styles.detailValue}>
                  {passenger.bookingStatusDetails}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Current Status   : </Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: getStatusColor(passenger.currentStatus) },
                  ]}
                >
                  {formatStatus(passenger.currentStatus)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Coach                : </Text>
                <Text style={styles.detailValue}>
                  {passenger.currentCoachId || passenger.bookingCoachId || '    -'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Berth                 : </Text>
                <Text style={styles.detailValue}>
                  {passenger.currentBerthNo || passenger.bookingBerthCode ||'     -'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Seat                    : </Text>
                <Text style={styles.detailValue}>
                  {passenger.currentBerthNo || passenger.bookingBerthNo ||'     -'}
                </Text>
              </View>
            </View>
          ))}

          {/* Journey Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Journey Details</Text>
            <View style={styles.journeyRow}>
              <View style={styles.journeyPoint}>
                <MapPin size={30} color="#153cb9ff" />
                <View style={styles.journeyInfo}>
                  <Text style={styles.journeyLabel}>From</Text>
                  <Text style={styles.journeyValue}>
                    {pnrData.sourceStation}
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
                    {pnrData.destinationStation}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Save Section */}
          <View style={styles.saveSection}>
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
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
          <TouchableOpacity style={styles.retryButton} onPress={() => handleSearch()}>
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
    backgroundColor: '#1E40AF',
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
    marginBottom:8,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
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
    marginLeft: -50,
    paddingHorizontal: 60,
  },
  arrowText: {
    fontSize: 24,
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