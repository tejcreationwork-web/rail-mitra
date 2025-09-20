import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Switch, Linking } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
<<<<<<< HEAD
import { User, Settings, Bell, CreditCard, CircleHelp as HelpCircle, ChevronRight, Star, Shield, Globe, Moon, Download, Phone, Mail, MessageCircle, ExternalLink, FileText, Video, ArrowLeft } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';
=======
import { User, Settings, Info, Bell, CreditCard, CircleHelp as HelpCircle, ChevronRight, Star, Shield, Globe, Moon, Download, Phone, Mail, MessageCircle, MapPin, Clock, X, SquareCheck as CheckSquare } from 'lucide-react-native';
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d

export default function AccountScreen() {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const [user] = useState({
<<<<<<< HEAD
    name: t('hiTraveller', currentLanguage),
    memberSince: 'January 2023',
    totalBookings: 24,
    points: 1250,
  });

  const getCurrentLanguageDisplay = () => {
    switch (currentLanguage) {
      case 'hi': return 'हिंदी (Hindi)';
      case 'mr': return 'मराठी (Marathi)';
      default: return 'English';
    }
  };

  const handleLanguageChange = () => {
    Alert.alert(
      t('language', currentLanguage),
      'Select Language / भाषा चुनें / भाषा निवडा:',
      [
        { 
          text: 'English', 
          onPress: async () => {
            await changeLanguage('en');
            Alert.alert('Language Changed', 'App language changed to English');
          }
        },
        { 
          text: 'हिंदी', 
          onPress: async () => {
            await changeLanguage('hi');
            Alert.alert('भाषा बदली गई', 'ऐप की भाषा हिंदी में बदल दी गई');
          }
        },
        { 
          text: 'मराठी', 
          onPress: async () => {
            await changeLanguage('mr');
            Alert.alert('भाषा बदलली', 'अॅपची भाषा मराठीत बदलली');
          }
        },
        { text: t('cancel', currentLanguage), style: 'cancel' }
      ]
    );
  };

  const handleHelpSupport = () => {
    const helpOptions = [
      {
        title: currentLanguage === 'hi' ? '📞 हेल्पलाइन कॉल करें' : currentLanguage === 'mr' ? '📞 हेल्पलाइन कॉल करा' : '📞 Call Helpline',
        subtitle: '139 - Railway Enquiry',
        action: 'call:139'
      },
      {
        title: currentLanguage === 'hi' ? '🚨 आपातकालीन सहायता' : currentLanguage === 'mr' ? '🚨 आपत्कालीन मदत' : '🚨 Emergency Help',
        subtitle: '1512 - Railway Security',
        action: 'call:1512'
      },
      {
        title: currentLanguage === 'hi' ? '💬 लाइव चैट' : currentLanguage === 'mr' ? '💬 लाइव्ह चॅट' : '💬 Live Chat',
        subtitle: currentLanguage === 'hi' ? '24/7 उपलब्ध' : currentLanguage === 'mr' ? '24/7 उपलब्ध' : 'Available 24/7',
        action: 'chat'
      },
      {
        title: currentLanguage === 'hi' ? '📧 ईमेल सपोर्ट' : currentLanguage === 'mr' ? '📧 ईमेल सपोर्ट' : '📧 Email Support',
        subtitle: 'support@railease.com',
        action: 'email'
      },
      {
        title: currentLanguage === 'hi' ? '📋 FAQ देखें' : currentLanguage === 'mr' ? '📋 FAQ पहा' : '📋 View FAQ',
        subtitle: currentLanguage === 'hi' ? 'सामान्य प्रश्न' : currentLanguage === 'mr' ? 'सामान्य प्रश्न' : 'Common Questions',
        action: 'faq'
      },
      {
        title: currentLanguage === 'hi' ? '🎥 वीडियो गाइड' : currentLanguage === 'mr' ? '🎥 व्हिडिओ गाइड' : '🎥 Video Guides',
        subtitle: currentLanguage === 'hi' ? 'ऐप का उपयोग सीखें' : currentLanguage === 'mr' ? 'अॅप वापरायला शिका' : 'Learn to use the app',
        action: 'videos'
      },
      {
        title: currentLanguage === 'hi' ? '📝 फीडबैक भेजें' : currentLanguage === 'mr' ? '📝 फीडबॅक पाठवा' : '📝 Send Feedback',
        subtitle: currentLanguage === 'hi' ? 'हमें बेहतर बनाने में मदद करें' : currentLanguage === 'mr' ? 'आम्हाला चांगले बनवण्यात मदत करा' : 'Help us improve',
        action: 'feedback'
      }
    ];

    Alert.alert(
      t('helpSupport', currentLanguage),
      currentLanguage === 'hi' ? 'सहायता का प्रकार चुनें:' : currentLanguage === 'mr' ? 'मदतीचा प्रकार निवडा:' : 'Choose type of help:',
      [
        ...helpOptions.map(option => ({
          text: option.title,
          onPress: () => handleHelpAction(option.action, option.subtitle)
        })),
        { text: t('cancel', currentLanguage), style: 'cancel' }
      ]
    );
  };

  const handleHelpAction = (action: string, subtitle: string) => {
    switch (action) {
      case 'call:139':
        Alert.alert(
          currentLanguage === 'hi' ? 'हेल्पलाइन कॉल' : currentLanguage === 'mr' ? 'हेल्पलाइन कॉल' : 'Helpline Call',
          currentLanguage === 'hi' ? 'क्या आप 139 पर कॉल करना चाहते हैं?' : currentLanguage === 'mr' ? 'तुम्हाला 139 वर कॉल करायचा आहे का?' : 'Do you want to call 139?',
          [
            { text: currentLanguage === 'hi' ? 'कॉल करें' : currentLanguage === 'mr' ? 'कॉल करा' : 'Call Now', onPress: () => Alert.alert('Calling...', 'Dialing 139...') },
            { text: t('cancel', currentLanguage), style: 'cancel' }
          ]
        );
        break;
      case 'call:1512':
        Alert.alert(
          currentLanguage === 'hi' ? 'आपातकालीन कॉल' : currentLanguage === 'mr' ? 'आपत्कालीन कॉल' : 'Emergency Call',
          currentLanguage === 'hi' ? 'क्या आप 1512 पर कॉल करना चाहते हैं?' : currentLanguage === 'mr' ? 'तुम्हाला 1512 वर कॉल करायचा आहे का?' : 'Do you want to call 1512?',
          [
            { text: currentLanguage === 'hi' ? 'कॉल करें' : currentLanguage === 'mr' ? 'कॉल करा' : 'Call Now', onPress: () => Alert.alert('Calling...', 'Dialing 1512...') },
            { text: t('cancel', currentLanguage), style: 'cancel' }
          ]
        );
        break;
      case 'chat':
        Alert.alert(
          currentLanguage === 'hi' ? 'लाइव चैट' : currentLanguage === 'mr' ? 'लाइव्ह चॅट' : 'Live Chat',
          currentLanguage === 'hi' ? 'चैट सपोर्ट जल्द ही उपलब्ध होगा। अभी के लिए कृपया 139 पर कॉल करें।' : currentLanguage === 'mr' ? 'चॅट सपोर्ट लवकरच उपलब्ध होईल. सध्या कृपया 139 वर कॉल करा.' : 'Chat support coming soon. Please call 139 for immediate assistance.',
          [{ text: t('ok', currentLanguage) }]
        );
        break;
      case 'email':
        Alert.alert(
          currentLanguage === 'hi' ? 'ईमेल सपोर्ट' : currentLanguage === 'mr' ? 'ईमेल सपोर्ट' : 'Email Support',
          currentLanguage === 'hi' ? 'हमें support@railease.com पर लिखें। हम 24 घंटे में जवाब देंगे।' : currentLanguage === 'mr' ? 'आम्हाला support@railease.com वर लिहा. आम्ही 24 तासांत उत्तर देऊ.' : 'Write to us at support@railease.com. We\'ll respond within 24 hours.',
          [
            { text: currentLanguage === 'hi' ? 'ईमेल खोलें' : currentLanguage === 'mr' ? 'ईमेल उघडा' : 'Open Email', onPress: () => Alert.alert('Opening...', 'Opening email app...') },
            { text: t('ok', currentLanguage) }
          ]
        );
        break;
      case 'faq':
        showFAQ();
        break;
      case 'videos':
        Alert.alert(
          currentLanguage === 'hi' ? 'वीडियो गाइड' : currentLanguage === 'mr' ? 'व्हिडिओ गाइड' : 'Video Guides',
          currentLanguage === 'hi' ? 'वीडियो ट्यूटोरियल जल्द ही उपलब्ध होंगे।' : currentLanguage === 'mr' ? 'व्हिडिओ ट्यूटोरियल लवकरच उपलब्ध होतील.' : 'Video tutorials coming soon.',
          [{ text: t('ok', currentLanguage) }]
        );
        break;
      case 'feedback':
        showFeedbackForm();
        break;
    }
  };

  const showFAQ = () => {
    const faqData = currentLanguage === 'hi' ? [
      'Q: PNR स्थिति कैसे चेक करें?\nA: होम स्क्रीन पर "PNR Status" पर टैप करें और अपना 10-अंकीय PNR नंबर डालें।',
      'Q: बुकिंग कैसे सेव करें?\nA: PNR चेक करने के बाद "Save to My Bookings" बटन दबाएं।',
      'Q: ट्रेन का समय कैसे देखें?\nA: "Train Timetable" सेक्शन में जाकर ट्रेन नंबर डालें।',
      'Q: ऐप की भाषा कैसे बदलें?\nA: Account > Language में जाकर अपनी पसंदीदा भाषा चुनें।'
    ] : currentLanguage === 'mr' ? [
      'Q: PNR स्थिती कशी तपासावी?\nA: होम स्क्रीनवर "PNR Status" वर टॅप करा आणि तुमचा 10-अंकी PNR क्रमांक टाका.',
      'Q: बुकिंग कशी सेव्ह करावी?\nA: PNR तपासल्यानंतर "Save to My Bookings" बटण दाबा.',
      'Q: ट्रेनची वेळ कशी पहावी?\nA: "Train Timetable" विभागात जाऊन ट्रेन क्रमांक टाका.',
      'Q: अॅपची भाषा कशी बदलावी?\nA: Account > Language मध्ये जाऊन तुमची आवडती भाषा निवडा.'
    ] : [
      'Q: How to check PNR status?\nA: Tap "PNR Status" on home screen and enter your 10-digit PNR number.',
      'Q: How to save bookings?\nA: After checking PNR, tap "Save to My Bookings" button.',
      'Q: How to view train timings?\nA: Go to "Train Timetable" section and enter train number.',
      'Q: How to change app language?\nA: Go to Account > Language and select your preferred language.'
    ];

    Alert.alert(
      currentLanguage === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : currentLanguage === 'mr' ? 'वारंवार विचारले जाणारे प्रश्न' : 'Frequently Asked Questions',
      faqData.join('\n\n'),
      [{ text: t('ok', currentLanguage) }]
    );
  };

  const showFeedbackForm = () => {
    const feedbackOptions = [
      currentLanguage === 'hi' ? '⭐ ऐप को रेट करें' : currentLanguage === 'mr' ? '⭐ अॅपला रेट करा' : '⭐ Rate the App',
      currentLanguage === 'hi' ? '🐛 बग रिपोर्ट करें' : currentLanguage === 'mr' ? '🐛 बग रिपोर्ट करा' : '🐛 Report a Bug',
      currentLanguage === 'hi' ? '💡 सुझाव दें' : currentLanguage === 'mr' ? '💡 सूचना द्या' : '💡 Suggest Feature',
      currentLanguage === 'hi' ? '👍 सामान्य फीडबैक' : currentLanguage === 'mr' ? '👍 सामान्य फीडबॅक' : '👍 General Feedback'
    ];

    Alert.alert(
      currentLanguage === 'hi' ? 'फीडबैक भेजें' : currentLanguage === 'mr' ? 'फीडबॅक पाठवा' : 'Send Feedback',
      currentLanguage === 'hi' ? 'फीडबैक का प्रकार चुनें:' : currentLanguage === 'mr' ? 'फीडबॅकचा प्रकार निवडा:' : 'Choose feedback type:',
      [
        ...feedbackOptions.map(option => ({
          text: option,
          onPress: () => Alert.alert(
            currentLanguage === 'hi' ? 'धन्यवाद!' : currentLanguage === 'mr' ? 'धन्यवाद!' : 'Thank You!',
            currentLanguage === 'hi' ? 'आपका फीडबैक हमारे लिए महत्वपूर्ण है। हम जल्द ही संपर्क करेंगे।' : currentLanguage === 'mr' ? 'तुमचा फीडबॅक आमच्यासाठी महत्त्वाचा आहे. आम्ही लवकरच संपर्क करू.' : 'Your feedback is important to us. We\'ll get back to you soon.',
            [{ text: t('ok', currentLanguage) }]
          )
        })),
        { text: t('cancel', currentLanguage), style: 'cancel' }
      ]
    );
  };
=======
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
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d

  const accountOptions = [
    {
      id: 'bookings',
      title: t('myBookingsAccount', currentLanguage),
      subtitle: t('myBookingsSubtitle', currentLanguage),
      icon: CreditCard,
      onPress: () => {
<<<<<<< HEAD
        // Navigate to bookings tab
=======
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
        router.push('/(tabs)/booking');
      },
    },
    {
      id: 'settings',
      title: t('appSettings', currentLanguage),
      subtitle: t('appSettingsSubtitle', currentLanguage),
      icon: Settings,
      onPress: () => {
<<<<<<< HEAD
        router.push('/(tabs)/settings');
=======
        setSettingsModalVisible(true);
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
      },
    },
    {
      id: 'language',
<<<<<<< HEAD
      title: t('language', currentLanguage),
      subtitle: `${t('languageSubtitle', currentLanguage)} - ${getCurrentLanguageDisplay()}`,
      icon: Globe,
      onPress: handleLanguageChange,
    },
    {
      id: 'help',
      title: t('helpSupport', currentLanguage),
      subtitle: t('helpSupportSubtitle', currentLanguage),
      icon: HelpCircle,
      onPress: handleHelpSupport,
    },
    {
      id: 'privacy',
      title: t('privacySecurity', currentLanguage),
      subtitle: t('privacySecuritySubtitle', currentLanguage),
      icon: Shield,
      onPress: () => {
        Alert.alert(t('privacySecurity', currentLanguage), 'Data Protection: Enabled\nTwo-factor Authentication: Disabled\nData Sharing: Limited\nLocation Services: Enabled', [
          { text: 'Manage Settings' },
          { text: t('ok', currentLanguage) }
        ]);
=======
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
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
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
<<<<<<< HEAD
        <TouchableOpacity onPress={() => router.push('/(tabs)/')} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
=======
        <Text style={styles.headerTitle}>My Account</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setSettingsModalVisible(true)}
        >
          <Settings size={24} color="#2563EB" />
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('myAccount', currentLanguage)}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
<<<<<<< HEAD
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.memberSince}>{t('smartCompanion', currentLanguage)}</Text>
=======
          <View style={styles.profileContent}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarContainer}>
                <User size={32} color="#FFFFFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.memberSince}>Lovely Level Railways</Text>
              </View>
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
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
<<<<<<< HEAD
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>{t('accountSection', currentLanguage)}</Text>
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
=======
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
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
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
<<<<<<< HEAD
    backgroundColor: '#F8FAFC',
  },
  optionsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#57585ae3',
    marginBottom: 10,
    fontFamily: 'Poppins-Bold',
=======
    backgroundColor: '#FFFFFF',
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
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
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-ExtraBold',
  },
  placeholder: {
    width: 32,
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