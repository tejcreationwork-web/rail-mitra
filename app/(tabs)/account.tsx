import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Switch, Linking } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { User, Settings, Info, Bell, CreditCard, CircleHelp as HelpCircle, ChevronRight, Star, Shield, Globe, Moon, Download, Phone, Mail, MessageCircle, MapPin, Clock, X, SquareCheck as CheckSquare } from 'lucide-react-native';

export default function AccountScreen() {
  const [user] = useState({
    name: 'Hi Traveller !',
  });

  // Modal states
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  // Settings states
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
  ];

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

  const emergencyNumbers = [
    { number: '100', label: 'Police', action: () => Linking.openURL('tel:100') },
    { number: '101', label: 'Fire', action: () => Linking.openURL('tel:101') },
    { number: '108', label: 'Ambulance', action: () => Linking.openURL('tel:108') },
  ];

  const accountOptions = [
    {
      id: 'bookings',
      title: 'My Bookings',
      subtitle: 'View all your train bookings',
      icon: CreditCard,
      onPress: () => {
        router.push('/(tabs)/booking');
      },
    },
    {
      id: 'settings',
      title: 'App Settings',
      subtitle: 'Customize your app experience',
      icon: Settings,
      onPress: () => {
        setSettingsModalVisible(true);
      },
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: `Current: ${selectedLanguage}`,
      icon: Globe,
      onPress: () => {
        setLanguageModalVisible(true);
      },
    },
    {
      id: 'contact',
      title: 'Connect with Us',
      subtitle: 'Share feedback or ask questions',
      icon: HelpCircle,
      onPress: () => {
        router.push("../connect");
      },
    },
    {
      id: 'about',
      title: 'About & Policies',
      subtitle: 'Learn more about our service',
      icon: Info,
      onPress: () => {
        router.push("../about");
      },
    }
  ];

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language.name);
    setLanguageModalVisible(false);
    Alert.alert('Language Changed', `Language changed to ${language.name}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Settings size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileContent}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarContainer}>
                <User size={32} color="#FFFFFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.memberSince}>Lovely Level Railways</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.verifiedBadge}>
              <CheckSquare size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
        </View>

        {/* Account Options */}
        {accountOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              onPress={option.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <IconComponent size={20} color="#2563EB" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          );
        })}

        {/* Quick Action Button */}
        <TouchableOpacity style={styles.quickActionButton}>
          <Text style={styles.quickActionText}>Quick action</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        visible={settingsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>App Settings</Text>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#2563EB" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingSubtitle}>Get updates about your bookings</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={notifications ? '#2563EB' : '#F8FAFC'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Moon size={20} color="#2563EB" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingSubtitle}>Switch to dark theme</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={darkMode ? '#2563EB' : '#F8FAFC'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Download size={20} color="#2563EB" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Offline Mode</Text>
                  <Text style={styles.settingSubtitle}>Download data for offline access</Text>
                </View>
              </View>
              <Switch
                value={offlineMode}
                onValueChange={setOfflineMode}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={offlineMode ? '#2563EB' : '#F8FAFC'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Settings size={20} color="#2563EB" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Auto Refresh</Text>
                  <Text style={styles.settingSubtitle}>Automatically refresh data</Text>
                </View>
              </View>
              <Switch
                value={autoRefresh}
                onValueChange={setAutoRefresh}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={autoRefresh ? '#2563EB' : '#F8FAFC'}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.name && styles.selectedLanguageItem
                ]}
                onPress={() => handleLanguageSelect(language)}
              >
                <Text style={[
                  styles.languageText,
                  selectedLanguage === language.name && styles.selectedLanguageText
                ]}>
                  {language.name}
                </Text>
                {selectedLanguage === language.name && (
                  <Star size={20} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Contact Modal */}
      <Modal
        visible={contactModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Contact & Support</Text>
            <TouchableOpacity onPress={() => setContactModalVisible(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
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
                  <View style={[styles.contactIcon, { backgroundColor: option.color }]}>
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

            <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Emergency Numbers</Text>
            <View style={styles.emergencyGrid}>
              {emergencyNumbers.map((emergency) => (
                <TouchableOpacity
                  key={emergency.number}
                  style={styles.emergencyButton}
                  onPress={emergency.action}
                >
                  <Text style={styles.emergencyNumber}>{emergency.number}</Text>
                  <Text style={styles.emergencyLabel}>{emergency.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal
        visible={privacyModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Privacy & Security</Text>
            <TouchableOpacity onPress={() => setPrivacyModalVisible(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.privacyItem}>
              <Shield size={20} color="#059669" />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>Data Protection</Text>
                <Text style={styles.privacyStatus}>Enabled</Text>
              </View>
            </View>

            <View style={styles.privacyItem}>
              <Shield size={20} color="#DC2626" />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>Two-factor Authentication</Text>
                <Text style={styles.privacyStatus}>Disabled</Text>
              </View>
            </View>

            <View style={styles.privacyItem}>
              <Globe size={20} color="#F59E0B" />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>Data Sharing</Text>
                <Text style={styles.privacyStatus}>Limited</Text>
              </View>
            </View>

            <View style={styles.privacyItem}>
              <MapPin size={20} color="#059669" />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>Location Services</Text>
                <Text style={styles.privacyStatus}>Enabled</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.manageButton}>
              <Text style={styles.manageButtonText}>Manage Privacy Settings</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-ExtraBold',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#F3F4F6',
    padding: 24,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 32,
    borderRadius: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#2563EB',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Poppins-ExtraBold',
  },
  memberSince: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  verifiedBadge: {
    padding: 8,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  optionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  quickActionButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLanguageItem: {
    backgroundColor: '#EBF4FF',
  },
  languageText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter-Regular',
  },
  selectedLanguageText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactIcon: {
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
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  emergencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  privacyText: {
    marginLeft: 12,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  privacyStatus: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  manageButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  manageButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});