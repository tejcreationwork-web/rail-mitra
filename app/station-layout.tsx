import { 
  View, Text, StyleSheet, ScrollView,ImageBackground, TouchableOpacity, StatusBar, Platform, Modal, Image, Linking 
} from 'react-native';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

import { useState, useEffect,useRef } from 'react';
import SearchableDropdown from '@/components/SearchableDropdown';
import { router } from 'expo-router';
import StationMap from '@/components/StationMap';
import { ArrowLeft, MapPin, Info, Utensils, X, Clock, Phone, CheckCircle} from 'lucide-react-native';
import { supabase } from '@/lib/supabase';  // 👈 Import Supabase client

let MapView: any, Marker: any;
if (Platform.OS !== "web") {
  try {
    const RNMaps = require("react-native-maps");
    MapView = RNMaps.default;
    Marker = RNMaps.Marker;
  } catch (error) {
    console.warn("react-native-maps not available");
  }
}

type Station = {
  stn_code: string;
  stn_name: string;
  lat: number;
  lon: number;
  description?: string;
};

type Amenity = {
  id: number;
  stn_code: string;
  ame_name: string;
  ame_desc: string;
  photo_url?: string;
  availability: string; // e.g., "24/7", "6 AM - 10 PM"
  location : string; // e.g., "Near Platform 1"
  hours : string; // e.g., "6 AM - 10 PM"
  rating : number; // average rating
  ame_short_name : string; // short name for quick reference
  ame_type : string; // e.g., "Restroom", "Food", "ATM"
  icon_name : string; // name of the icon to represent the amenity
  // you can add detailedInfo JSON later if needed
};


const getAmenityIcon = (
  iconName: string,
  size: number = 24,
  color: string = "#2563EB"
  ) => {
    if (!iconName) return <FontAwesome5 name="question-circle" size={size} color={color} />;

    const cleanName = iconName.replace(/^fa-/, ""); // remove fa- prefix if exists

    // ✅ Known mapping adjustments
    const nameMap: Record<string, string> = {
      ticket: "ticket-alt", // FA5 expects ticket-alt
      water: "tint",        // FA5 tint = water drop
      info: "info-circle",
      location: "map-marker-alt",
    };

    const finalName = nameMap[cleanName] || cleanName;

    // Check if it's a FA5 icon
    const fa5Icons = ["utensils", "ticket-alt", "shield-alt", "restroom", "tint", "clock", "info-circle", "phone", "map-marker-alt", "concierge-bell"];
    if (fa5Icons.includes(finalName)) {
      return <FontAwesome5 name={finalName as any} size={size} color={color} solid />;
    }

    // Check if it's a MaterialCommunityIcon
    const mciIcons = ["elevator", "ticket-confirmation", "credit-card", "parking", "baby-carriage", "locker", "wheelchair-accessibility"];
    if (mciIcons.includes(finalName)) {
      return <MaterialCommunityIcons name={finalName as keyof typeof MaterialCommunityIcons.glyphMap} size={size} color={color} />;
    }

    // Fallback icon
    return <FontAwesome5 name="question-circle" size={size} color={color} />;
  };



