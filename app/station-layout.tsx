import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, MapPin, Info, ZoomIn, ZoomOut, RotateCcw, Check } from 'lucide-react-native';
import { Image } from 'react-native';

type Station = {
  id: string;
  name: string;
  code: string;
  description: string;
  image: any;
};

export default function StationLayout() {
  const stations: Station[] = [
    {
      id: 'thane',
      name: 'Thane Railway Station',
      code: 'TNA',
      description: 'Major railway junction on the Central Railway line serving Mumbai suburban and long-distance trains.',
      image: require('@/assets/images/thane.png'),
    },
    {
      id: 'dadar',
      name: 'Dadar Railway Station',
      code: 'DR',
      description: 'One of the busiest railway stations in Mumbai, serving both Central and Western Railway lines.',
      image: require('@/assets/images/Dadar Station Layout.png'),
    },
  ];

  const [selectedStationId, setSelectedStationId] = useState('thane');
  const [showDropdown, setShowDropdown] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedStation = stations.find(station => station.id === selectedStationId) || stations[0];

  const handleStationSelect = (stationId: string) => {
    setSelectedStationId(stationId);
    setShowDropdown(false);
    setZoomLevel(1); // Reset zoom when changing stations
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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

        {/* Station Layout Image */}
        <View style={styles.layoutContainer}>
          <Text style={styles.layoutTitle}>{selectedStation.name} Layout</Text>
          
          <View style={styles.imageContainer}>
            <Image
              source={selectedStation.image}
              style={[styles.stationImage, { transform: [{ scale: zoomLevel }] }]}
              resizeMode="contain"
            />
          </View>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setZoomLevel(prev => Math.min(prev + 0.2, 2))}
            >
              <ZoomIn size={16} color="#1E40AF" />
              <Text style={styles.controlButtonText}>Zoom In</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
            >
              <ZoomOut size={16} color="#1E40AF" />
              <Text style={styles.controlButtonText}>Zoom Out</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => setZoomLevel(1)}
            >
              <RotateCcw size={16} color="#1E40AF" />
              <Text style={styles.controlButtonText}>Reset</Text>
            </TouchableOpacity>
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
  infoLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLinkText: {
    marginLeft: 12,
    fontSize: 15,
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
    padding: 16,
    marginBottom: 20,
    overflow: 'hidden',
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationImage: {
    width: '100%',
    height: 300,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
    marginLeft: 6,
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
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  platformIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1E40AF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  platformInfo: {
    flex: 1,
  },
  platformTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  platformSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  closeButton: {
    fontSize: 20,
    color: '#64748B',
  },
  platformDetails: {
    gap: 20,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    fontWeight: '500',
  },
  tipText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginTop: 4,
    fontWeight: '500',
  },
});