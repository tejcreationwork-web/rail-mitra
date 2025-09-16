import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useState } from 'react';
import { User, Settings, Bell, CreditCard, CircleHelp as HelpCircle, ChevronRight, Star, Shield, Globe, Moon, Download } from 'lucide-react-native';

export default function AccountScreen() {
  const [user] = useState({
    name: 'Hi Traveller !',
    memberSince: 'January 2023',
    totalBookings: 24,
    points: 1250,
  });

  const accountOptions = [
    {
      id: 'bookings',
      title: 'My Bookings',
      subtitle: 'View all your train bookings',
      icon: CreditCard,
      onPress: () => {
        // Navigate to bookings tab
        Alert.alert('My Bookings', 'Navigating to your bookings...');
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
      title: 'App Settings',
      subtitle: 'Customize your app experience',
      icon: Settings,
      onPress: () => {
        // Navigate to settings (you can implement a settings modal or screen here)
        Alert.alert('App Settings', 'Theme: Light\nLanguage: English\nOffline mode: Disabled\nAuto-refresh: Enabled\nNotifications: Enabled\nData & Privacy settings available', [
          { text: 'Manage Settings' },
          { text: 'OK' }
        ]);
      },
    },
    {
      id: 'language',
      title: 'Language',
      subtitle: 'Change app language',
      icon: Globe,
      onPress: () => {
        Alert.alert('Language Selection', 'Available languages:\n• English (Current)\n• हिंदी\n• বাংলা\n• தமிழ்\n• తెలుగు', [
          { text: 'OK' }
        ]);
      },
    },
    {
      id: 'contact',
      title: 'Contact & Support',
      subtitle: 'Get help and contact information',
      icon: HelpCircle,
      onPress: () => {
        Alert.alert('Contact & Support', 'Contact Support:\n📞 139 (Railway Helpline)\n📧 support@railease.com\n💬 Live Chat: Available 24/7\n\nEmergency Numbers:\n🚨 100 (Police)\n🔥 101 (Fire)\n🚑 108 (Ambulance)\n🚂 1512 (Railway Security)', [
          { text: 'Call Support', onPress: () => {} },
          { text: 'OK' }
        ]);
      },
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help with your account',
      icon: HelpCircle,
      onPress: () => {
        Alert.alert('Help & Support', 'Contact Support:\n📞 139 (Railway Helpline)\n📧 support@railease.com\n💬 Live Chat: Available 24/7', [
          { text: 'Contact Support' },
          { text: 'OK' }
        ]);
      },
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      icon: Shield,
      onPress: () => {
        Alert.alert('Privacy & Security', 'Data Protection: Enabled\nTwo-factor Authentication: Disabled\nData Sharing: Limited\nLocation Services: Enabled', [
          { text: 'Manage Settings' },
          { text: 'OK' }
        ]);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Account</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
              <Text style={styles.memberSince}>Your smart travel companion </Text>
            </View>
          </View>

        </View>

        {/* Account Options */}
        <View style={styles.optionsContainer}>
          <Text style={styles.sectionTitle}>Account Section</Text>
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
  optionsContainer : {
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  settingsButton: {
    padding: 8,
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