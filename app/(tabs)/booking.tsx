import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Calendar, Clock, Brain as Train, MapPin, User, RefreshCw, Trash2, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

type SavedPNR = {
  id: string;
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: string;
  coach: string;
  seat: string;
  passengerName: string;
  lastChecked: string;
  isRefreshing?: boolean;
};

export default function BookingScreen() {
  const [savedPNRs, setSavedPNRs] = useState<SavedPNR[]>([
    {
      id: '1',
      pnr: '1234567890',
      trainNumber: '12951',
      trainName: 'Mumbai Rajdhani Express',
      from: 'Mumbai Central',
      to: 'New Delhi',
      date: '15 Dec 2023',
      time: '17:55',
      status: 'Confirmed',
      coach: 'S4',
      seat: '23',
      passengerName: 'Rajesh Kumar Singh',
      lastChecked: '2 hours ago',
      isRefreshing: false,
    },
    {
      id: '2',
      pnr: '9876543210',
      trainNumber: '12002',
      trainName: 'Bhopal Shatabdi',
      from: 'New Delhi',
      to: 'Bhopal',
      date: '20 Dec 2023',
      time: '06:00',
      status: 'Waitlisted',
      coach: 'C1',
      seat: 'WL/45',
      passengerName: 'Priya Sharma',
      lastChecked: '5 hours ago',
      isRefreshing: false,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return '#059669';
      case 'Waitlisted':
        return '#F59E0B';
      case 'Cancelled':
        return '#DC2626';
      case 'RAC':
        return '#2563EB';
      default:
        return '#64748B';
    }
  };

  const handleRefreshPNR = async (pnrId: string) => {
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
            status: randomStatus,
            lastChecked: 'Just now',
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
          onPress: () => {
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
    Alert.alert(
      'PNR Details',
      `PNR: ${pnr.pnr}\nTrain: ${pnr.trainNumber} - ${pnr.trainName}\nPassenger: ${pnr.passengerName}\nStatus: ${pnr.status}\nCoach: ${pnr.coach}, Seat: ${pnr.seat}\nLast Checked: ${pnr.lastChecked}`,
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
              {savedPNRs.filter(pnr => pnr.status === 'Confirmed').length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {savedPNRs.filter(pnr => pnr.status === 'Waitlisted').length}
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
              </View>
            </View>

            <View style={styles.pnrSection}>
              <Text style={styles.pnrLabel}>PNR: {booking.pnr}</Text>
              <Text style={styles.passengerName}>{booking.passengerName}</Text>
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
                    <Clock size={14} color="#64748B" />
                    <Text style={styles.timeText}>{booking.time}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.seatInfo}>
              <View style={styles.seatDetail}>
                <User size={16} color="#64748B" />
                <Text style={styles.seatText}>Coach: {booking.coach}</Text>
              </View>
              <View style={styles.seatDetail}>
                <Text style={styles.seatText}>Seat: {booking.seat}</Text>
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