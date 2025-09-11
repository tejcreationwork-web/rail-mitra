import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Brain as Train, User, MapPin, CircleCheck as CheckCircle } from 'lucide-react-native';

type Passenger = {
  name: string;
  age: string;
  gender: string;
  coach: string;
  seat: string;
};

type Journey = {
  boarding: string;
  arrival: string;
};

type PNRData = {
  pnr: string;
  trainNumber: string;
  trainName: string;
  status: string;
  from: string;
  to: string;
  date: string;
  passenger: Passenger;
  journey: Journey;
};

export default function PNRChecker() {
  const router = useRouter();
  const [pnrNumber, setPnrNumber] = useState('');
  const [pnrData, setPnrData] = useState<PNRData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockPNRData: PNRData = {
    pnr: '1234567890',
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    status: 'Confirmed',
    from: 'Mumbai Central (MMCT)',
    to: 'New Delhi (NDLS)',
    date: '17:55',
    passenger: {
      name: 'Rajesh Kumar Singh',
      age: '35 years',
      gender: 'Male',
      coach: 'S4',
      seat: '23',
    },
    journey: {
      boarding: '17:55',
      arrival: '08:35+1',
    },
  };

  const handleSearch = () => {
    if (!pnrNumber.trim()) {
      Alert.alert('Error', 'Please enter PNR number');
      return;
    }
    if (pnrNumber.length !== 10) {
      Alert.alert('Error', 'PNR number should be 10 digits');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setPnrData({ ...mockPNRData, pnr: pnrNumber });
      setIsLoading(false);
    }, 1500);
  };

  const clearData = () => {
    setPnrData(null);
    setPnrNumber('');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PNR Checker</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter PNR Number</Text>
          <View style={styles.inputWrapper}>
            <Train size={22} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={pnrNumber}
              onChangeText={setPnrNumber}
              placeholder="1234567890"
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
        {pnrData && (
          <View style={styles.resultContainer}>
            <View style={styles.pnrHeader}>
              <Text style={styles.pnrNumber}>PNR: {pnrData.pnr}</Text>
              <View style={styles.statusBadge}>
                <CheckCircle size={18} color="#FFFFFF" />
                <Text style={styles.statusText}>{pnrData.status}</Text>
              </View>
            </View>
            <Text style={styles.trainInfo}>
              Train: {pnrData.trainNumber} - {pnrData.trainName}
            </Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Passenger Details</Text>
              <View style={styles.detailRow}>
                <User size={18} color="#64748B" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>{pnrData.passenger.name}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Age</Text>
                <Text style={styles.detailValue}>{pnrData.passenger.age}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>{pnrData.passenger.gender}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Coach</Text>
                <Text style={styles.detailValue}>{pnrData.passenger.coach}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Seat/Berth</Text>
                <Text style={styles.detailValue}>{pnrData.passenger.seat}</Text>
              </View>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.sectionTitle}>Journey Details</Text>
              <View style={styles.journeyRow}>
                <View style={styles.journeyPoint}>
                  <MapPin size={18} color="#1E40AF" />
                  <View style={styles.journeyInfo}>
                    <Text style={styles.journeyLabel}>From</Text>
                    <Text style={styles.journeyValue}>{pnrData.from}</Text>
                    <Text style={styles.journeyTime}>{pnrData.journey.boarding}</Text>
                  </View>
                </View>
                <View style={styles.journeyArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
                <View style={styles.journeyPoint}>
                  <MapPin size={18} color="#DC2626" />
                  <View style={styles.journeyInfo}>
                    <Text style={styles.journeyLabel}>To</Text>
                    <Text style={styles.journeyValue}>{pnrData.to}</Text>
                    <Text style={styles.journeyTime}>{pnrData.journey.arrival}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ...existing styles...

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
    alignItems: 'center',
    marginBottom: 16,
  },
  pnrNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
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
    alignItems: 'center',
  },
  journeyPoint: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  journeyInfo: {
    marginLeft: 12,
    flex: 1,
  },
  journeyLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  journeyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginVertical: 4,
  },
  journeyTime: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  journeyArrow: {
    paddingHorizontal: 20,
  },
  arrowText: {
    fontSize: 24,
    color: '#64748B',
    fontWeight: 'bold',
  },
});