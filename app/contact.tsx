import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Phone, Mail, MapPin, Clock, Globe, MessageCircle, Menu, Heart } from 'lucide-react-native';

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Menu size={24} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UI Wireframe</Text>
        <TouchableOpacity style={styles.heartButton}>
          <Heart size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Main Title */}
      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Contact & Help</Text>
        <Text style={styles.mainSubtitle}>24/7 support for your journey</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              <Text style={styles.emergencyTitle}>Railway Helpline</Text>
              <Text style={styles.emergencyNumber}>139</Text>
              <Text style={styles.emergencyDescription}>
                Frisent escgortit, fonns br compliant registration.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.emergencyCard, styles.railMadadCard]}
              onPress={() => Linking.openURL('tel:139')}
              activeOpacity={0.8}
            >
              <MessageCircle size={32} color="#FFFFFF" />
              <Text style={styles.emergencyTitle}>Rail Madad Support</Text>
              <Text style={styles.emergencyDescription}>
                Feciures snin decrimnut complatiante registration.
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emergencyGrid}>
            <TouchableOpacity
              style={[styles.emergencyCard, styles.railwaySecurityCard]}
              onPress={() => Linking.openURL('tel:1512')}
              activeOpacity={0.8}
            >
              <Phone size={32} color="#FFFFFF" />
              <Text style={styles.emergencyTitle}>Railway Security</Text>
              <Text style={styles.emergencyNumber}>1800-111-322</Text>
              <Text style={styles.emergencyDescription}>
                Feciurs securipro itis the conpaistecurition the upcturt.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.emergencyCard, styles.medicalEmergencyCard]}
              onPress={() => Linking.openURL('tel:108')}
              activeOpacity={0.8}
            >
              <Phone size={32} color="#FFFFFF" />
              <Text style={styles.emergencyTitle}>Medical Emergency</Text>
              <Text style={styles.emergencyNumber}>1800-111-322</Text>
              <Text style={styles.emergencyDescription}>
                Using support for Iris the usirgs uragimattirm thir urgenty.
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Online Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Online Services</Text>
          
          <View style={styles.onlineServicesGrid}>
            <View style={styles.onlineServiceCard}>
              <Globe size={48} color="#2563EB" />
              <Text style={styles.onlineServiceTitle}>IRCTC Website</Text>
              <Text style={styles.onlineServiceDescription}>
                Descriptons ioud ticket booking
              </Text>
              <TouchableOpacity 
                style={styles.onlineServiceButton}
                onPress={() => Linking.openURL('https://www.irctc.co.in')}
              >
                <Text style={styles.onlineServiceButtonText}>Visit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.onlineServiceCard}>
              <MessageCircle size={48} color="#2563EB" />
              <Text style={styles.onlineServiceTitle}>RailEase Support</Text>
              <Text style={styles.onlineServiceDescription}>
                Distars, iapp supporto in App support
              </Text>
              <TouchableOpacity 
                style={styles.onlineServiceButton}
                onPress={() => {}}
              >
                <Text style={styles.onlineServiceButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
        </View>
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
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
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
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  emergencyNumber: {
    fontSize: 24,
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