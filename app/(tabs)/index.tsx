import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Train, MapPin, Ticket, Search, MessageSquare, ChevronRight, CircleHelp, Bell, Mic } from 'lucide-react-native';
import { qaService, Question } from '@/lib/supabase';

export default function HomeScreen() {
  const [latestQuestions, setLatestQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  const services = [
    {
      id: 'live-train',
      title: 'Track Train',
      icon: Train,
      route: '/train-timetable',
      color: '#2563EB',
      bgColor: '#2563EB',
    },
    {
      id: 'pnr_status',
      title: 'PNR Status',
      icon: Ticket,
      route: '/pnr-checker',
      color: '#FFFFFF',
      bgColor: '#EF4444',
    },
    {
      id: 'station_layouts',
      title: 'Nearby Stations',
      icon: MapPin,
      route: '/station-layout',
      color: '#FFFFFF',
      bgColor: '#2563EB',
    },
    {
      id: 'helpdesk',
      title: 'Help & Support',
      icon: CircleHelp,
      route: '/contact',
      color: '#FFFFFF',
      bgColor: '#EF4444',
    },
  ];

  // Load latest questions from Q&A
  useEffect(() => {
    const loadLatestQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const questions = await qaService.getQuestions();
        // Get latest 3 questions
        const latest = questions.slice(0, 3);
        setLatestQuestions(latest);
      } catch (error) {
        console.error('Error loading latest questions:', error);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadLatestQuestions();
  }, []);

  const handleServicePress = (route: string) => {
    router.push(route as any);
  };

  const handleQuestionPress = (question: Question) => {
    // Navigate to Q&A with the specific question selected
    router.push({
      pathname: '/qa',
      params: { 
        selectedQuestionId: question.id,
        openAnswersView: 'true'
      }
    });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <View style={styles.appIcon}>
              <Train size={24} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.appName}>RailEase</Text>
              <Text style={styles.appTagline}>Your Railway Travel Companion</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#1F2937" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search trains, stations or PNR"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity style={styles.micButton}>
            <Mic size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Services Grid */}
        <View style={styles.servicesGrid}>
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  { backgroundColor: service.bgColor },
                  index % 2 === 0 ? styles.serviceCardLeft : styles.serviceCardRight
                ]}
                onPress={() => handleServicePress(service.route)}
                activeOpacity={0.8}
              >
                <View style={styles.serviceIcon}>
                  <IconComponent size={32} color={service.color} />
                </View>
                <Text style={[styles.serviceTitle, { color: service.color }]}>
                  {service.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searchs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.recentSearches}>
            <View style={styles.searchItem}>
              <Text style={styles.searchNumber}>2</Text>
              <Text style={styles.searchDate}>23/40/5-30</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
            <View style={styles.searchItem}>
              <Train size={20} color="#2563EB" />
              <Text style={styles.searchText}>Station Cod</Text>
              <ChevronRight size={16} color="#9CA3AF" />
            </View>
          </View>
        </View>

        {/* Latest Updates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
            <TouchableOpacity>
              <Text style={styles.newsAlert}>News alert</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.updateCard}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg' }}
              style={styles.updateImage}
            />
            <View style={styles.updateContent}>
              <Text style={styles.updateTitle}>Indian Railway.</Text>
              <Text style={styles.updateDescription}>
                Trivienods anillany, artart, for
              </Text>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
  },
  appTagline: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  micButton: {
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  serviceCard: {
    width: '48%',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'flex-start',
    minHeight: 140,
  },
  serviceCardLeft: {
    marginRight: '2%',
  },
  serviceCardRight: {
    marginLeft: '2%',
  },
  serviceIcon: {
    marginBottom: 16,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    fontFamily: 'Poppins-Bold',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
  },
  seeAllText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
  },
  newsAlert: {
    fontSize: 14,
    color: '#2563EB',
    fontFamily: 'Inter-Medium',
  },
  recentSearches: {
    flexDirection: 'row',
    gap: 16,
  },
  searchItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
    fontFamily: 'Poppins-Bold',
  },
  searchDate: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  updateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  updateImage: {
    width: '100%',
    height: 120,
  },
  updateContent: {
    padding: 16,
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  updateDescription: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
});