import { Tabs } from 'expo-router';
import { Home, MessageSquare, User, Calendar, Phone } from 'lucide-react-native';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E40AF',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          height: 85,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          fontFamily: 'Inter-SemiBold',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: 'Booking',
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color, focused }) => (
            <View style={{
              backgroundColor: focused ? '#1E40AF' : 'transparent',
              borderRadius: 25,
              padding: 12,
              marginBottom: 8,
            }}>
              <Home size={size + 4} color={focused ? '#FFFFFF' : color} />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
            marginTop: -4,
            fontFamily: 'Inter-SemiBold',
          },
        }}
      />
      <Tabs.Screen
        name="qa"
        options={{
          title: 'Q&A',
          tabBarIcon: ({ size, color }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: 'Contact',
          tabBarIcon: ({ size, color }) => (
            <Phone size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}