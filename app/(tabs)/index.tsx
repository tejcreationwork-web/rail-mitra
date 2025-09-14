import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Zap as Train, MapPin, Clock, CircleCheck as CheckCircle, Search, MessageSquare, Tag, ChevronRight } from 'lucide-react-native';

export default function HomeScreen() {
  const services = [
    {
      id: 'live-train',
      title: 'Track\nLive Train',
      icon: Train,
      route: '/train-timetable',
      color: '#2563EB',
    },
    {
      id: 'waitlist',
      title: 'Check\nWaitlist\nProbability',
      icon: Tag,
      route: '/pnr-checker',
      color: '#2563EB',
    },
    {
      id: 'stations',
      title: 'Find Nearby\nStations',
      icon: MapPin,
      route: '/station-layout',
      color: '#2563EB',
    },
    {
      id: 'qa',
      title: 'Community\nQ&A',
      icon: MessageSquare,
      route: '/qa',
      color: '#2563EB',
    },
  ];

  const trendingQuestions = [
    {
      id: 1,
      question: "How's food on Rajdhani Express?",
      replies: 12,
      image: require('@/assets/images/thane.png'),
    },
    {
      id: 2,
      question: "Can I board the train at Jaipur?",
      replies: 7,
      image: require('@/assets/images/thane.png'),
    },
    {
      id: 3,
      question: "Is the wifi working at Delhi station?",
      replies: 4,
      image: require('@/assets/images/thane.png'),
    },
  ];

  const handleServicePress = (route: string) => {
    router.push(route as any);
  };

  const handleQuestionPress = (questionId: number) => {
    router.push('/qa');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
      
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Train size={32} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>RailEase</Text>
            <Text style={styles.headerSubtitle}>Your Railway Travel Companion</Text>
          </View>
        </View>
        <Text style={styles.tagline}>Your smart travel companion</Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search trains, stations, PNRs..."
            placeholderTextColor="#94A3B8"
          />
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
                  index % 2 === 0 ? styles.serviceCardLeft : styles.serviceCardRight
                ]}
                onPress={() => handleServicePress(service.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <IconComponent size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Trending Questions */}
        <View style={styles.trendingSection}>
          <Text style={styles.sectionTitle}>Trending Questions</Text>
          
          {trendingQuestions.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.questionCard}
              onPress={() => handleQuestionPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.questionContent}>
                <View style={styles.questionImageContainer}>
                  <View style={styles.questionImage} />
                </View>
                <View style={styles.questionText}>
                  <Text style={styles.questionTitle}>{item.question}</Text>
                  <Text style={styles.questionReplies}>{item.replies} replies</Text>
                </View>
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#1E40AF',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 12,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#BFDBFE',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  tagline: {
    fontSize: 16,
    color: '#DBEAFE',
    fontFamily: 'Inter-Medium',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'flex-start',
  },
  serviceCardLeft: {
    width: '48%',
  },
  serviceCardRight: {
    width: '48%',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
    fontFamily: 'Poppins-Bold',
  },
  trendingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionImageContainer: {
    marginRight: 12,
  },
  questionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  questionText: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  questionReplies: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
});