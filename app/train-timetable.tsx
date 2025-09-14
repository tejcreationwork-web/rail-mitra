import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, Search, TrainFront as Train, Clock, MapPin, RefreshCw as Refresh } from 'lucide-react-native';

type StationData = {
  stnNo: string;
  stnName: string;
  trainNoCc: string;
  arrival: string | null;
  departure: string;
  noOfDays: number;
  halts: number;
  trainRemarks: string;
  trainType: string;
  dateEffFrom: string | null;
  dateEffTo: string | null;
  userId: string | null;
};

type TimetableData = {
  trainNumber: string;
  trainName: string;
  runsOn: string;
  stations: {
    code: string;
    name: string;
    arrival: string;
    departure: string;
    halt: string;
    distance: string;
  }[];
};

export default function TrainTimetable() {
  const [trainNumber, setTrainNumber] = useState('');
  const [timetableData, setTimetableData] = useState<TimetableData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainTimetable = async (trainNoCc: string): Promise<StationData[]> => {
    const paddedTrainNo = trainNoCc.padStart(5, '0');
    const category = paddedTrainNo.startsWith('0') ? 'SPECIAL' : 'REGULAR';

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      throw new Error('EXPO_PUBLIC_SUPABASE_URL environment variable is not set');
    }

    if (!supabaseAnonKey) {
      throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable is not set');
    }

    const apiUrl = `${supabaseUrl}/functions/v1/train-timetable`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trainNoCc: paddedTrainNo,
        category: category
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    // Read response as text first
    const responseText = await response.text();
    
    // Check if response is empty
    if (!responseText.trim()) {
      throw new Error('Empty response from API');
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
    }

    // Handle error response from API
    if (data.error) {
      throw new Error(data.error);
    }
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No timetable data found for this train number');
    }

    return data;
  };

  const formatTimetableData = (apiData: StationData[]): TimetableData => {
    const firstStation = apiData[0];
    
    return {
      trainNumber: firstStation.trainNoCc.trim(),
      trainName: `Train ${firstStation.trainNoCc.trim()}`, // API doesn't provide train name
      runsOn: firstStation.trainRemarks.trim(),
      stations: apiData.map((station, index) => ({
        code: station.stnNo.trim(),
        name: station.stnName.trim(),
        arrival: station.arrival || '---',
        departure: station.departure,
        halt: station.halts > 0 ? `${station.halts} min` : '---',
        distance: `${index * 50} km`, // Approximate distance calculation
      }))
    };
  };

  const handleSearch = () => {
    if (!trainNumber.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setTimetableData(null);
    
    fetchTrainTimetable(trainNumber.trim())
      .then((apiData) => {
        const formattedData = formatTimetableData(apiData);
        setTimetableData(formattedData);
      })
      .catch((err) => {
        console.error('Error fetching timetable:', err);
        setError(err.message || 'Failed to fetch train timetable');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clearData = () => {
    setTimetableData(null);
    setTrainNumber('');
    setError(null);
  };

  const handleRefresh = () => {
    if (trainNumber.trim()) {
      handleSearch();
    }
  };

  const formatTime = (time: string) => {
    if (time === '---' || !time) return '---';
    
    // Handle time format from API (HH:MM:SS)
    if (time.includes(':')) {
      const parts = time.split(':');
      return `${parts[0]}:${parts[1]}`;
    }
    
    return time;
  };

  const calculateHalt = (arrival: string, departure: string) => {
    if (!arrival || arrival === '---') return '---';
    
    try {
      const arrTime = new Date(`1970-01-01T${arrival}`);
      const depTime = new Date(`1970-01-01T${departure}`);
      const diffMs = depTime.getTime() - arrTime.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      return diffMins > 0 ? `${diffMins} min` : '---';
    } catch {
      return '---';
    }
  };

  const mockTimetableData = {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    runsOn: 'Daily',
    stations: [
      { code: 'MMCT', name: 'Mumbai Central', arrival: '---', departure: '16:55', halt: '5 min', distance: '0 km' },
      { code: 'BRC', name: 'Vadodara Junction', arrival: '19:43', departure: '19:48', halt: '5 min', distance: '392 km' },
      { code: 'RTM', name: 'Ratlam Junction', arrival: '22:25', departure: '22:30', halt: '5 min', distance: '589 km' },
      { code: 'KOTA', name: 'Kota Junction', arrival: '01:40', departure: '01:45', halt: '5 min', distance: '842 km' },
      { code: 'SWM', name: 'Sawai Madhopur', arrival: '02:48', departure: '02:50', halt: '2 min', distance: '972 km' },
      { code: 'BKI', name: 'Bandikui Junction', arrival: '04:28', departure: '04:30', halt: '2 min', distance: '1074 km' },
      { code: 'JP', name: 'Jaipur Junction', arrival: '05:15', departure: '05:20', halt: '5 min', distance: '1157 km' },
      { code: 'AWR', name: 'Alwar Junction', arrival: '06:43', departure: '06:45', halt: '2 min', distance: '1288 km' },
      { code: 'RE', name: 'Rewari Junction', arrival: '07:23', departure: '07:25', halt: '2 min', distance: '1345 km' },
      { code: 'GHH', name: 'Garhi Harsaru', arrival: '08:18', departure: '08:20', halt: '2 min', distance: '1401 km' },
    ]
  };

  const handleMockSearch = () => {
    if (!trainNumber.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setTimetableData({ ...mockTimetableData, trainNumber: trainNumber });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Train Timetable</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Refresh size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Text style={styles.inputLabel}>Enter Train Number</Text>
          <View style={styles.inputWrapper}>
            <Train size={20} color="#64748B" />
            <TextInput
              style={styles.textInput}
              value={trainNumber}
              onChangeText={setTrainNumber}
              placeholder="e.g. 12620, 01234"
              keyboardType="numeric"
            />
            {trainNumber.length > 0 && (
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
            <Search size={20} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>
              {isLoading ? 'Loading...' : 'Search'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.mockButton]}
            onPress={handleMockSearch}
            disabled={isLoading}
          >
            <Text style={styles.mockButtonText}>Try Sample Data</Text>
          </TouchableOpacity>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleSearch}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {timetableData && (
          <View style={styles.resultContainer}>
            <View style={styles.trainHeader}>
              <View style={styles.trainBadge}>
                <Train size={20} color="#FFFFFF" />
                <Text style={styles.trainNumber}>
                  {timetableData.trainNumber} - {timetableData.trainName}
                </Text>
              </View>
              <Text style={styles.runsOn}>Runs: {timetableData.runsOn}</Text>
            </View>

            <View style={styles.timetableHeader}>
              <Text style={styles.columnHeader}>Code</Text>
              <Text style={[styles.columnHeader, styles.stationColumn]}>Station</Text>
              <Text style={styles.columnHeader}>Arrival</Text>
              <Text style={styles.columnHeader}>Depart</Text>
              <Text style={styles.columnHeader}>Halt</Text>
              <Text style={styles.columnHeader}>Distance</Text>
            </View>

            <ScrollView style={styles.stationsContainer} showsVerticalScrollIndicator={true}>
              {timetableData.stations.map((station, index: number) => (
                <View key={index} style={styles.stationRow}>
                  <Text style={styles.stationCode}>{station.code}</Text>
                  <View style={styles.stationInfo}>
                    <Text style={styles.stationName}>{station.name}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.timeText, station.arrival === '---' && styles.noTime]}>
                      {formatTime(station.arrival)}
                    </Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{formatTime(station.departure)}</Text>
                  </View>
                  <Text style={styles.haltText}>{station.halt}</Text>
                  <Text style={styles.distanceText}>{station.distance}</Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.updateInfo}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.updateText}>Last updated: {new Date().toLocaleString()}</Text>
            </View>
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
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  refreshButton: {
    padding: 8,
    marginRight: -8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  searchContainer: {
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
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  textInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  searchButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  mockButton: {
    backgroundColor: '#64748B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  mockButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    fontSize: 18,
    color: '#64748B',
    paddingHorizontal: 8,
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
    fontWeight: '600',
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
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
  trainHeader: {
    marginBottom: 20,
  },
  trainBadge: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  trainNumber: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  runsOn: {
    fontSize: 14,
    color: '#64748B',
  },
  timetableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    width: 50,
    textAlign: 'center',
  },
  stationColumn: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 8,
  },
  stationsContainer: {
    maxHeight: 400,
  },
  stationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  stationCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
    width: 50,
    textAlign: 'center',
  },
  stationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  stationName: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  timeContainer: {
    width: 50,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
  },
  noTime: {
    color: '#94A3B8',
  },
  haltText: {
    fontSize: 11,
    color: '#64748B',
    width: 50,
    textAlign: 'center',
  },
  distanceText: {
    fontSize: 11,
    color: '#64748B',
    width: 50,
    textAlign: 'center',
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  updateText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
  },
});