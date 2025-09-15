import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, MapPin, Info, Check } from 'lucide-react-native';

type Station = {
  id: string;
  name: string;
  code: string;
  description: string;
  imageUrl: string;
};

export default function StationLayout() {
  const stations: Station[] = [
    {
      id: 'thane',
      name: 'Thane Railway Station',
      code: 'TNA',
      description: 'Major railway junction on the Central Railway line serving Mumbai suburban and long-distance trains.',
      imageUrl: 'https://images.pexels.com/photos/1007025/pexels-photo-1007025.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'dadar',
      name: 'Dadar Railway Station',
      code: 'DR',
      description: 'One of the busiest railway stations in Mumbai, serving both Central and Western Railway lines.',
      imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  const [selectedStationId, setSelectedStationId] = useState('thane');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedStation = stations.find(station => station.id === selectedStationId) || stations[0];

  const handleStationSelect = (stationId: string) => {
    setSelectedStationId(stationId);
    setShowDropdown(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.push('/')} style={styles.backButton}>
          <ArrowLeft size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Station Layout</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Info size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stationSelector}>
          <Text style={styles.sectionLabel}>Select Railway Station</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <MapPin size={22} color="#1E40AF" />
            <Text style={styles.dropdownText}>
              {selectedStation.name} ({selectedStation.code})
            </Text>
            <ChevronDown 
              size={22} 
              color="#64748B" 
              style={[styles.chevron, showDropdown && styles.chevronRotated]}
            />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdownMenu}>
              {stations.map((station) => (
                <TouchableOpacity
                  key={station.id}
                  style={[
                    styles.dropdownItem,
                    selectedStationId === station.id && styles.dropdownItemSelected
                  ]}
                  onPress={() => handleStationSelect(station.id)}
                >
                  <MapPin size={18} color={selectedStationId === station.id ? "#1E40AF" : "#64748B"} />
                  <Text style={[
                    styles.dropdownItemText,
                    selectedStationId === station.id && styles.dropdownItemTextSelected
                  ]}>
                    {station.name} ({station.code})
                  </Text>
                  {selectedStationId === station.id && (
                    <Check size={18} color="#1E40AF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Station Image */}
        <View style={styles.layoutContainer}>
          <Text style={styles.layoutTitle}>{selectedStation.name} Layout</Text>
          
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: selectedStation.imageUrl }}
              style={styles.stationImage}
              resizeMode="cover"
            />
          </View>
          
          <View style={styles.stationInfo}>
            <Text style={styles.stationInfoTitle}>
              {selectedStation.name} ({selectedStation.code})
            </Text>
            <Text style={styles.stationInfoText}>
              {selectedStation.description}
            </Text>
          </View>
        </View>

        {/* Station Amenities */}
        <View style={styles.amenitiesContainer}>
          <Text style={styles.amenitiesTitle}>Station Amenities</Text>
          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>🚻</Text>
              <Text style={styles.amenityText}>Restrooms</Text>
            </View>
            <View style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>🍽️</Text>
              <Text style={styles.amenityText}>Food Court</Text>
            </View>
            <View style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>🏧</Text>
              <Text style={styles.amenityText}>ATM</Text>
            </View>
            <View style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>🚗</Text>
              <Text style={styles.amenityText}>Parking</Text>
            </View>
            <View style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>📶</Text>
              <Text style={styles.amenityText}>WiFi</Text>
            </View>
            <View style={styles.amenityItem}>
              <Text style={styles.amenityIcon}>🛍️</Text>
              <Text style={styles.amenityText}>Shopping</Text>
            </View>
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
    transition: 'transform 0.2s',
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
  imageContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    height: 300,
  },
  stationImage: {
    width: '100%',
    height: '100%',
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