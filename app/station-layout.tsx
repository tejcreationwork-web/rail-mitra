import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, MapPin, Zap, Coffee, Utensils, Car, Users, Info } from 'lucide-react-native';

export default function StationLayout() {
  const [selectedStation, setSelectedStation] = useState('Mumbai Chhatrapati Shivaji Terminus (CSTM)');
  const [selectedPlatform, setSelectedPlatform] = useState('Platform 1');

  const platforms = [
    {
      id: 'platform1',
      name: 'Platform 1',
      description: 'Heritage platform serving long-distance trains to Delhi, Bangalore and other major cities.',
      operating: '24/7',
      tips: [
        '• UNESCO World heritage building with Victorian architecture',
        '• Washrooms and Cafeterias (Vending)',
        '• Premium waiting lounges available',
        '• Direct access to local train networks'
      ]
    }
  ];

  const platformAmenities = [
    { icon: Coffee, label: 'Cafeteria', color: '#8B5CF6' },
    { icon: Car, label: 'Platform', color: '#2563EB' },
    { icon: Users, label: 'Waiting', color: '#2563EB' },
    { icon: Utensils, label: 'Food Court', color: '#F59E0B' },
    { icon: MapPin, label: 'Parking', color: '#8B5CF6' },
    { icon: Zap, label: 'Charging', color: '#059669' },
  ];

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
          <TouchableOpacity style={styles.infoLink}>
            <MapPin size={18} color="#1E40AF" />
            <Text style={styles.infoLinkText}>Mumbai Chhatrapati... Top markers on info</Text>
          </TouchableOpacity>
        </View>

        {/* Interactive Platform Layout */}
        <View style={styles.layoutContainer}>
          <View style={styles.platformGrid}>
            {platformAmenities.map((amenity, index) => {
              const IconComponent = amenity.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.amenityButton, { backgroundColor: amenity.color }]}
                  activeOpacity={0.8}
                >
                  <IconComponent size={28} color="#FFFFFF" />
                  <Text style={styles.amenityLabel}>{amenity.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Platform Detail Card */}
          <TouchableOpacity style={styles.platformCard}>
            <View style={styles.platformHeader}>
              <View style={styles.platformIcon}>
                <MapPin size={26} color="#FFFFFF" />
              </View>
              <View style={styles.platformInfo}>
                <Text style={styles.platformTitle}>Platform 1</Text>
                <Text style={styles.platformSubtitle}>PLATFORM</Text>
              </View>
              <Text style={styles.closeButton}>✕</Text>
            </View>

            <View style={styles.platformDetails}>
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>🔍 Description</Text>
                <Text style={styles.detailText}>
                  Heritage platform serving long-distance trains to Delhi, Bangalore and other major cities.
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>🚂 Platform</Text>
                <Text style={styles.detailText}>Platform 1</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>⏰ Operating Hours</Text>
                <Text style={styles.detailText}>24/7</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>💡 Navigation Tips</Text>
                {platforms[0].tips.map((tip, index) => (
                  <Text key={index} style={styles.tipText}>{tip}</Text>
                ))}
              </View>
            </View>
          </TouchableOpacity>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>🔍 Zoom In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>🔍 Zoom Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>🔄 Reset</Text>
            </TouchableOpacity>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  amenityButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amenityLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
    textAlign: 'center',
  },
  platformCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  platformHeader: {
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