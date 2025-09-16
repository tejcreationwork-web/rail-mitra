import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, Animated, Easing
} from 'react-native';
import { useState, useRef } from 'react';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, MapPin, Info, Check, Baby, Car, Utensils, Accessibility, Sofa, ShoppingBag, Users, ListRestart as Restroom, Wifi, Coffee, ShieldCheck, Headphones, Shirt, Gamepad2, Banknote, CarTaxiFront as Taxi, Music, Package, X, Phone, Clock, CheckCircle, Share, Navigation } from 'lucide-react-native';
import { Modal, Image, Linking } from 'react-native';

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
  id: string;
  name: string;
  code: string;
  description: string;
  latitude: number;
  longitude: number;
};

type Amenity = {
  id: string;
  name: string;
  icon: any;
  available: boolean;
  description?: string;
  detailedInfo?: {
    about: string;
    timings: string;
    facilities: string[];
    contact?: string;
    images: string[];
    location?: string;
  };
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

  const amenities: Amenity[] = [
    { 
      id: 'baby-food', 
      name: 'Baby Food', 
      icon: Baby, 
      available: true, 
      description: 'Baby care facilities',
      detailedInfo: {
        about: 'Dedicated baby care facility with feeding area, changing stations, and baby food options',
        timings: 'Open: 24 hours',
        facilities: ['Baby changing stations', 'Feeding area', 'Baby food available', 'Clean and hygienic'],
        contact: '139 (Railway Helpline)',
        images: ['https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg'],
        location: 'Platform 1, Near Main Entrance'
      }
    },
    { 
      id: 'parking', 
      name: 'Parking', 
      icon: Car, 
      available: true, 
      description: 'Vehicle parking',
      detailedInfo: {
        about: 'Multi-level parking facility with spaces for cars, bikes, and auto-rickshaws',
        timings: 'Open: 24 hours',
        facilities: ['Car parking (500+ spaces)', 'Two-wheeler parking', 'CCTV surveillance', 'Security guards'],
        contact: '022-XXXX-XXXX',
        images: ['https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg'],
        location: 'Main entrance, Ground floor'
      }
    },
    { 
      id: 'catering', 
      name: 'Food Court', 
      icon: Utensils, 
      available: true, 
      description: 'Dining options',
      detailedInfo: {
        about: 'Multi-cuisine food court with 12 restaurants and cafes offering variety of meals',
        timings: 'Open: 5:00 AM - 11:00 PM',
        facilities: ['AC seating for 200 people', 'Free WiFi available', 'Wheelchair accessible', 'Multiple cuisines'],
        contact: '022-XXXX-XXXX',
        images: ['https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg'],
        location: 'Platform 3, First floor'
      }
    },
    { 
      id: 'accessibility', 
      name: 'Accessibility', 
      icon: Accessibility, 
      available: true, 
      description: 'Disabled facilities',
      detailedInfo: {
        about: 'Complete accessibility features for differently-abled passengers',
        timings: 'Available: 24 hours',
        facilities: ['Wheelchair ramps', 'Accessible restrooms', 'Braille signage', 'Audio announcements'],
        contact: '139 (Railway Helpline)',
        images: ['https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg'],
        location: 'All platforms and facilities'
      }
    },
    { 
      id: 'waiting-room', 
      name: 'Waiting Room', 
      icon: Sofa, 
      available: true, 
      description: 'Comfortable seating',
      detailedInfo: {
        about: 'Air-conditioned waiting room with comfortable seating and charging points',
        timings: 'Open: 24 hours',
        facilities: ['AC seating for 150 people', 'Mobile charging points', 'Clean restrooms nearby', 'Security surveillance'],
        contact: '139 (Railway Helpline)',
        images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg'],
        location: 'Platform 2, Ground floor'
      }
    },
    { 
      id: 'shopping', 
      name: 'Shopping', 
      icon: ShoppingBag, 
      available: true, 
      description: 'Retail stores',
      detailedInfo: {
        about: 'Shopping complex with various retail stores, pharmacy, and convenience items',
        timings: 'Open: 6:00 AM - 10:00 PM',
        facilities: ['Pharmacy', 'Convenience store', 'Clothing shops', 'Electronics store'],
        contact: '022-XXXX-XXXX',
        images: ['https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg'],
        location: 'Main concourse, Ground floor'
      }
    },
    { 
      id: 'ladies-waiting', 
      name: 'Ladies Waiting Room', 
      icon: Users, 
      available: true, 
      description: 'Women-only area',
      detailedInfo: {
        about: 'Exclusive waiting area for women passengers with enhanced security and comfort',
        timings: 'Open: 24 hours',
        facilities: ['Women-only seating', 'Enhanced security', 'Clean restrooms', 'Baby care facilities'],
        contact: '139 (Railway Helpline)',
        images: ['https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg'],
        location: 'Platform 1, First floor'
      }
    },
    { 
      id: 'restroom', 
      name: 'Restrooms', 
      icon: Restroom, 
      available: true, 
      description: 'Clean facilities',
      detailedInfo: {
        about: 'Clean and well-maintained restroom facilities with regular cleaning',
        timings: 'Open: 24 hours',
        facilities: ['Separate male/female facilities', 'Disabled-accessible', 'Regular cleaning', 'Hand sanitizers'],
        contact: '139 (Railway Helpline)',
        images: ['https://images.pexels.com/photos/6585759/pexels-photo-6585759.jpeg'],
        location: 'All platforms'
      }
    },
    { 
      id: 'wifi', 
      name: 'Free WiFi', 
      icon: Wifi, 
      available: true, 
      description: 'Internet access',
      detailedInfo: {
        about: 'High-speed free WiFi available throughout the station premises',
        timings: 'Available: 24 hours',
        facilities: ['High-speed internet', 'Station-wide coverage', 'Easy login process', 'No time limit'],
        contact: '139 (Railway Helpline)',
        images: ['https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg'],
        location: 'Station-wide coverage'
      }
    },
    { 
      id: 'refreshment', 
      name: 'Refreshments', 
      icon: Coffee, 
      available: true, 
      description: 'Snacks & beverages',
      detailedInfo: {
        about: 'Quick refreshment counters with tea, coffee, snacks and beverages',
        timings: 'Open: 5:00 AM - 11:00 PM',
        facilities: ['Tea and coffee', 'Fresh snacks', 'Cold beverages', 'Quick service'],
        contact: '022-XXXX-XXXX',
        images: ['https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg'],
        location: 'Multiple locations on all platforms'
      }
    },
    { 
      id: 'security', 
      name: 'Security', 
      icon: ShieldCheck, 
      available: true, 
      description: '24/7 security',
      detailedInfo: {
        about: '24/7 security surveillance with RPF personnel and CCTV monitoring',
        timings: 'Available: 24 hours',
        facilities: ['CCTV surveillance', 'RPF personnel', 'Metal detectors', 'Emergency response'],
        contact: '1512 (RPF Helpline)',
        images: ['https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg'],
        location: 'Station-wide coverage'
      }
    },
    { 
      id: 'announcement', 
      name: 'PA System', 
      icon: Headphones, 
      available: true, 
      description: 'Audio announcements',
      detailedInfo: {
        about: 'Public address system for train announcements and important information',
        timings: 'Active: 24 hours',
        facilities: ['Multi-language announcements', 'Clear audio quality', 'Emergency broadcasts', 'Platform-specific info'],
        contact: '139 (Railway Helpline)',
        images: ['https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg'],
        location: 'All platforms and waiting areas'
      }
    },
    { 
      id: 'cloakroom', 
      name: 'Cloakroom', 
      icon: Package, 
      available: true, 
      description: 'Luggage storage',
      detailedInfo: {
        about: 'Secure luggage storage facility for passengers with proper documentation',
        timings: 'Open: 6:00 AM - 10:00 PM',
        facilities: ['Secure storage', 'ID verification required', 'Reasonable charges', 'Insurance coverage'],
        contact: '022-XXXX-XXXX',
        images: ['https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg'],
        location: 'Main entrance, Ground floor'
      }
    },
    { 
      id: 'atm', 
      name: 'ATM', 
      icon: Banknote, 
      available: true, 
      description: 'Cash withdrawal',
      detailedInfo: {
        about: 'Multiple ATM machines from various banks for cash withdrawal and banking services',
        timings: 'Available: 24 hours',
        facilities: ['Multiple bank ATMs', 'Cash withdrawal', 'Balance inquiry', 'Security surveillance'],
        contact: 'Bank customer care',
        images: ['https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg'],
        location: 'Main concourse and platforms'
      }
    },
    { 
      id: 'taxi', 
      name: 'Taxi Service', 
      icon: Taxi, 
      available: true, 
      description: 'Transportation',
      detailedInfo: {
        about: 'Taxi and auto-rickshaw services available outside the station',
        timings: 'Available: 24 hours',
        facilities: ['Pre-paid taxi counter', 'Auto-rickshaw stand', 'App-based cabs', 'Fixed rate cards'],
        contact: '022-XXXX-XXXX',
        images: ['https://images.pexels.com/photos/1059040/pexels-photo-1059040.jpeg'],
        location: 'Station exit, Ground level'
      }
    },
    { 
      id: 'bookstall', 
      name: 'Book Stall', 
      icon: Music, 
      available: false, 
      description: 'Books & magazines',
      detailedInfo: {
        about: 'Book stall with newspapers, magazines, and books (Currently unavailable)',
        timings: 'Currently closed',
        facilities: ['Newspapers', 'Magazines', 'Books', 'Stationery items'],
        contact: 'N/A',
        images: ['https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg'],
        location: 'Platform 2 (Currently closed)'
      }
    },
  ];

  const [selectedStationId, setSelectedStationId] = useState('thane');
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'layout' | 'amenities'>('layout');
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [amenityModalVisible, setAmenityModalVisible] = useState(false);

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

  const renderAmenityItem = (amenity: Amenity) => {
    const IconComponent = amenity.icon;
    return (
      <TouchableOpacity 
        key={amenity.id} 
        style={[styles.amenityItem, !amenity.available && styles.amenityItemDisabled]}
        onPress={() => {
          setSelectedAmenity(amenity);
          setAmenityModalVisible(true);
        }}
        activeOpacity={0.7}
      >
        <View style={[styles.amenityIcon, !amenity.available && styles.amenityIconDisabled]}>
          <IconComponent size={24} color={amenity.available ? "#2563EB" : "#94A3B8"} />
        </View>
        <Text style={[styles.amenityText, !amenity.available && styles.amenityTextDisabled]}>
          {amenity.name}
        </Text>
        {!amenity.available && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>N/A</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Station Selector */}
        <View style={styles.stationSelector}>
          <Text style={styles.sectionLabel}>Select Railway Station</Text>

          <TouchableOpacity 
            style={styles.dropdown}
            onPress={toggleDropdown}
          >
            <MapPin size={22} color="#1E40AF" />
            <Text style={styles.dropdownText}>
              {selectedStation.name} ({selectedStation.code})
            </Text>
            <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
              <ChevronDown size={22} color="#64748B" />
            </Animated.View>
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
                  {selectedStationId === station.id && <Check size={18} color="#1E40AF" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'layout' && styles.activeTab]}
            onPress={() => setActiveTab('layout')}
          >
            <MapPin size={20} color={activeTab === 'layout' ? "#FFFFFF" : "#64748B"} />
            <Text style={[styles.tabText, activeTab === 'layout' && styles.activeTabText]}>
              Station Layout
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

        {/* Content based on active tab */}
        {activeTab === 'layout' ? (
          /* Station Layout */
          <View style={styles.layoutContainer}>
            <Text style={styles.layoutTitle}>
              {selectedStation.name} Location
            </Text>

            <View style={styles.mapContainer}>
              {Platform.OS !== "web" ? (
                <MapView
                  style={styles.map}
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

            <View style={styles.stationInfo}>
              <Text style={styles.stationInfoTitle}>
                {selectedStation.name} ({selectedStation.code})
              </Text>
              <Text style={styles.stationInfoText}>
                {selectedStation.description}
              </Text>
              <View style={styles.coordinatesInfo}>
                <Text style={styles.coordinatesText}>
                  Coordinates: {selectedStation.latitude.toFixed(6)}, {selectedStation.longitude.toFixed(6)}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          /* Amenities Section */
          <View style={styles.amenitiesContainer}>
            <Text style={styles.amenitiesTitle}>
              Station Amenities & Services
            </Text>
            <Text style={styles.amenitiesSubtitle}>
              Available facilities at {selectedStation.name}
            </Text>
            
            <View style={styles.amenitiesGrid}>
              {amenities.map(renderAmenityItem)}
            </View>

            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.legendItems}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
                  <Text style={styles.legendText}>Available</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#94A3B8' }]} />
                  <Text style={styles.legendText}>Not Available</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Amenity Detail Modal */}
      <Modal
        visible={amenityModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAmenityModalVisible(false)}
      >
        {selectedAmenity && (
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <View style={[styles.modalIcon, { backgroundColor: selectedAmenity.available ? '#2563EB' : '#94A3B8' }]}>
                  <selectedAmenity.icon size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.modalTitle}>
                  {selectedAmenity.name} - {selectedStation.code}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => setAmenityModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Image */}
              {selectedAmenity.detailedInfo?.images && selectedAmenity.detailedInfo.images[0] && (
                <Image 
                  source={{ uri: selectedAmenity.detailedInfo.images[0] }}
                  style={styles.amenityImage}
                  resizeMode="cover"
                />
              )}

              {/* About Section */}
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.sectionContent}>
                  {selectedAmenity.detailedInfo?.about || selectedAmenity.description}
                </Text>
              </View>

              {/* Timings Section */}
              {selectedAmenity.detailedInfo?.timings && (
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Timings</Text>
                  <View style={styles.timingContainer}>
                    <Clock size={16} color="#2563EB" />
                    <Text style={styles.timingText}>{selectedAmenity.detailedInfo.timings}</Text>
                  </View>
                </View>
              )}

              {/* Facilities Section */}
              {selectedAmenity.detailedInfo?.facilities && (
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Facilities</Text>
                  {selectedAmenity.detailedInfo.facilities.map((facility, index) => (
                    <View key={index} style={styles.facilityItem}>
                      <CheckCircle size={16} color="#059669" />
                      <Text style={styles.facilityText}>{facility}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Contact Section */}
              {selectedAmenity.detailedInfo?.contact && (
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Contact</Text>
                  <TouchableOpacity 
                    style={styles.contactContainer}
                    onPress={() => {
                      if (selectedAmenity.detailedInfo?.contact) {
                        const phoneNumber = selectedAmenity.detailedInfo.contact.replace(/[^0-9]/g, '');
                        Linking.openURL(`tel:${phoneNumber}`);
                      }
                    }}
                  >
                    <Phone size={16} color="#2563EB" />
                    <Text style={styles.contactText}>{selectedAmenity.detailedInfo.contact}</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Location Section */}
              {selectedAmenity.detailedInfo?.location && (
                <View style={styles.infoSection}>
                  <Text style={styles.sectionTitle}>Location</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color="#DC2626" />
                    <Text style={styles.locationText}>{selectedAmenity.detailedInfo.location}</Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  style={styles.directionsButton}
                  onPress={() => {
                    // Open directions to station
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedStation.latitude},${selectedStation.longitude}`;
                    Linking.openURL(url);
                  }}
                >
                  <Navigation size={20} color="#FFFFFF" />
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.shareButton}
                  onPress={() => {
                    // Share amenity information
                    const shareText = `${selectedAmenity.name} at ${selectedStation.name}\n${selectedAmenity.detailedInfo?.about || selectedAmenity.description}`;
                    // In a real app, you would use React Native's Share API
                    console.log('Share:', shareText);
                  }}
                >
                  <Share size={20} color="#059669" />
                  <Text style={styles.shareButtonText}>Share Location</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
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
    marginBottom: 8,
  },
  amenitiesSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  amenityItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    position: 'relative',
  },
  amenityItemDisabled: {
    opacity: 0.6,
  },
  amenityIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EBF4FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  amenityIconDisabled: {
    backgroundColor: '#F1F5F9',
  },
  amenityText: {
    fontSize: 11,
    color: '#1E293B',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
  },
  amenityTextDisabled: {
    color: '#94A3B8',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  unavailableText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  legendContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amenityImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginVertical: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
    marginLeft: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 15,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 15,
    color: '#64748B',
    marginLeft: 8,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#FF8C42',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});