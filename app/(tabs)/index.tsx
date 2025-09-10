import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { Brain as Train, MapPin, Clock, CircleCheck as CheckCircle, Wifi, Database } from 'lucide-react-native';

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
          <Train size={28} color="#FFFFFF" />
          <Text style={styles.headerTitle}>Railway Info Demo</Text>
        </View>
        <Text style={styles.headerSubtitle}>Indian Railways Information Services</Text>
        <Text style={styles.accessNote}>🟢 Access PNR status, station layouts, and train schedules</Text>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#BFDBFE',
    marginBottom: 6,
    fontWeight: '500',
  },
  accessNote: {
    fontSize: 13,
    color: '#DBEAFE',
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  serviceSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
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
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
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
    fontSize: 14,
    color: '#475569',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
});