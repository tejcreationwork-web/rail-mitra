import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, Animated, Easing
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, MapPin, Info, Check } from 'lucide-react-native';

let MapView: any, Marker: any;
if (Platform.OS !== "web") {
  const RNMaps = require("react-native-maps");
  MapView = RNMaps.default;
  Marker = RNMaps.Marker;
}

type Station = {
  id: string;
  name: string;
  code: string;
  description: string;
  latitude: number;
  longitude: number;
};

export default function StationLayout() {
  const stations: Station[] = [
    {
      id: 'thane',
      name: 'Thane Railway Station',
      code: 'TNA',
      description: 'Major railway junction on the Central Railway line serving Mumbai suburban and long-distance trains.',
      latitude: 19.18648,
      longitude: 72.97577,
    },
    {
      id: 'dadar',
      name: 'Dadar Railway Station',
      code: 'DR',
      description: 'One of the busiest railway stations in Mumbai, serving both Central and Western Railway lines.',
      latitude: 19.021556,
      longitude: 72.844065,
    },
  ];

  const [selectedStationId, setSelectedStationId] = useState('thane');
  const [showDropdown, setShowDropdown] = useState(false);

  // Animated chevron rotation
  const rotateAnim = useState(new Animated.Value(0))[0]; // 0 = closed, 1 = open

  const toggleDropdown = () => {
    const toValue = showDropdown ? 0 : 1;
    Animated.timing(rotateAnim, {
      toValue,
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    setShowDropdown(!showDropdown);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // rotate chevron
  });

  const selectedStation = stations.find(station => station.id === selectedStationId) || stations[0];

  const handleStationSelect = (stationId: string) => {
    setSelectedStationId(stationId);
    setShowDropdown(false);
    Animated.timing(rotateAnim, {
      toValue: 0, // reset chevron
      duration: 200,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={{ backgroundColor: "#1E40AF", paddingTop: 45, paddingHorizontal: 16, paddingBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.push('/')} 
          style={{ padding: 12, marginLeft: -12 }}
        >
          <ArrowLeft size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#FFFFFF" }}>Station Layout</Text>
        <TouchableOpacity style={{ padding: 12, marginRight: -12 }}>
          <Info size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 20 }}>
        {/* Dropdown */}
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, marginBottom: 20, elevation: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 16 }}>Select Railway Station</Text>

          <TouchableOpacity 
            style={{ flexDirection: "row", alignItems: "center", borderWidth: 2, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16, marginBottom: 16 }}
            onPress={toggleDropdown}
          >
            <MapPin size={22} color="#1E40AF" />
            <Text style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#1E293B", fontWeight: "500" }}>
              {selectedStation.name} ({selectedStation.code})
            </Text>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <ChevronDown size={22} color="#64748B" />
            </Animated.View>
          </TouchableOpacity>

          {showDropdown && (
            <View style={{ backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, marginTop: 8, elevation: 5 }}>
              {stations.map((station) => (
                <TouchableOpacity
                  key={station.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#F1F5F9",
                    backgroundColor: selectedStationId === station.id ? "#EBF4FF" : "#FFFFFF"
                  }}
                  onPress={() => handleStationSelect(station.id)}
                >
                  <MapPin size={18} color={selectedStationId === station.id ? "#1E40AF" : "#64748B"} />
                  <Text style={{
                    flex: 1,
                    marginLeft: 12,
                    fontSize: 15,
                    fontWeight: selectedStationId === station.id ? "600" : "500",
                    color: selectedStationId === station.id ? "#1E40AF" : "#64748B"
                  }}>
                    {station.name} ({station.code})
                  </Text>
                  {selectedStationId === station.id && <Check size={18} color="#1E40AF" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Station Map */}
        <View style={{ backgroundColor: "#FFFFFF", borderRadius: 16, padding: 24, marginBottom: 24, elevation: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#1E293B", textAlign: "center", marginBottom: 20 }}>
            {selectedStation.name} Location
          </Text>

          <View style={{ backgroundColor: "#F8FAFC", borderRadius: 16, overflow: "hidden", marginBottom: 20, height: 300 }}>
            {Platform.OS !== "web" ? (
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: selectedStation.latitude,
                  longitude: selectedStation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                region={{
                  latitude: selectedStation.latitude,
                  longitude: selectedStation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                showsUserLocation
                showsMyLocationButton
                showsCompass
                showsScale
                mapType="standard"
              >
                <Marker
                  coordinate={{
                    latitude: selectedStation.latitude,
                    longitude: selectedStation.longitude,
                  }}
                  title={selectedStation.name}
                  description={`${selectedStation.code} - ${selectedStation.description}`}
                  pinColor="#1E40AF"
                />
              </MapView>
            ) : (
              <View style={{ height: 300, alignItems: "center", justifyContent: "center" }}>
                <Text>🗺️ Map not available on Web</Text>
              </View>
            )}
          </View>
        </View>
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
  infoButton: {
    padding: 12,
    marginRight: -12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  stationSelector: {
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
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  dropdownText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  chevron: {
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dropdownItemSelected: {
    backgroundColor: '#EBF4FF',
  },
  dropdownItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  layoutContainer: {
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
  layoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
  },
  mapContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    height: 300,
  },
  map: {
    flex: 1,
    height: 300,
  },
  stationInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
  },
  stationInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  stationInfoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  coordinatesInfo: {
    alignItems: 'center',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'monospace',
  },
  amenitiesContainer: {
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
  amenitiesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  amenityItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  amenityIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
  },
});