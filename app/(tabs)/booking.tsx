import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Brain as Train, MapPin, User, RefreshCw, Trash2, Plus } from 'lucide-react-native';
import { router, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    seat: string;
  }[];
  lastChecked: string;
  savedAt: string;
  isRefreshing?: boolean;
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
    passengers: {
      passengerSerialNumber: number;
      passengerName: string;
      passengerAge: number;
      passengerGender: string;
      passengerStatus: string;
      passengerCoach: string;
      passengerSeatNumber: number;
      passengerQuota: string;
    }[];
    bookingFare: number;
    ticketFare: number;
    quota: string;
    bookingDate: string;
    arrivalDate: string;
    distance: number;
  };
  message?: string;
};

export default function BookingScreen() {
  const [savedPNRs, setSavedPNRs] = useState<SavedPNR[]>([]);

  // Load saved PNRs from storage
  const loadSavedPNRs = async () => {
    try {
      const savedData = await AsyncStorage.getItem('savedPNRs');
      if (savedData) {
        const pnrs: SavedPNR[] = JSON.parse(savedData);
        setSavedPNRs(pnrs);
      }
    } catch (error) {
      console.error('Error loading saved PNRs:', error);
    }
  };

  // Load PNRs when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadSavedPNRs();
    }, [])
  );

  // Fetch PNR status from API
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'CNF':
        return '#059669';
      case 'Waitlisted':
      case 'WL':
        return '#F59E0B';
      case 'Cancelled':
      case 'CAN':
        return '#DC2626';
      case 'RAC':
        return '#2563EB';
      default:
        return '#64748B';
    }
  };

  const handleRefreshPNR = async (pnrId: string) => {
    const pnrToRefresh = savedPNRs.find(p => p.id === pnrId);
    if (!pnrToRefresh) return;

    setSavedPNRs(prev => prev.map(pnr => 
      pnr.id === pnrId ? { ...pnr, isRefreshing: true } : pnr
    ));

    try {
      const response = await fetchPNRStatus(pnrToRefresh.pnr);
      
      if (response.success && response.data) {
        const updatedPNR: SavedPNR = {
          ...pnrToRefresh,
          trainNumber: response.data.trainNumber,
          trainName: response.data.trainName,
          from: response.data.sourceStation,
          to: response.data.destinationStation,
          date: response.data.dateOfJourney,
          journeyClass: response.data.journeyClass,
          boardingPoint: response.data.boardingPoint,
          passengers: response.data.passengers?.map(p => ({
            name: p.passengerName,
            age: p.passengerAge,
            status: p.passengerStatus,
            coach: p.passengerCoach || '-',
            seat: p.passengerSeatNumber?.toString() || '-',
          })) || [],
          lastChecked: new Date().toLocaleString(),
          isRefreshing: false,
        };

        // Update in state
        setSavedPNRs(prev => prev.map(pnr => 
          pnr.id === pnrId ? updatedPNR : pnr
        ));

        // Update in storage
        const updatedPNRs = savedPNRs.map(pnr => 
          pnr.id === pnrId ? updatedPNR : pnr
        );
        await AsyncStorage.setItem('savedPNRs', JSON.stringify(updatedPNRs));

        Alert.alert('Status Updated', 'PNR status has been refreshed successfully');
      } else {
        throw new Error(response.message || 'Failed to fetch PNR status');
      }
    } catch (error) {
      setSavedPNRs(prev => prev.map(pnr => 
        pnr.id === pnrId ? { ...pnr, isRefreshing: false } : pnr
      ));
      
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      Alert.alert('Refresh Failed', errorMessage);
    }
  };

  const handleRefreshPNROld = async (pnrId: string) => {
    setSavedPNRs(prev => prev.map(pnr => 
      pnr.id === pnrId ? { ...pnr, isRefreshing: true } : pnr
    ));

    // Simulate API call
    setTimeout(() => {
      setSavedPNRs(prev => prev.map(pnr => {
        if (pnr.id === pnrId) {
          // Simulate status updates
          const possibleStatuses = ['Confirmed', 'Waitlisted', 'RAC'];
          const randomStatus = possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)];
          
          return {
            ...pnr,
            passengers: pnr.passengers.map(p => ({ ...p, status: randomStatus })),
            lastChecked: new Date().toLocaleString(),
            isRefreshing: false,
          };
        }
        return pnr;
      }));

      Alert.alert('Status Updated', 'PNR status has been refreshed successfully');
    }, 2000);
  };

  const handleDeletePNR = (pnrId: string) => {
    Alert.alert(
      'Delete PNR',
      'Are you sure you want to remove this PNR from your saved list?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Remove from storage
            const updatedPNRs = savedPNRs.filter(pnr => pnr.id !== pnrId);
            try {
              await AsyncStorage.setItem('savedPNRs', JSON.stringify(updatedPNRs));
            } catch (error) {
              console.error('Error deleting PNR:', error);
            }
            // Remove from state
            setSavedPNRs(prev => prev.filter(pnr => pnr.id !== pnrId));
          },
        },
      ]
    );
  };

  const handleAddNewPNR = () => {
    router.push('/pnr-checker');
  };

  const handleViewDetails = (pnr: SavedPNR) => {
    const primaryPassenger = pnr.passengers[0];
    const passengerInfo = primaryPassenger 
      ? `Passenger: ${primaryPassenger.name}\nStatus: ${primaryPassenger.status}\nCoach: ${primaryPassenger.coach}, Seat: ${primaryPassenger.seat}`
      : 'No passenger information available';

    Alert.alert(
      'PNR Details',
      `PNR: ${pnr.pnr}\nTrain: ${pnr.trainNumber} - ${pnr.trainName}\n${passengerInfo}\nLast Checked: ${pnr.lastChecked}`,
      [
        { text: 'OK' },
        { text: 'Refresh', onPress: () => handleRefreshPNR(pnr.id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Saved PNRs and booking history</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{savedPNRs.length}</Text>
            <Text style={styles.statLabel}>Saved PNRs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {savedPNRs.filter(pnr => pnr.passengers.some(p => p.status === 'Confirmed' || p.status === 'CNF')).length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {savedPNRs.filter(pnr => pnr.passengers.some(p => p.status === 'Waitlisted' || p.status === 'WL')).length}
            </Text>
            <Text style={styles.statLabel}>Waitlisted</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Saved PNRs</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNewPNR}>
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add PNR</Text>
          </TouchableOpacity>
        </View>

        {savedPNRs.map((booking) => (
          <TouchableOpacity 
            key={booking.id} 
            style={styles.bookingCard} 
            activeOpacity={0.7}
            onPress={() => handleViewDetails(booking)}
          >
            <View style={styles.bookingHeader}>
              <View style={styles.trainInfo}>
                <Train size={18} color="#2563EB" />
                <Text style={styles.trainNumber}>
                  {booking.trainNumber} - {booking.trainName}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
                <Text style={styles.statusText}>{booking.status}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.passengers[0]?.status || 'Unknown') }]}>
                <Text style={styles.statusText}>{booking.passengers[0]?.status || 'Unknown'}</Text>
              </View>
            </View>

            <View style={styles.pnrSection}>
              <Text style={styles.pnrLabel}>PNR: {booking.pnr}</Text>
              <Text style={styles.passengerName}>{booking.passengers[0]?.name || 'No passenger info'}</Text>
            </View>

            <View style={styles.journeyInfo}>
              <View style={styles.journeyPoint}>
                <MapPin size={16} color="#2563EB" />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{booking.from}</Text>
                  <View style={styles.timeInfo}>
                    <Calendar size={14} color="#64748B" />
                    <Text style={styles.timeText}>{booking.date}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.arrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
              
              <View style={styles.journeyPoint}>
                <MapPin size={16} color="#DC2626" />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{booking.to}</Text>
                  <View style={styles.timeInfo}>
                    <Text style={styles.timeText}>{booking.journeyClass}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.seatInfo}>
              <View style={styles.seatDetail}>
                <User size={16} color="#64748B" />
                <Text style={styles.seatText}>Coach: {booking.passengers[0]?.coach || '-'}</Text>
              </View>
              <View style={styles.seatDetail}>
                <Text style={styles.seatText}>Seat: {booking.passengers[0]?.seat || '-'}</Text>
              </View>
            </View>

            <View style={styles.actionBar}>
              <Text style={styles.lastChecked}>Last checked: {booking.lastChecked}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, booking.isRefreshing && styles.actionButtonDisabled]}
                  onPress={() => handleRefreshPNR(booking.id)}
                  disabled={booking.isRefreshing}
                >
                  <RefreshCw 
                    size={16} 
                    color={booking.isRefreshing ? "#94A3B8" : "#2563EB"} 
                  />
                  <Text style={[styles.actionButtonText, booking.isRefreshing && styles.actionButtonTextDisabled]}>
                    {booking.isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePNR(booking.id)}
                >
                  <Trash2 size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {savedPNRs.length === 0 && (
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
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
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
  },
  statDivider: {
    width: 1,
    height: 40,
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
    fontFamily: 'Poppins-Bold',
  },
  addButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: 'Inter-SemiBold',
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trainNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  pnrSection: {
    marginBottom: 16,
  },
  pnrLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  passengerName: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  journeyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  journeyPoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationInfo: {
    marginLeft: 8,
    flex: 1,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  arrow: {
    paddingHorizontal: 16,
  },
  arrowText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: 'bold',
  },
  seatInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 16,
  },
  seatDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lastChecked: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#EBF4FF',
  },
  actionButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  actionButtonTextDisabled: {
    color: '#94A3B8',
  },
  deleteButton: {
    padding: 6,
  },
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
    fontFamily: 'Poppins-Bold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-SemiBold',
  },
});