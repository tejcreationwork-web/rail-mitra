import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ArrowLeft, Train, Clock, RefreshCw } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { router } from "expo-router";

// Mock data (replace with your JSON imports)
import trainList from "../assets/data/trains.json";
import rawData from "../assets/data/timetables.json";

const timetablesRaw: any = rawData;

export default function TrainTimetable() {
  const [open, setOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [timetableData, setTimetableData] = useState<any>(null);

  // Trim keys and station names
  const timetables: any = Object.keys(timetablesRaw).reduce((acc: any, key) => {
    acc[key.trim()] = timetablesRaw[key].map((station: any) => ({
      ...station,
      stnName: station.stnName.trim(),
    }));
    return acc;
  }, {});

  const trainOptions = trainList.map((train) => ({
    label: `${train.number.trim()} - ${train.name.trim()}`,
    value: train.number.trim(),
  }));

  const handleSelect = (trainNumber: string) => {
    setSelectedTrain(trainNumber);

    const timetable =
      timetables[trainNumber.trim()] || timetables[trainNumber.padEnd(12, " ")];

    if (timetable) {
      const mappedData = {
        trainNumber,
        trainName:
          trainList.find((t) => t.number.trim() === trainNumber)?.name.trim() ||
          "",
        runsOn: timetable[0]?.trainRemarks || "N/A",
        stations: timetable.map((s: any) => ({
          code: s.stnNo,
          name: s.stnName,
          arrival: s.arrival ? s.arrival.slice(0, 5) : "---",
          departure: s.departure ? s.departure.slice(0, 5) : "---",
          noOfDays: s.noOfDays || 1,
        })),
      };
      setTimetableData(mappedData);
    } else {
      setTimetableData(null);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Train Timetable</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <RefreshCw size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <View style={{ zIndex: 1000, margin: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 50, // fixed height to match input
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Train size={24} color="#64748B" style={{ marginRight: 8 }} />

          <DropDownPicker
            open={open}
            value={selectedTrain}
            items={trainOptions}
            setOpen={setOpen}
            setValue={(callback) => {
              const val = callback(selectedTrain);
              if (typeof val === "string") handleSelect(val);
            }}
            searchable={true}
            placeholder="Search train by number or name"
            placeholderStyle={{ color: "#A1A1AA", fontSize: 14 }} // lighter color
            style={{
              flex: 1,
              backgroundColor: "transparent",
              borderWidth: 0,
              paddingVertical: 0,
              paddingRight: 20,
            }}
            arrowIconStyle={{ marginRight: 8 }}
            listMode="MODAL"
          />
        </View>
      </View>

      {/* Timetable */}
      {timetableData && (
        <FlatList
          data={timetableData.stations}
          keyExtractor={(_, i) => i.toString()}
          ListHeaderComponent={() => (
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
                <Text style={[styles.columnHeader, styles.stationColumn]}>
                  Station
                </Text>
                <Text style={styles.columnHeader}>Arrival</Text>
                <Text style={styles.columnHeader}>Depart</Text>
                <Text style={styles.columnHeader}>Day</Text>
              </View>
            </View>
          )}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <View style={styles.stationRow}>
              <Text style={styles.stationCode}>{item.code}</Text>
              <View style={styles.stationInfo}>
                <Text style={styles.stationName}>{item.name}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.arrival}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{item.departure}</Text>
              </View>
              <Text style={styles.haltText}>{item.noOfDays}</Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.updateInfo}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.updateText}>
                Last updated: 2022-02-11 01:41
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#2563EB",
    paddingTop: 45,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: "600", color: "#FFFFFF" },
  refreshButton: { padding: 8, marginRight: -8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  trainHeader: { marginBottom: 16 },
  trainBadge: {
    backgroundColor: "#2563EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  trainNumber: { color: "#FFFFFF", fontSize: 14, fontWeight: "600", marginLeft: 8, flex: 1 },
  runsOn: { fontSize: 14, color: "#64748B", marginTop: 2 },
  timetableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  columnHeader: { fontSize: 12, fontWeight: "600", color: "#475569", width: 60, textAlign: "center" },
  stationColumn: { flex: 1, textAlign: "left", marginLeft: 8 },
  stationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  stationCode: { fontSize: 12, fontWeight: "600", color: "#2563EB", width: 90, textAlign: "center" },
  stationInfo: { flex: 1, marginLeft: 8 },
  stationName: { fontSize: 13, color: "#1E293B", fontWeight: "500" },
  timeContainer: { width: 50 },
  timeText: { fontSize: 12, color: "#1E293B", fontWeight: "500" },
  haltText: { fontSize: 11, color: "#64748B", width: 50, textAlign: "center" },
  updateInfo: { flexDirection: "row", alignItems: "center", marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#E2E8F0" },
  updateText: { fontSize: 12, color: "#64748B", marginLeft: 8 },
});
