import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, TrainFront as Train, MapPin, User, RefreshCw, Trash2, Plus, ChevronDown, ChevronUp, CircleCheck as CheckCircle } from 'lucide-react-native';
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
    berth: string;
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
    passengerList: {
      passengerSerialNumber: number;
      passengerName: string;
      passengerAge: number;
      passengerGender: string;
      passengerStatus: string;
      bookingCoachId: string;
      bookingBerthNo: number;
      bookingBerthCode : string,
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
  const [expandedPNRs, setExpandedPNRs] = useState<Set<string>>(new Set());
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedPNR, setSelectedPNR] = useState<string | null>(null);

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

  const toggleExpanded = (pnrId: string) => {
    setExpandedPNRs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pnrId)) {
        newSet.delete(pnrId);
      } else {
        newSet.add(pnrId);
      }
      return newSet;
    });
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
          passengers: response.data.passengerList?.map(p => ({
            name: p.passengerName || '-',
            age: p.passengerAge || 0,
            status: p.passengerStatus || 'Unknown',
            coach: p.bookingCoachId || '-',
            seat: p.bookingBerthNo?.toString() || '-',
            berth : p.bookingBerthCode || '-'
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

const openDeleteModal = (pnrId: string) => {
  setSelectedPNR(pnrId);
  setDeleteModalVisible(true);
};

const confirmDeletePNR = async () => {
  if (!selectedPNR) return;

  try {
    const updatedPNRs = savedPNRs.filter(pnr => pnr.id !== selectedPNR);
    setSavedPNRs(updatedPNRs);
    await AsyncStorage.setItem('savedPNRs', JSON.stringify(updatedPNRs));
  } catch (error) {
    console.error('Failed to delete PNR:', error);
  }

  setDeleteModalVisible(false);
  setSelectedPNR(null);
};

  const handleAddNewPNR = () => {
    router.push('/pnr-checker');
  };

  const handleViewDetails = (pnr: SavedPNR) => {
    const primaryPassenger = pnr.passengers[0];
    const passengerInfo = primaryPassenger 
      ? `Passenger: ${primaryPassenger.name}\nStatus: ${primaryPassenger.status}\nCoach: ${primaryPassenger.coach},Berth: ${primaryPassenger.berth} Seat: ${primaryPassenger.seat}`
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
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddNewPNR}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add PNR</Text>
          </TouchableOpacity>
        </View>

        {savedPNRs.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <TouchableOpacity
              onPress={() => handleViewDetails(booking)}
            >
              <View style={styles.pnrHeader}>
                <Text style={styles.pnrNumber}>PNR: {booking.pnr}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.passengers[0]?.status || '') }]}>
                  <CheckCircle size={14} color="#FFFFFF" />
                  <Text style={styles.statusText}>
                    {formatStatus(booking.passengers[0]?.status || 'Unknown')}
                  </Text>
                </View>
              </View>

              <Text style={styles.trainInfo}>
                {booking.trainNumber} - {booking.trainName}
              </Text>
              <Text style={styles.classInfo}>
                Class: {booking.journeyClass} | Date: {booking.date}
              </Text>
              <Text style={styles.boardingInfo}>
                Boarding: {booking.boardingPoint}
              </Text>

              <View style={styles.passengersContainer}>
                <Text style={styles.sectionTitle}>Passenger Details</Text>
                
                {/* First passenger - always shown */}
                <View style={styles.passengerCard}>
                  <Text style={styles.passengerTitle}>
                    Passenger 1
                  </Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status : </Text>
                    <Text
                      style={[
                        styles.detailValue,
                        { color: getStatusColor(booking.passengers[0]?.status || '') },
                      ]}
                    >
                      {formatStatus(booking.passengers[0]?.status || 'Unknown')}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Coach : </Text>
                    <Text style={styles.detailValue}>
                      {booking.passengers[0]?.coach || '-'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Berth : </Text>
                    <Text style={styles.detailValue}>
                      {booking.passengers[0]?.berth || '-'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Seat : </Text>
                    <Text style={styles.detailValue}>
                      {booking.passengers[0]?.seat || '-'}
                    </Text>
                  </View>
                </View>

                {/* Toggle button for multiple passengers */}
                {booking.passengers.length > 1 && (
                  <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => toggleExpanded(booking.id)}
                  >
                    <Text style={styles.toggleText}>
                      {expandedPNRs.has(booking.id) 
                        ? `Hide ${booking.passengers.length - 1} other passengers` 
                        : `Show ${booking.passengers.length - 1} more passengers`}
                    </Text>
                    {expandedPNRs.has(booking.id) ? (
                      <ChevronUp size={16} color="#2563EB" />
                    ) : (
                      <ChevronDown size={16} color="#2563EB" />
                    )}
                  </TouchableOpacity>
                )}

                {/* Additional passengers - shown when expanded */}
                {expandedPNRs.has(booking.id) && booking.passengers.slice(1).map((passenger, index) => (
                  <View key={index} style={styles.passengerCard}>
                    <Text style={styles.passengerTitle}>
                      Passenger {index + 2}
                    </Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Status : </Text>
                      <Text
                        style={[
                          styles.detailValue,
                          { color: getStatusColor(passenger.status || '') },
                        ]}
                      >
                        {formatStatus(passenger.status || 'Unknown')}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Coach : </Text>
                      <Text style={styles.detailValue}>
                        {passenger.coach || '-'}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Berth : </Text>
                      <Text style={styles.detailValue}>
                        {booking.passengers[0]?.berth || '-'}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Seat : </Text>
                      <Text style={styles.detailValue}>
                        {passenger.seat || '-'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* Journey Details */}
              <View style={styles.journeyContainer}>
                <Text style={styles.journeyTitle}>Journey Details</Text>
                <View style={styles.journeyRow}>
                  <View style={styles.journeyPoint}>
                    <MapPin size={30} color="#153cb9ff" />
                    <View style={styles.journeyInfo}>
                      <Text style={styles.journeyLabel}>From</Text>
                      <Text style={styles.journeyValue}>
                        {booking.from}
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
                        {booking.to}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.actionBar}>
              <Text style={styles.lastChecked}>Last checked: {booking.lastChecked}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, booking.isRefreshing && styles.actionButtonDisabled]}
                  onPress={() => handleRefreshPNR(booking.id)}
                  disabled={booking.isRefreshing}
                >
                  <RefreshCw size={16} color={booking.isRefreshing ? "#94A3B8" : "#2563EB"} />
                  <Text style={[styles.actionButtonText, booking.isRefreshing && styles.actionButtonTextDisabled]}>
                    {booking.isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => openDeleteModal(booking.id)}
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              animationType="fade"
              transparent
              visible={deleteModalVisible}
              onRequestClose={() => setDeleteModalVisible(false)}
            >
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}>
                <View style={{
                  backgroundColor: '#fff',
                  padding: 20,
                  borderRadius: 12,
                  width: '80%',
                }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 12 }}>
                    Delete PNR
                  </Text>
                  <Text style={{ marginBottom: 24 }}>
                    Are you sure you want to remove this PNR from your saved list?
                  </Text>

                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                    <Pressable onPress={() => setDeleteModalVisible(false)}>
                      <Text style={{ color: '#2563EB', fontWeight: '600' }}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={confirmDeletePNR}>
                      <Text style={{ color: '#DC2626', fontWeight: '600' }}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
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
  pnrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pnrNumber: {
    fontSize: 20,
    fontWeight: '700',
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
    fontFamily: 'Inter-SemiBold',
  },
  trainInfo: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  classInfo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  boardingInfo: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    fontWeight: '500',
    fontFamily: 'Inter-Regular',
  },
  passengersContainer: {
    marginBottom: 24,
  },
  passengerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 15,
    color: '#64748B',
    minWidth: 80,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    marginBottom: 8,
  },
  toggleText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Inter-SemiBold',
  },
  journeyContainer: {
    marginBottom: 16,
  },
  journeyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  journeyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  journeyPoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  journeyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  journeyLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  journeyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  journeyArrow: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  arrowText: {
    fontSize: 24,
    color: '#64748B',
    fontWeight: 'bold',
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