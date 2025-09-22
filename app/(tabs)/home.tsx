import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  StatusBar, TextInput, Image 
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Train, MapPin,Bell, Ticket, Search, Mic, CircleHelp, ChevronRight, MessageSquare,Bed,FileText} from 'lucide-react-native';
import { qaService, Question } from '@/lib/supabase';

export default function HomeScreen() {
  const [latestQuestions, setLatestQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  const services = [
    { id: 'pnr_status', title: 'PNR\nStatus', icon: Ticket, route: '/pnr-checker', color: '#3A8DFF' },
    { id: 'nearby_stations', title: 'Nearby\nStations', icon: MapPin, route: '/station-layout', color: '#F2994A' },
    { id: 'track_train', title: 'Train\nTimes', icon: Train, route: '/train-timetable', color: '#3D99C2' },
    { id: 'chart_vacancy', title: 'Chart Vacancy', icon: FileText, route: '/chart_vacancy', color: '#3A8DFF' },
    { id: 'retiring_rooms', title: 'Retiring Rooms', icon: Bed, route: '/retiring_rooms', color: '#F2994A' },
    { id: 'help_support', title: 'Help &\nSupport', icon: CircleHelp, route: '/emergency_contact', color: '#3D99C2' },
  ];

  // Load latest questions from Q&A
  useEffect(() => {
    const loadLatestQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const questions = await qaService.getQuestions();
        setLatestQuestions(questions.slice(0, 3));
      } catch (error) {
        console.error('Error loading latest questions:', error);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadLatestQuestions();
  }, []);

  const handleServicePress = (route: string) => router.push(route as any);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const diffInHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View style={styles.header}>
        {/* Top Row: Logo + Text + Notification */}
        <View style={styles.headerContent}>
          {/* Logo */}
          <Image
            source={require("../../assets/logo/raileaselogo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />

          {/* Title & Tagline */}
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>RailEase</Text>
            <Text style={styles.headerSubtitle}>Your Railway Travel Companion</Text>
          </View>

          {/* Notification Icon */}
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#0e0d0dff" />
            <View style={styles.notificationDot} /> 
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trains, stations or PNR"
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity style={styles.micButton}>
            <Mic size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Services Grid */}
        <View style={styles.servicesGrid}>
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, { backgroundColor: service.color }]}
                onPress={() => handleServicePress(service.route)}
                activeOpacity={0.7}
              >
                <IconComponent size={32} color="#FFFFFF" />
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/*Recent Searches*/}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.searchPill}><Text>234057390</Text></View>
            <View style={styles.searchPill}><Text>Station Code</Text></View>
            <View style={styles.searchPill}><Text>Delhi → Mumbai</Text></View>
          </ScrollView>
        </View> */}

        {/* Latest Updates / News */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Updates</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>News alert</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.newsCard}>
            <Image
              source={require("../../assets/images/train_news.jpg")}
              style={styles.newsImage}
            />
            <View style={styles.newsText}>
              <Text style={styles.newsTitle}>Aadhaar-linked train ticket booking mandate from October 1</Text>
              <Text style={styles.newsSubtitle} numberOfLines={2}>
                From Oct 1, only Aadhaar-linked IRCTC accounts can book train tickets in the first 15 mins of reservations.
              </Text>
            </View>
          </TouchableOpacity>
           <TouchableOpacity style={styles.newsCard}>
            <Image
              source={require("../../assets/images/rail_neer.png")}
              style={styles.newsImage}
            />
            <View style={styles.newsText}>
              <Text style={styles.newsTitle}>Railways slashes ‘Rail Neer’ and bottled water prices after GST reforms.</Text>
              <Text style={styles.newsSubtitle} numberOfLines={2}>
                Railways cuts “Rail Neer” price to ₹14 (1-litre) & ₹9 (500 ml), applying same reduction to other bottled water brands in stations from Sept 22 after GST reforms.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Latest Questions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Q&A</Text>
            <TouchableOpacity onPress={() => router.push('/qa')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {isLoadingQuestions ? (
            <Text style={styles.loadingText}>Loading questions...</Text>
          ) : latestQuestions.length > 0 ? (
            latestQuestions.map((q) => (
              <TouchableOpacity key={q.id} style={styles.questionCard}>
                <Text style={styles.questionTitle}>{q.title}</Text>
                <Text style={styles.questionMeta}>
                  {q.answers?.length || 0} replies • {formatTimestamp(q.created_at)}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyQuestionsContainer}>
              <MessageSquare size={32} color="#94A3B8" />
              <Text style={styles.emptyQuestionsText}>No questions yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    // flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
//   },
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: { width: 70, height: 60, marginRight: 12 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#052861ff' },
  headerSubtitle: { fontSize: 11, color: '#15181bff' },
  notificationButton: {
    marginLeft: 'auto',
    position: 'relative',
    padding: 6,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },

  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 24,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#1E293B', marginLeft: 8 },
  
  micButton: {
    backgroundColor: "#2563EB", // blue background like in your screenshot
    borderRadius: 20,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  serviceCard: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  section: { marginBottom: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },

  searchPill: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },

  newsCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden' },
  newsImage: { width: 100, height: 80 },
  newsText: { flex: 1, padding: 10 },
  newsTitle: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  newsSubtitle: { fontSize: 12, color: '#64748B' },

  loadingText: { textAlign: 'center', color: '#64748B' },
  questionCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 8 },
  questionTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  questionMeta: { fontSize: 12, color: '#94A3B8' },
  emptyQuestionsContainer: { alignItems: 'center', padding: 20 },
  emptyQuestionsText: { color: '#64748B', marginTop: 8 },
});