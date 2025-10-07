import {
  View, Text, StyleSheet, ScrollView, ImageBackground,
  TouchableOpacity, StatusBar, Platform, Modal, Image
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import SearchableDropdown from '@/components/SearchableDropdown';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Info, Utensils, CheckCircle, Clock } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

type Station = {
  stn_code: string;
  stn_name: string;
  lat: number;
  lon: number;
  description?: string;
  photo_url?: string;
};

type Amenity = {
  id: number;
  stn_code: string;
  ame_name: string;
  ame_desc: string;
  photo_url?: string;
  availability: string;
  location: string;
  hours: string;
  rating: number;
  ame_short_name: string;
  ame_type: string;
  icon_name: string;
};

const getAmenityIcon = (iconName: string, size: number = 24, color: string = "#2563EB") => {
  if (!iconName) return <FontAwesome5 name="question-circle" size={size} color={color} />;

  const cleanName = iconName.replace(/^fa-/, "");
  const nameMap: Record<string, string> = {
    ticket: "ticket-alt",
    water: "tint",
    info: "info-circle",
    location: "map-marker-alt",
  };

  const finalName = nameMap[cleanName] || cleanName;
  const fa5Icons = ["utensils", "ticket-alt", "shield-alt", "restroom", "tint", "clock", "info-circle", "phone", "map-marker-alt", "concierge-bell"];
  const mciIcons = ["elevator", "ticket-confirmation", "credit-card", "parking", "baby-carriage", "locker", "wheelchair-accessibility"];

  if (fa5Icons.includes(finalName)) {
    return <FontAwesome5 name={finalName as any} size={size} color={color} solid />;
  }
  if (mciIcons.includes(finalName)) {
    return <MaterialCommunityIcons name={finalName as any} size={size} color={color} />;
  }
  return <FontAwesome5 name="question-circle" size={size} color={color} />;
};

