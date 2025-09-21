import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { ArrowLeft, TrainFront as Train, Clock, RefreshCw } from "lucide-react-native";
import { router } from "expo-router";

// Mock data (replace with your JSON imports)
import trainList from "../assets/data/trains.json";
import rawData from "../assets/data/timetables.json";

const timetablesRaw: any = rawData;

export default function TrainTimetable() {
  const [open, setOpen] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<string | null>(null);
  const [timetableData, setTimetableData] = useState<any>(null);
  const [query, setQuery] = useState("");

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
    setQuery(
      `${trainNumber} - ${
        trainList.find((t) => t.number.trim() === trainNumber)?.name.trim() || ""
      }`
    );
    setOpen(false);

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

  // filter dropdown results
  const filteredOptions = trainOptions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

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

      {/* Input + Dropdown */}
      <View style={{ zIndex: 1000, margin: 15 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 12,
            paddingHorizontal: 12,
            height: 50,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Train size={24} color="#64748B" style={{ marginRight: 8 }} />

          <TextInput
            style={{ flex: 1, fontSize: 14, color: "#1E293B" }}
            placeholder="Enter Train Number or Name"
            placeholderTextColor="#A1A1AA"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
        </View>

        {/* custom dropdown list */}
        {open && filteredOptions.length > 0 && (
          <View
            style={{
              marginTop: 4,
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
              maxHeight: 250,
              borderWidth: 1,
              borderColor: "#E5E7EB",
            }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {filteredOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F1F5F9",
                  }}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#1E293B",
                      fontWeight:
                        selectedTrain === item.value ? "600" : "500",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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

              {/* Column Header Row */}
              <View style={styles.timetableHeader}>
                <Text style={[styles.columnHeader, { flex: 0.8 }]}>Code</Text>
                <Text style={[styles.columnHeader, { flex: 2, textAlign: "left" }]}>Station</Text>
                <Text style={[styles.columnHeader, { flex: 1 }]}>Arrival</Text>
                <Text style={[styles.columnHeader, { flex: 1 }]}>Depart</Text>
                <Text style={[styles.columnHeader, { flex: 0.7 }]}>Day</Text>
              </View>
            </View>
          )}
          stickyHeaderIndices={[0]}
          renderItem={({ item }) => (
            <View style={styles.stationRow}>
              <Text style={[styles.stationCode, { flex: 0.8, textAlign: "center" }]}>
                {item.code}
              </Text>
              <Text style={[styles.stationName, { flex: 2 }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.timeText, { flex: 1, textAlign: "center" }]}>
                {item.arrival}
              </Text>
              <Text style={[styles.timeText, { flex: 1, textAlign: "center" }]}>
                {item.departure}
              </Text>
              <Text style={[styles.haltText, { flex: 0.7, textAlign: "center" }]}>
                {item.noOfDays}
              </Text>
            </View>
          )}
          ListFooterComponent={() => (
            <View style={styles.updateInfo}>
              <Clock size={16} color="#64748B" />
              <Text style={styles.updateText}>Last updated: 2025-09-20 01:41</Text>
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
  trainNumber: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  runsOn: { fontSize: 14, color: "#64748B", marginTop: 2 },
  timetableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "#E2E8F0",
    backgroundColor: "#F8FAFC",
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    textAlign: "center",
  },

  stationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  stationCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2563EB",
  },
  stationName: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "500",
  },
  timeText: {
    fontSize: 12,
    color: "#1E293B",
    fontWeight: "500",
  },
  haltText: {
    fontSize: 11,
    color: "#64748B",
  },
  updateInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  updateText: { fontSize: 12, color: "#64748B", marginLeft: 8 },
});
