import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Train, MapPin, Clock, CheckCircle, Wifi, Database } from 'lucide-react-native';

export default function HomeScreen() {
  const services = [
    {
      id: 'pnr',
      title: 'PNR Checker',
      subtitle: 'Check your train status and passenger details instantly',
      icon: CheckCircle,
      route: '/pnr-checker',
      color: '#2563EB',
    },
    {
      id: 'station',
      title: 'Station Layout Info',
      subtitle: 'Explore railway stations with interactive maps',
      icon: MapPin,
      route: '/station-layout',
      color: '#059669',
    },
    {
      id: 'timetable',
      title: 'Train Timetable Sheet',
      subtitle: 'View detailed train schedules and route information',
      icon: Clock,
      route: '/train-timetable',
      color: '#DC2626',
    },
  ];

  const handleServicePress = (route: string) => {
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Train size={32} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.headerTitle}>RailEase</Text>
        </View>
        <Text style={styles.headerSubtitle}>Your Smart Railway Companion</Text>
        <Text style={styles.accessNote}>🚀 Access PNR status, station layouts, and train schedules with ease</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.servicesContainer}>
          <Text style={styles.sectionTitle}>Railway Services</Text>
          
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServicePress(service.route)}
                activeOpacity={0.7}
              >
                <View style={styles.serviceContent}>
                  <View style={[styles.iconContainer, { backgroundColor: service.color }]}>
                    <IconComponent size={28} color="#FFFFFF" />
                  </View>
                  <View style={styles.serviceText}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>System Status: Online</Text>
          <Text style={styles.statusText}>Last updated: 11/12/2023 1:39</Text>
          
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Database size={24} color="#059669" />
              <Text style={styles.statusLabel}>Offline Data Available</Text>
            </View>
            <View style={styles.statusItem}>
              <Wifi size={24} color="#2563EB" />
              <Text style={styles.statusLabel}>App Version v1.3.0</Text>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    marginBottom: 6,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
  },
  accessNote: {
    fontSize: 14,
    color: '#DBEAFE',
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  servicesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  serviceText: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
    fontFamily: 'Poppins-Bold',
  },
  serviceSubtitle: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 22,
    fontFamily: 'Inter-Medium',
  },
  arrow: {
    fontSize: 24,
    color: '#CBD5E1',
    fontWeight: '300',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  statusText: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 20,
    fontFamily: 'Inter-Medium',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusLabel: {
    fontSize: 15,
    color: '#475569',
    marginLeft: 12,
    flex: 1,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});