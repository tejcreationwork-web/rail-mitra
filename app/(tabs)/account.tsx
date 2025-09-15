import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { User, Settings, Bell, CreditCard, CircleHelp as HelpCircle, ChevronRight, Star, Shield, Globe, Moon, Download, Phone, Mail, MessageCircle, ExternalLink, FileText, Video, ArrowLeft } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';

export default function AccountScreen() {
  const { currentLanguage, changeLanguage } = useLanguage();
  
  const [user] = useState({
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

  const accountOptions = [
    {
      id: 'bookings',
      title: t('myBookingsAccount', currentLanguage),
      subtitle: t('myBookingsSubtitle', currentLanguage),
      icon: CreditCard,
      onPress: () => {
        // Navigate to bookings tab
        router.push('/(tabs)/booking');
      },
    },
    // {
    //   id: 'notifications',
    //   title: 'Notifications',
    //   subtitle: 'Manage your notification preferences',
    //   icon: Bell,
    //   onPress: () => {
    //     Alert.alert('Notifications', 'Push notifications: Enabled\nEmail notifications: Enabled\nSMS alerts: Disabled', [
    //       { text: 'OK' }
    //     ]);
    //   },
    // },
    {
      id: 'settings',
      title: t('appSettings', currentLanguage),
      subtitle: t('appSettingsSubtitle', currentLanguage),
      icon: Settings,
      onPress: () => {
        router.push('/(tabs)/settings');
      },
    },
    {
      id: 'language',
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
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(tabs)/')} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{t('myAccount', currentLanguage)}</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#FFFFFF" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.memberSince}>{t('smartCompanion', currentLanguage)}</Text>
            </View>
          </View>

        </View>

        {/* Account Options */}
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
                </View>
                <ChevronRight size={20} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
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
  },
  header: {
    backgroundColor: '#2563EB',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#2563EB',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  memberSince: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  optionItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF4FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
});