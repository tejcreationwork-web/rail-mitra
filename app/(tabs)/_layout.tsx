import { Tabs } from 'expo-router';
<<<<<<< HEAD
import { User, Calendar, House, MessageSquare, Phone } from 'lucide-react-native';
import { useLanguage } from '@/hooks/useLanguage';
import { t } from '@/lib/i18n';
=======
import { Ionicons } from '@expo/vector-icons';
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d

export default function TabLayout() {
  const { currentLanguage } = useLanguage();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
      }}>
      <Tabs.Screen
        name="index"
        options={{
<<<<<<< HEAD
          title: t('account', currentLanguage),
=======
          title: 'Home',
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: t('booking', currentLanguage),
          tabBarIcon: ({ size, color }) => (
<<<<<<< HEAD
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('home', currentLanguage),
          tabBarIcon: ({ size, color }) => (
            <House size={size} color={color} />
=======
            <Ionicons name="train" size={size} color={color} />
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
          ),
        }}
      />
      <Tabs.Screen
        name="qa"
        options={{
          title: t('qa', currentLanguage),
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="help-circle" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
<<<<<<< HEAD
          title: t('contact', currentLanguage),
=======
          title: 'Account',
>>>>>>> f952c6addf7f745b84b2da32739e57286f46b76d
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}