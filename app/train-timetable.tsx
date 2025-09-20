import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, Search, TrainFront as Train, Clock, MapPin, RefreshCw as Refresh } from 'lucide-react-native';

export default function TrainTimetable() {
  const [trainNumber, setTrainNumber] = useState('');
  const [timetableData, setTimetableData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!trainNumber.trim()) return;

    setIsLoading(true);

    try {
      const url = "https://wps.konkanrailway.com/trnschwar/trainschedule/loadTrainDetailList";

      const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Origin: "https://wps.konkanrailway.com",
        Referer: "https://wps.konkanrailway.com/Website_TrnSch/trainschedule",
        "User-Agent": "Mozilla/5.0",
      };

      const body = {
        trainNumber: trainNumber.padEnd(15, " "), // API expects padded train no
        category: "Regular",
      };

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const raw = await res.text(); // sometimes it's plain text
      let data;

      try {
        data = JSON.parse(raw);
      } catch {
        console.error("Invalid JSON:", raw);
        data = [];
      }

      if (Array.isArray(data)) {
        const mappedData = {
          trainNumber: trainNumber,
          trainName: `Train ${trainNumber}`,
          runsOn: data[0]?.trainRemarks || "N/A",
          stations: data.map((item: any) => ({
            code: item.stnNo,
            name: item.stnName?.trim(),
            arrival: item.arrival ? item.arrival.substring(0, 5) : "---",
            departure: item.departure ? item.departure.substring(0, 5) : "---",
            halt: item.halts ? `${item.halts} min` : "-",
            distance: item.trainType || "-", // since API doesn’t send distance
          })),
        };

        setTimetableData(mappedData);
      } else {
        console.warn("Unexpected response:", data);
        setTimetableData(null);
      }
    } catch (error) {
      console.error("Error fetching train timetable:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const formatTime = (time: string) => {
    if (time === '---') return time;
    return time;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Train Timetable</Text>
        <TouchableOpacity style={styles.refreshButton}>
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
              placeholder="12951"
              keyboardType="numeric"
            />
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
        </View>

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
              {timetableData.stations.map((station: any, index: number) => (
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
              <Text style={styles.updateText}>Last updated: 2022-02-11 01:41</Text>
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