export default function StationLayout() {
  const [stations, setStations] = useState<Station[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'layout' | 'amenities'>('layout');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [amenityModalVisible, setAmenityModalVisible] = useState(false);
  const mapRef = useRef<any>(null); // 🔹 ref to control the map

  // 🔹 Fetch stations
  useEffect(() => {
    const fetchStations = async () => {
      const { data, error } = await supabase
        .from("stations")
        .select("*");
      if (error) {
        console.error("Error fetching stations:", error);
      } else {
        setStations(data || []);
        if (data && data.length > 0) {
          setSelectedStationId(data[0].stn_code); // default select first station
        }
      }
    };
    fetchStations();
  }, []);

  // 🔹 Fetch amenities for selected station
  useEffect(() => {
    const fetchAmenities = async () => {
      if (!selectedStationId) return;
      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("stn_code", selectedStationId);
      if (error) {
        console.error("Error fetching amenities:", error);
      } else {
        setAmenities(data || []);
      }
    };
    fetchAmenities();
  }, [selectedStationId]);

  const selectedStation = stations.find(st => st.stn_code === selectedStationId) || null;

  // 🔹 Animate map when station changes
  useEffect(() => {
    if (selectedStation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: selectedStation.lat,
          longitude: selectedStation.lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000 // 1s smooth animation
      );
    }
  }, [selectedStationId]);

  // Dropdown options
  const stationOptions = (stations || []).map(station => ({
    id: station.stn_code,
    label: station.stn_name ? `${station.stn_name} (${station.stn_code})` : station.stn_code,
    value: station.stn_code,
  }));


  const handleStationSelect = (option: any) => {
    setSelectedStationId(option?.value || option);
  };

  const renderAmenityItem = (amenity: Amenity) => (
    <TouchableOpacity
      key={amenity.id}
      style={styles.amenityItem}
      onPress={() => {
        setSelectedAmenity(amenity);
        setAmenityModalVisible(true);
      }}
    >
      <View style={styles.amenityIcon}>
        {getAmenityIcon(amenity.icon_name ?? "question-circle")}
      </View>
      <Text style={{ fontSize: 12, color: "#64748B",fontWeight: "bold",alignItems:"center", textAlign:"center"}}>
        {amenity.ame_short_name}
      </Text>
    </TouchableOpacity>
  );


  return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.canGoBack() ? router.back() : router.push('/')} 
            style={styles.backButton}
          >
            <ArrowLeft size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Station Info</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Info size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Fixed Banner with Dropdown + Tabs */}
        <ImageBackground
          source={require("@/assets/images/station_layout_bg.jpg")} // 👈 place your image here
          style={styles.banner}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            {/* Station Selector */}
            <View style={styles.stationSelector}>
              <SearchableDropdown
                options={stationOptions}
                selectedValue={selectedStationId}
                onSelect={handleStationSelect}
                placeholder="Type to search station"
              />
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'layout' && styles.activeTab]}
                onPress={() => setActiveTab('layout')}
              >
                <MapPin size={20} color={activeTab === 'layout' ? "#FFFFFF" : "#64748B"} />
                <Text style={[styles.tabText, activeTab === 'layout' && styles.activeTabText]}>
                  Station Map
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'amenities' && styles.activeTab]}
                onPress={() => setActiveTab('amenities')}
              >
                <Utensils size={20} color={activeTab === 'amenities' ? "#FFFFFF" : "#64748B"} />
                <Text style={[styles.tabText, activeTab === 'amenities' && styles.activeTabText]}>
                  Amenities
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>

        {/* 🔹 Scrollable Content BELOW banner */}
        <ScrollView style={styles.content}>
          {activeTab === 'layout' && selectedStation ? (
            <View style={styles.layoutContainer}>
              <Text style={styles.layoutTitle}>
                {selectedStation.stn_name} Location
              </Text>

              <View style={styles.mapContainer}>
                {Platform.OS !== "web" && MapView ? (
                  <StationMap
                    lat={Number(selectedStation.lat)}
                    lon={Number(selectedStation.lon)}
                    stationName={`${selectedStation.stn_name} (${selectedStation.stn_code})`}
                    zoom={17} // 👈 closer zoom
                  />
                ) : (
                  <Text>🗺️ Map not available on Web</Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.amenitiesContainer}>
              <Text style={styles.amenitiesTitle}>Station Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {amenities.map(renderAmenityItem)}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Amenity Modal */}
        <Modal
          visible={amenityModalVisible}
          animationType="slide"
          onRequestClose={() => setAmenityModalVisible(false)}
        >
          {selectedAmenity && (
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setAmenityModalVisible(false)}>
                  <ArrowLeft size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalHeaderTitle}>Station Amenities</Text>
                <View style={{ width: 26 }} />
              </View>

              <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Image Section */}
                <View style={styles.imageSection}>
                  {selectedAmenity.photo_url ? (
                    <Image
                      source={{ uri: selectedAmenity.photo_url }}
                      style={styles.amenityImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.amenityImage, styles.placeholderImage]}>
                      <Text style={styles.placeholderText}>No Image Available</Text>
                    </View>
                  )}
                </View>

                {/* Details Section */}
                <View style={styles.detailsContainer}>
                  {/* Station + Amenity Title */}
                  <View style={styles.detailRow}>
                    <FontAwesome5 name="tag" size={18} color="#6366F1" />
                    <Text style={styles.detailText}>
                      {selectedAmenity.ame_name}
                    </Text>
                  </View>

                  {/* Location */}
                  <View style={styles.detailRow}>
                    <MapPin size={18} color="#EF4444" />
                    <Text style={styles.detailText}>
                      {selectedAmenity.location || "No location info"}
                    </Text>
                  </View>

                  {/* Timings */}
                  <View style={styles.detailRow}>
                    <Clock size={18} color="#0EA5E9" />
                    <Text style={styles.detailText}>
                      {selectedAmenity.hours || "Timings not available"}
                    </Text>
                  </View>

                  {/* Availability */}
                  <View style={styles.detailRow}>
                    <CheckCircle size={18} color="#22C55E" />
                    <Text style={styles.detailText}>
                      {selectedAmenity.availability || "Available"}
                    </Text>
                  </View>

                  {/* Rating */}
                  <View style={styles.detailRow}>
                    <FontAwesome5 name="star" size={18} color="#FACC15" />
                    <Text style={styles.detailText}>
                      {(selectedAmenity.rating
                        ? Number(selectedAmenity.rating).toFixed(1)
                        : "4.0")}{" "}
                      / 5
                    </Text>
                    <View style={styles.starRow}>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Text
                          key={i}
                          style={[
                            styles.star,
                            {
                              color:
                                i <= Math.round(Number(selectedAmenity.rating ?? 4))
                                  ? "#FACC15"
                                  : "#CBD5E1",
                            },
                          ]}
                        >
                          ★
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}
        </Modal>
      </View>
    );

}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#1E40AF', paddingTop: 45, paddingHorizontal: 16,
    paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  banner: {
    width: "100%",
  },
  overlay: {
    // backgroundColor: "rgba(248, 241, 241, 0.9)", 
    paddingHorizontal: 16,
    paddingVertical: 20,

  },
  backButton: { padding: 12, marginLeft: -12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  infoButton: { padding: 12, marginRight: -12 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  stationSelector: { backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 16, padding: 24, marginBottom: 20 },
  dropdown: { marginBottom: 0 },
  tabContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  activeTab: { backgroundColor: '#2563EB', borderRadius: 8 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B', marginLeft: 8 },
  activeTabText: { color: '#FFFFFF' },
  layoutContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, marginBottom: 24 },
  layoutTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', textAlign: 'center', marginBottom: 20 },
  mapContainer: { borderRadius: 16, overflow: 'hidden', height: 300, marginBottom: 20 },
  map: { flex: 1, height: 300 },
  amenitiesContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, marginBottom: 24 },
  amenitiesTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  amenityItem: { width: '30%', alignItems: 'center', marginBottom: 20 },
  amenityIcon: { backgroundColor: '#EBF4FF', borderRadius: 24, padding: 12, marginBottom: 8 },
  amenityText: { fontSize: 12, textAlign: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalContent: { padding: 20 },
  infoSection: { 
  marginTop: 20, 
  backgroundColor: '#F1F5F9', 
  padding: 16, 
  borderRadius: 12 
  },
   detailsContainer: {
    padding: 20,
  },
  infoTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    marginBottom: 8, 
    color: '#1E293B' 
  },
  infoText: { 
    fontSize: 14, 
    lineHeight: 20, 
    color: '#475569' 
  },
  modalContainer: { flex: 1, backgroundColor: "#FFFFFF" },
  modalHeader: {
    backgroundColor: "#1E40AF",
    paddingTop: 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalHeaderTitle: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  modalImage: { width: "100%", height: 200,backgroundColor: "#E5E7EB",},
  scrollContent: {
    paddingBottom: 20,
  },
  titleSection: { padding: 16 },
  stationName: { fontSize: 14, fontWeight: "600", color: "#64748B" },
  amenityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  amenityTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#22C55E", fontWeight: "600" },
  amenityDesc: {
    fontSize: 14,
    color: "#475569",
    marginTop: 6,
    lineHeight: 20,
  },
  detailsSection: {
    backgroundColor: "#F8FAFC",
    marginHorizontal: 16,
    padding: 20,
    justifyContent: "space-between",
    borderRadius: 12,
    marginTop: 12,
  },
  detailsTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: { fontSize: 14, color: "#334155", marginLeft: 18,fontWeight: "600" },
  starRow: { flexDirection: "row", marginLeft: 8, alignItems: "center" },
  star: {
    fontSize: 16,
    marginHorizontal: 1,
  },
  extraImage: {
    width: 120,
    height: 90,
    borderRadius: 10,
    marginRight: 10,
  },
  imageSection: {
  marginBottom: 20,
  },
  amenityImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  placeholderImage: {
    backgroundColor: '#E2E8F0', // light gray background
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#64748B',
    fontSize: 14,
    fontStyle: 'italic',
  },


});
