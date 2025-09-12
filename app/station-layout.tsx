import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, MapPin, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react-native';
import { Image } from 'react-native';

export default function StationLayout() {
  const [selectedStation, setSelectedStation] = useState('Thane Railway Station (TNA)');
  const [zoomLevel, setZoomLevel] = useState(1);

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
          <TouchableOpacity style={styles.dropdown}>
            <MapPin size={22} color="#1E40AF" />
            <Text style={styles.dropdownText}>{selectedStation}</Text>
            <ChevronDown size={22} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Station Layout Image */}
        <View style={styles.layoutContainer}>
          <Text style={styles.layoutTitle}>Thane Railway Station Layout</Text>
          
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/thane.png')}
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
            <Text style={styles.stationInfoTitle}>Thane Railway Station (TNA)</Text>
            <Text style={styles.stationInfoText}>
              Major railway junction on the Central Railway line serving Mumbai suburban and long-distance trains.
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
});
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
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 14,
    color: '#1E40AF',
    fontWeight: '600',
  },
});