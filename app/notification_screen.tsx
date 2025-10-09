import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useNotifications } from '../components/notifications';

export default function NotificationsScreen() {
  const { notifications, markAsRead } = useNotifications();

  const renderNotification = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.isRead && styles.unread]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.message}>{item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#edeff3ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={40} color="#94A3B8" />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#2563EB',
    borderBottomWidth: 1,
    borderBottomColor: '#e8ebf0ff',
  },
  backButton: {
    marginTop: 20,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
    color: '#f7f8faff',
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  unread: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748B',
  },
  message: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
  },
});