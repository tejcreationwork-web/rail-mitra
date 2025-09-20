import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput, Image, Alert, Modal, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Brain as Train, MapPin, Ticket, Search, MessageSquare, ChevronRight, CircleHelp, Bell, Mic, X, Clock, TrendingUp } from 'lucide-react-native';
import { qaService, Question } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SearchResult = {
  id: string;
  type: 'train' | 'station' | 'pnr';
  title: string;
  subtitle: string;
  route?: string;
};

type RecentSearch = {
  id: string;
  query: string;
  type: 'train' | 'station' | 'pnr';
  timestamp: number;
};

export default function HomeScreen() {
  const [latestQuestions, setLatestQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const services = [
    {
      id: 'live-train',
      title: 'Track Train',
      icon: Train,
      route: '/train-timetable',
      color: '#FFFFFF',
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

  // Mock search data
  const mockSearchData: SearchResult[] = [
    { id: '1', type: 'train', title: '12951 - Mumbai Rajdhani', subtitle: 'Mumbai Central to New Delhi', route: '/train-timetable' },
    { id: '2', type: 'train', title: '12952 - New Delhi Rajdhani', subtitle: 'New Delhi to Mumbai Central', route: '/train-timetable' },
    { id: '3', type: 'station', title: 'Mumbai Central (MMCT)', subtitle: 'Major railway junction', route: '/station-layout' },
    { id: '4', type: 'station', title: 'New Delhi (NDLS)', subtitle: 'Capital railway station', route: '/station-layout' },
    { id: '5', type: 'station', title: 'Thane (TNA)', subtitle: 'Central Railway junction', route: '/station-layout' },
    { id: '6', type: 'pnr', title: 'PNR Status Check', subtitle: 'Check your booking status', route: '/pnr-checker' },
  ];

  // Load recent searches from storage
  const loadRecentSearches = async () => {
    try {
      const saved = await AsyncStorage.getItem('recentSearches');
      if (saved) {
        const searches: RecentSearch[] = JSON.parse(saved);
        setRecentSearches(searches.slice(0, 5)); // Keep only last 5
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // Save search to recent searches
  const saveRecentSearch = async (query: string, type: 'train' | 'station' | 'pnr') => {
    try {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query,
        type,
        timestamp: Date.now(),
      };

      const updated = [newSearch, ...recentSearches.filter(s => s.query !== query)].slice(0, 5);
      setRecentSearches(updated);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = mockSearchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  // Handle search result selection
  const handleSearchResultPress = (result: SearchResult) => {
    saveRecentSearch(result.title, result.type);
    setSearchQuery('');
    setIsSearchFocused(false);
    setSearchResults([]);
    
    if (result.route) {
      router.push(result.route as any);
    }
  };

  // Handle recent search press
  const handleRecentSearchPress = (search: RecentSearch) => {
    setSearchQuery(search.query);
    handleSearch(search.query);
  };

  // Handle voice search
  const handleVoiceSearch = () => {
    setVoiceModalVisible(true);
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setVoiceModalVisible(false);
      setSearchQuery('Mumbai Central');
      handleSearch('Mumbai Central');
      Alert.alert('Voice Search', 'Voice search detected: "Mumbai Central"');
    }, 3000);
  };

  // Load latest questions from Q&A
  useEffect(() => {
    const loadLatestQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const questions = await qaService.getQuestions();
        const latest = questions.slice(0, 3);
        setLatestQuestions(latest);
      } catch (error) {
        console.error('Error loading latest questions:', error);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadLatestQuestions();
    loadRecentSearches();
  }, []);

  // Update search results when query changes
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const handleServicePress = (route: string) => {
    router.push(route as any);
  };

  const handleQuestionPress = (question: Question) => {
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

  const getSearchIcon = (type: string) => {
    switch (type) {
      case 'train': return Train;
      case 'station': return MapPin;
      case 'pnr': return Ticket;
      default: return Search;
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
              <Train size={32} color="#FFFFFF" />
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
          <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search trains, stations or PNR"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.micButton} onPress={handleVoiceSearch}>
            <Mic size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Results Dropdown */}
        {(isSearchFocused && (searchResults.length > 0 || recentSearches.length > 0)) && (
          <View style={styles.searchDropdown}>
            {searchQuery.length > 0 ? (
              // Search Results
              <>
                <Text style={styles.dropdownTitle}>Search Results</Text>
                {searchResults.map((result) => {
                  const IconComponent = getSearchIcon(result.type);
                  return (
                    <TouchableOpacity
                      key={result.id}
                      style={styles.searchResultItem}
                      onPress={() => handleSearchResultPress(result)}
                    >
                      <IconComponent size={20} color="#2563EB" />
                      <View style={styles.searchResultText}>
                        <Text style={styles.searchResultTitle}>{result.title}</Text>
                        <Text style={styles.searchResultSubtitle}>{result.subtitle}</Text>
                      </View>
                      <ChevronRight size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : (
              // Recent Searches
              recentSearches.length > 0 && (
                <>
                  <Text style={styles.dropdownTitle}>Recent Searches</Text>
                  {recentSearches.map((search) => {
                    const IconComponent = getSearchIcon(search.type);
                    return (
                      <TouchableOpacity
                        key={search.id}
                        style={styles.searchResultItem}
                        onPress={() => handleRecentSearchPress(search)}
                      >
                        <Clock size={20} color="#9CA3AF" />
                        <View style={styles.searchResultText}>
                          <Text style={styles.searchResultTitle}>{search.query}</Text>
                          <Text style={styles.searchResultSubtitle}>
                            {new Date(search.timestamp).toLocaleDateString()}
                          </Text>
                        </View>
                        <TrendingUp size={16} color="#9CA3AF" />
                      </TouchableOpacity>
                    );
                  })}
                </>
              )
            )}
          </View>
        )}
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

        {/* Recent Searches Section */}
        {recentSearches.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.recentSearchesContainer}>
              {recentSearches.slice(0, 2).map((search, index) => {
                const IconComponent = getSearchIcon(search.type);
                return (
                  <TouchableOpacity
                    key={search.id}
                    style={styles.searchItem}
                    onPress={() => handleRecentSearchPress(search)}
                  >
                    <IconComponent size={20} color="#2563EB" />
                    <Text style={styles.searchText}>{search.query}</Text>
                    <ChevronRight size={16} color="#9CA3AF" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

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
              <Text style={styles.updateTitle}>Indian Railway Updates</Text>
              <Text style={styles.updateDescription}>
                Latest announcements and service updates for railway travelers across India.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Voice Search Modal */}
      <Modal
        visible={voiceModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVoiceModalVisible(false)}
      >
        <View style={styles.voiceModalOverlay}>
          <View style={styles.voiceModalContent}>
            <View style={[styles.voicePulse, isListening && styles.voicePulseActive]}>
              <Mic size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.voiceModalTitle}>
              {isListening ? 'Listening...' : 'Voice Search'}
            </Text>
            <Text style={styles.voiceModalSubtitle}>
              {isListening ? 'Speak now' : 'Tap to start voice search'}
            </Text>
            <TouchableOpacity
              style={styles.voiceModalClose}
              onPress={() => setVoiceModalVisible(false)}
            >
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    position: 'relative',
    zIndex: 1000,
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
    width: 56,
    height: 56,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    fontFamily: 'Poppins-ExtraBold',
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Medium',
    marginTop: 2,
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
    borderColor: '#E5E7EB',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBarFocused: {
    borderColor: '#2563EB',
    backgroundColor: '#FFFFFF',
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
  searchDropdown: {
    position: 'absolute',
    top: '100%',
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 300,
    zIndex: 1001,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultText: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: 'Inter-SemiBold',
  },
  searchResultSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
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
  recentSearchesContainer: {
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
    flexDirection: 'row',
  },
  updateImage: {
    width: 120,
    height: 120,
  },
  updateContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  updateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  updateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  voiceModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    minWidth: 280,
  },
  voicePulse: {
    width: 100,
    height: 100,
    backgroundColor: '#2563EB',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  voicePulseActive: {
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  voiceModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  voiceModalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  voiceModalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
});