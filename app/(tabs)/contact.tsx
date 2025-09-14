import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle } from 'lucide-react-native';

export default function ContactScreen() {
  const contactOptions = [
    {
      id: 'helpline',
      title: 'Railway Helpline',
      subtitle: '139 - General Enquiry & Reservation',
      icon: Phone,
      action: () => Linking.openURL('tel:139'),
      color: '#059669',
    },
    {
      id: 'complaint',
      title: 'Rail Madad',
      subtitle: 'Customer Care & Complaints',
      icon: MessageCircle,
      action: () => Linking.openURL('tel:139'),
      color: '#DC2626',
    },
    {
      id: 'security',
      title: 'Railway Security',
      subtitle: '1512 - RPF/GRP Helpline',
      icon: Phone,
      action: () => Linking.openURL('tel:1512'),
      color: '#2563EB',
    },
    {
      id: 'medical',
      title: 'Medical Emergency',
      subtitle: '108 - Emergency Medical Services',
      icon: Phone,
      action: () => Linking.openURL('tel:108'),
      color: '#DC2626',
    },
  ];

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
      url: 'https://www.uts.indianrail.gov.in',
    },
  ];

  const offices = [
    {
      name: 'Mumbai Central Railway Station',
      address: 'Dr. DN Road, Mumbai Central, Mumbai - 400008',
      timings: 'Open 24 hours',
      phone: '+91-22-2620-5555',
    },
    {
      name: 'New Delhi Railway Station',
      address: 'Bhavbhuti Marg, New Delhi - 110001',
      timings: 'Open 24 hours',
      phone: '+91-11-2334-5555',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <Text style={styles.headerSubtitle}>Get help and support for your journey</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency & Helpline</Text>
          {contactOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: option.color }]}>
                  <IconComponent size={24} color="#FFFFFF" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <Phone size={20} color="#64748B" />
              </TouchableOpacity>
            );
          })}
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
          <Text style={styles.sectionTitle}>Railway Offices</Text>
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

        <View style={styles.section}>
          <View style={styles.emergencyBox}>
            <Text style={styles.emergencyTitle}>🚨 Emergency Numbers</Text>
            <View style={styles.emergencyGrid}>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => Linking.openURL('tel:100')}
              >
                <Text style={styles.emergencyNumber}>100</Text>
                <Text style={styles.emergencyLabel}>Police</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => Linking.openURL('tel:101')}
              >
                <Text style={styles.emergencyNumber}>101</Text>
                <Text style={styles.emergencyLabel}>Fire</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emergencyButton}
                onPress={() => Linking.openURL('tel:108')}
              >
                <Text style={styles.emergencyNumber}>108</Text>
                <Text style={styles.emergencyLabel}>Ambulance</Text>
              </TouchableOpacity>
            </View>
          </View>
      <Text style={styles.headerTitle}>Help Desk</Text>
      <Text style={styles.headerSubtitle}>Get help and support for your railway journey</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
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
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  emergencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  emergencyNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  emergencyLabel: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});