export default function StationLayout() {
  const [stations, setStations] = useState<Station[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'layout' | 'amenities'>('layout');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [amenityModalVisible, setAmenityModalVisible] = useState(false);

  useEffect(() => {
    const fetchStations = async () => {
      const { data, error } = await supabase.from("stations").select("*");
      if (error) console.error("Error fetching stations:", error);
      else {
        setStations(data || []);
        if (data && data.length > 0) setSelectedStationId(data[0].stn_code);
      }
    };
    fetchStations();
  }, []);

  useEffect(() => {
    const fetchAmenities = async () => {
      if (!selectedStationId) return;
      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .eq("stn_code", selectedStationId);
      if (error) console.error("Error fetching amenities:", error);
      else setAmenities(data || []);
    };
    fetchAmenities();
  }, [selectedStationId]);

  const selectedStation = stations.find(st => st.stn_code === selectedStationId) || null;
  const stationOptions = stations.map(station => ({
    id: station.stn_code,
    label: `${station.stn_name} (${station.stn_code})`,
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
      <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "bold", textAlign: "center" }}>
        {amenity.ame_short_name}
      </Text>
    </TouchableOpacity>
  );

  const renderQuickInfo = () => (
    <View style={styles.quickInfoSection}>
      <Text style={styles.quickInfoTitle}>Quick Information</Text>
      <View style={styles.quickInfoGrid}>
        {/* Platforms Card */}
        <View style={styles.quickInfoCard}>
          <FontAwesome5 name="train" size={32} color="#2563EB" />
          {/* Note: In a real app, replace '16' with data from selectedStation */}
          <Text style={styles.quickInfoValue}>16</Text>
          <Text style={styles.quickInfoLabel}>Platforms</Text>
        </View>

        {/* Services Card */}
        <View style={[styles.quickInfoCard, styles.quickInfoCardGreen]}>
          <FontAwesome5 name="clock" size={32} color="#15803D" />
          <Text style={[styles.quickInfoValue, styles.quickInfoValueGreen]}>24/7</Text>
          <Text style={styles.quickInfoLabel}>Services</Text>
        </View>
      </View>
    </View>
  );

  // NEW FUNCTION: Renders the Available Facilities Section
  const renderAvailableFacilities = () => {
    // In a real app, this array would be dynamically generated based on station data/amenities.
    const facilities = [
      "Waiting Rooms", "Drinking Water",
      "ATM Services", "Medical Facility",
      "Lost & Found", "Luggage Storage",
      "Tourist Information", "Police Station"
    ];

    const column1 = facilities.filter((_, index) => index % 2 === 0);
    const column2 = facilities.filter((_, index) => index % 2 !== 0);

    const renderFacilityItem = (item: string) => (
      <View key={item} style={styles.facilityItem}>
        <View style={styles.facilityBullet} />
        <Text style={styles.facilityText}>{item}</Text>
      </View>
    );

    return (
      <View style={styles.facilitiesSection}>
        <Text style={styles.facilitiesTitle}>Available Facilities</Text>
        <View style={styles.facilitiesGrid}>
          <View style={styles.facilitiesColumn}>
            {column1.map(renderFacilityItem)}
          </View>
          <View style={styles.facilitiesColumn}>
            {column2.map(renderFacilityItem)}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.push('/'))}
          style={styles.backButton}
        >
          <ArrowLeft size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Station Info</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Banner */}
      <ImageBackground
        source={require("@/assets/images/station_layout_bg.jpg")}
        style={styles.banner}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.stationSelector}>
            <SearchableDropdown
              options={stationOptions}
              selectedValue={selectedStationId}
              onSelect={handleStationSelect}
              placeholder="Search station"
            />
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'layout' && styles.activeTab]}
              onPress={() => setActiveTab('layout')}
            >
              <MapPin size={20} color={activeTab === 'layout' ? "#FFF" : "#64748B"} />
              <Text style={[styles.tabText, activeTab === 'layout' && styles.activeTabText]}>
                Station Info
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'amenities' && styles.activeTab]}
              onPress={() => setActiveTab('amenities')}
            >
              <Utensils size={20} color={activeTab === 'amenities' ? "#FFF" : "#64748B"} />
              <Text style={[styles.tabText, activeTab === 'amenities' && styles.activeTabText]}>
                Amenities
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Scrollable Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'layout' && selectedStation ? (
          <View style={styles.layoutContainer}>
            <Text style={styles.layoutTitle}>{selectedStation.stn_name}</Text>

            {renderQuickInfo()}

            {selectedStation.photo_url ? (
              <Image
                source={{ uri: selectedStation.photo_url }}
                style={styles.stationImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.stationImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>No Image Available</Text>
              </View>
            )}
            
            {/* NEW SECTION: AVAILABLE FACILITIES */}
            {renderAvailableFacilities()}
            
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>About this Station</Text>
              <Text style={styles.infoText}>
                {selectedStation.description || "No station description available."}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.amenitiesTitle}>Station Amenities</Text>
            <View style={styles.amenitiesGrid}>{amenities.map(renderAmenityItem)}</View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#1E40AF', paddingTop: 45, paddingHorizontal: 16,
    paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  backButton: { padding: 12, marginLeft: -12 },
  infoButton: { padding: 12, marginRight: -12 },
  banner: { width: "100%" },
  overlay: { paddingHorizontal: 16, paddingVertical: 20 },
  stationSelector: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16, padding: 24, marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12, padding: 4, marginBottom: 20,
  },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12 },
  activeTab: { backgroundColor: '#2563EB', borderRadius: 8 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748B', marginLeft: 8 },
  activeTabText: { color: '#FFFFFF' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  layoutContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, marginBottom: 24 },
  layoutTitle: { fontSize: 22, fontWeight: '700', color: '#1E293B', textAlign: 'center', marginBottom: 16 },
  stationImage: { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  placeholderImage: { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#64748B', fontStyle: 'italic' },
  infoSection: { backgroundColor: '#F1F5F9', padding: 16, borderRadius: 12, marginTop: 16 }, // Added marginTop for spacing
  infoTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#1E293B' },
  infoText: { fontSize: 14, color: '#475569', lineHeight: 20 },
  amenitiesContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, marginBottom: 24 },
  amenitiesTitle: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  amenityItem: { width: '30%', alignItems: 'center', marginBottom: 20 },
  amenityIcon: { backgroundColor: '#EBF4FF', borderRadius: 24, padding: 12, marginBottom: 8 },

  // STYLES FOR QUICK INFO SECTION
  quickInfoSection: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  quickInfoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickInfoCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F7FAFF',
    borderWidth: 1,
    borderColor: '#EBF4FF',
  },
  quickInfoCardGreen: {
    backgroundColor: '#F0FFF4',
    borderColor: '#D1FAE5',
  },
  quickInfoValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  quickInfoValueGreen: {
    color: '#15803D',
  },
  quickInfoLabel: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },

  // NEW STYLES FOR AVAILABLE FACILITIES SECTION
  facilitiesSection: {
    backgroundColor: '#FFFFFF', // Ensures clean background if padding is applied outside
    paddingVertical: 16, // Padding top/bottom for spacing
  },
  facilitiesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  facilitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  facilitiesColumn: {
    width: '48%', // Allows two columns with a small gap
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  facilityBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16A34A', // Green dot
    marginRight: 8,
  },
  facilityText: {
    fontSize: 14,
    color: '#475569',
  }
});