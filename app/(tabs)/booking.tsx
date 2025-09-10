import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, Clock, Brain as Train, MapPin, User } from 'lucide-react-native';

export default function BookingScreen() {
  const bookings = [
    {
      id: 1,
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
    },
    {
      id: 2,
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
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return '#059669';
      case 'Waitlisted':
        return '#F59E0B';
      case 'Cancelled':
        return '#DC2626';
      default:
        return '#64748B';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>Track all your train bookings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {bookings.map((booking) => (
          <TouchableOpacity key={booking.id} style={styles.bookingCard} activeOpacity={0.7}>
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
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.newBookingButton}>
          <Text style={styles.newBookingText}>+ Book New Ticket</Text>
        </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
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
  },
  pnrSection: {
    marginBottom: 16,
  },
  pnrLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
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
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
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
  },
  newBookingButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  newBookingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});