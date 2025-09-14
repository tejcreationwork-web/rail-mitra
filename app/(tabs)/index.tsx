import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Zap as Train, MapPin, Clock, CircleCheck as CheckCircle, Search, MessageSquare, Tag, ChevronRight } from 'lucide-react-native';
import { qaService, Question } from '@/lib/supabase';

export default function HomeScreen() {
  const [latestQuestions, setLatestQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest Questions</Text>
            <TouchableOpacity onPress={() => router.push('/qa')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoadingQuestions ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading questions...</Text>
            </View>
          ) : latestQuestions.length > 0 ? (
            latestQuestions.map((question) => (
              <TouchableOpacity
                key={question.id}
                style={styles.questionCard}
                onPress={() => handleQuestionPress(question)}
                activeOpacity={0.7}
              >
                <View style={styles.questionContent}>
                  <View style={styles.questionImageContainer}>
                    <View style={styles.questionImage}>
                      <Text style={styles.questionImageText}>
                        {question.author.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.questionText}>
                    <Text style={styles.questionTitle} numberOfLines={2}>
                      {question.title}
                    </Text>
                    <View style={styles.questionMeta}>
                      <Text style={styles.questionReplies}>
                        {question.answers?.length || 0} replies
                      </Text>
                      <Text style={styles.questionTime}>
                        • {formatTimestamp(question.created_at)}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyQuestionsContainer}>
              <MessageSquare size={32} color="#94A3B8" />
              <Text style={styles.emptyQuestionsText}>No questions yet</Text>
              <TouchableOpacity 
                style={styles.askQuestionButton}
                onPress={() => router.push('/qa')}
              >
                <Text style={styles.askQuestionButtonText}>Ask First Question</Text>
              </TouchableOpacity>
            </View>
          )}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    fontFamily: 'Poppins-Bold',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Inter-Medium',
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
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionImageText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
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
    lineHeight: 22,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionReplies: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter-Regular',
  },
  questionTime: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  emptyQuestionsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyQuestionsText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 12,
    marginBottom: 16,
    fontFamily: 'Inter-Medium',
  },
  askQuestionButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  askQuestionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});