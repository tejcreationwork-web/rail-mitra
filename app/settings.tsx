import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { Bell, Globe, Moon, Download, Shield, Info, Star, Share } from 'lucide-react-native';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'App Preferences',
      items: [
        {
          icon: Bell,
          title: 'Push Notifications',
          subtitle: 'Get updates about your bookings',
          hasSwitch: true,
          switchValue: notifications,
          onSwitchChange: setNotifications,
        },
        {
          icon: Download,
          title: 'Offline Mode',
          subtitle: 'Download data for offline access',
          hasSwitch: true,
          switchValue: offlineMode,
          onSwitchChange: setOfflineMode,
        },
        {
          icon: Moon,
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          hasSwitch: true,
          switchValue: darkMode,
          onSwitchChange: setDarkMode,
        },
        {
          icon: Globe,
          title: 'Language',
          subtitle: 'English',
          hasArrow: true,
          onPress: () => Alert.alert('Language', 'Language selection coming soon'),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          icon: Shield,
          title: 'Privacy Policy',
          subtitle: 'How we handle your data',
          hasArrow: true,
          onPress: () => Alert.alert('Privacy', 'Privacy policy details'),
        },
        {
          icon: Download,
          title: 'Clear Cache',
          subtitle: 'Free up storage space',
          hasArrow: true,
          onPress: () => Alert.alert('Clear Cache', 'Cache cleared successfully'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: Star,
          title: 'Rate App',
          subtitle: 'Help us improve the app',
          hasArrow: true,
          onPress: () => Alert.alert('Rate App', 'Thank you for your feedback!'),
        },
        {
          icon: Share,
          title: 'Share App',
          subtitle: 'Tell your friends about us',
          hasArrow: true,
          onPress: () => Alert.alert('Share', 'Sharing functionality coming soon'),
        },
        {
          icon: Info,
          title: 'About',
          subtitle: 'Version 1.3.0',
          hasArrow: true,
          onPress: () => Alert.alert('About', 'Indian Railway Info App v1.3.0\nBuilt for travelers by travelers'),
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.hasSwitch}
      activeOpacity={0.7}
    >
      <View style={styles.itemLeft}>
        <View style={styles.itemIcon}>
          <item.icon size={20} color="#2563EB" />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        {item.hasSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
            thumbColor={item.switchValue ? '#2563EB' : '#F8FAFC'}
          />
        )}
        {item.hasArrow && (
          <Text style={styles.arrow}>→</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your app experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  {renderSettingItem(item, itemIndex)}
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Indian Railway Info</Text>
          <Text style={styles.appInfoVersion}>Version 1.3.0</Text>
          <Text style={styles.appInfoDescription}>
            Your trusted companion for Indian railway travel. Get real-time information, 
            book tickets, and track your journey seamlessly.
          </Text>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>All systems operational</Text>
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
    backgroundColor: '#2563EB',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
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
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EBF4FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  itemRight: {
    marginLeft: 12,
  },
  arrow: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
  appInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  appInfoDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: '#059669',
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
});