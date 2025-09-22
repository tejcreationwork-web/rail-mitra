import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ContactScreen() {

  const onlineServices = [
    {
      title: 'IRCTC Website',
      subtitle: 'Book tickets and manage bookings',
      url: 'https://www.irctc.co.in',
    },
    {
      title: 'Indian Railways',
      subtitle: 'Official railway information',
      url: 'https://indianrailways.gov.in',
    },
    {
      title: 'UTS Mobile',
      subtitle: 'Unreserved ticketing system',
      url: 'https://utsonmobile.indianrail.gov.in',
    },
  ];

  const offices = [
    {
      name: 'Konkan Railway Headquarters',
      address: 'Belapur Bhavan, CBD Belapur, Navi Mumbai - 400614, Maharashtra',
      timings: 'Mon-Fri, 9:30 AM - 6:00 PM',
      phone: '+ 22-2757-2015',
    },
    {
      name: 'Central Railway Headquarters',
      address: 'Chhatrapati Shivaji Maharaj Terminus, DN Road, Mumbai - 400001, Maharashtra',
      timings: 'Mon-Fri, 9:30 AM - 6:00 PM',
      phone: '+ 022-2262-0746',
    },
  ];


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/home')} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Text style={styles.headerSubtitle}>Get help and support for your journey</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <>
        {/* Emergency & Helpline Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency & Helpline</Text>
          
          <View style={styles.emergencyGrid}>
            <TouchableOpacity
              style={[styles.emergencyCard, styles.railwayHelplineCard]}
              onPress={() => Linking.openURL('tel:139')}
              activeOpacity={0.8}
            >
              <Phone size={32} color="#FFFFFF" />
              <Text style={styles.emergencyTitle}>Rail Madad</Text>
              <Text style={styles.emergencyNumber}>139</Text>
              <Text style={styles.emergencyDescription}>
                Dial 139 for PNR, train status, arrivals, departures & seat availability.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.emergencyCard, styles.railMadadCard]}
              onPress={() => Linking.openURL('tel:180')}
              activeOpacity={0.8}
            >
              <Phone size={32} color="#FFFFFF" />
              <Text style={styles.emergencyTitle}>Emergency Helpline</Text>
              <Text style={styles.emergencyNumber}>180</Text>
              <Text style={styles.emergencyDescription}>
                Report an incident or seek emergency help during Travel.
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyGrid}>
            <TouchableOpacity
              style={[styles.emergencyCard, styles.medicalEmergencyCard]}
              onPress={() => Linking.openURL('tel:138')}
              activeOpacity={0.8}
            >
              <Phone size={32} color="#FFFFFF" />
              <Text style={styles.emergencyTitle}>For other Complaints</Text>
              <Text style={styles.emergencyNumber}>138</Text>
              <Text style={styles.emergencyDescription}>
                For all other complaints / services during your Travel.
              </Text>
            </TouchableOpacity> 

            <TouchableOpacity
              style={[styles.emergencyCard, styles.railwaySecurityCard]}
              onPress={() => Linking.openURL('tel:1512')}
              activeOpacity={0.8}
            >
              <Phone size={32} color="#FFFFFF" />
              <Text style={styles.emergencyTitle}>Railway Security</Text>
              <Text style={styles.emergencyNumber}>1800-111-322</Text>
              <Text style={styles.emergencyDescription}>
                Security (Toll Free Number)
              </Text>
            </TouchableOpacity>

            
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Online Services</Text>
          {onlineServices.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={styles.serviceCard}
              onPress={() => Linking.openURL(service.url)}
              activeOpacity={0.7}
            >
              <View style={styles.serviceIcon}>
                <Globe size={20} color="#2563EB" />
              </View>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
              </View>
              <Text style={styles.linkArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Railway Office Address</Text>
          {offices.map((office, index) => (
            <View key={index} style={styles.officeCard}>
              <View style={styles.officeHeader}>
                <MapPin size={20} color="#2563EB" />
                <Text style={styles.officeName}>{office.name}</Text>
              </View>
              <Text style={styles.officeAddress}>{office.address}</Text>
              <View style={styles.officeDetails}>
                <View style={styles.officeDetail}>
                  <Clock size={16} color="#64748B" />
                  <Text style={styles.officeDetailText}>{office.timings}</Text>
                </View>
                <TouchableOpacity
                  style={styles.officeDetail}
                  onPress={() => Linking.openURL(`tel:${office.phone}`)}
                >
                  <Phone size={16} color="#2563EB" />
                  <Text style={[styles.officeDetailText, styles.phoneText]}>{office.phone}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        </>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerSubtitle: { fontSize: 11, color: '#FFFF' },
  menuButton: {
    padding: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFF',
    fontFamily: 'Inter-SemiBold',
  },
  heartButton: {
    padding: 8,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-ExtraBold',
  },
  mainSubtitle: {
    fontSize: 18,
    color: '#2563EB',
    fontFamily: 'Inter-Medium',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    marginTop: 8,
    fontFamily: 'Poppins-Bold',
  },
  emergencyGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  emergencyCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  railwayHelplineCard: {
    backgroundColor: '#2563EB',
  },
  railMadadCard: {
    backgroundColor: '#2563EB',
  },
  railwaySecurityCard: {
    backgroundColor: '#2563EB',
  },
  medicalEmergencyCard: {
    backgroundColor: '#EF4444',
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  emergencyNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FDE047',
    marginBottom: 8,
    fontFamily: 'Poppins-ExtraBold',
  },
  emergencyDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
  },
  onlineServicesGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  onlineServiceCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  onlineServiceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  onlineServiceDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  onlineServiceButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  onlineServiceButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF4FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  serviceSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  linkArrow: {
    fontSize: 18,
    color: '#2563EB',
    fontWeight: 'bold',
  },
  officeCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  officeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  officeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 8,
    flex: 1,
    fontFamily: 'Poppins-SemiBold',
  },
  officeAddress: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  officeDetails: {
    gap: 8,
  },
  officeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  officeDetailText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  phoneText: {
    color: '#2563EB',
    fontWeight: '500',
  },
  emergencyBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 20,
  },
  emergencyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  emergencyLabel: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});