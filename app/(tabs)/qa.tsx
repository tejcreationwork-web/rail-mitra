import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Share, Search, Plus, User, Clock } from 'lucide-react-native';

type Question = {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  answers: number;
  tags: string[];
  isLiked?: boolean;
  isDisliked?: boolean;
};

export default function QAScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'How to check PNR status without internet?',
      content: 'Is there any way to check PNR status when I don\'t have internet connection? I\'m traveling to remote areas.',
      author: 'Priya Sharma',
      timestamp: '2 hours ago',
      likes: 15,
      dislikes: 2,
      answers: 8,
      tags: ['PNR', 'Offline', 'Status'],
      isLiked: false,
      isDisliked: false,
    },
    {
      id: '2',
      title: 'Best time to book train tickets for festivals?',
      content: 'When should I book train tickets for Diwali season? What\'s the advance booking period?',
      author: 'Amit Kumar',
      timestamp: '5 hours ago',
      likes: 23,
      dislikes: 1,
      answers: 12,
      tags: ['Booking', 'Festival', 'Tips'],
      isLiked: true,
      isDisliked: false,
    },
    {
      id: '3',
      title: 'Food quality in Rajdhani Express',
      content: 'How is the food quality in Rajdhani Express? Is it worth the extra cost compared to other trains?',
      author: 'Sneha Patel',
      timestamp: '1 day ago',
      likes: 31,
      dislikes: 5,
      answers: 18,
      tags: ['Food', 'Rajdhani', 'Experience'],
      isLiked: false,
      isDisliked: false,
    },
    {
      id: '4',
      title: 'Platform change notifications',
      content: 'How can I get notified if my train platform changes at the last minute? This happened to me twice.',
      author: 'Rahul Singh',
      timestamp: '2 days ago',
      likes: 19,
      dislikes: 0,
      answers: 6,
      tags: ['Platform', 'Notifications', 'Updates'],
      isLiked: false,
      isDisliked: false,
    },
  ]);

  const handleLike = (questionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const wasLiked = q.isLiked;
        const wasDisliked = q.isDisliked;
        return {
          ...q,
          isLiked: !wasLiked,
          isDisliked: false,
          likes: wasLiked ? q.likes - 1 : q.likes + 1,
          dislikes: wasDisliked ? q.dislikes - 1 : q.dislikes,
        };
      }
      return q;
    }));
  };

  const handleDislike = (questionId: string) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        const wasLiked = q.isLiked;
        const wasDisliked = q.isDisliked;
        return {
          ...q,
          isLiked: false,
          isDisliked: !wasDisliked,
          likes: wasLiked ? q.likes - 1 : q.likes,
          dislikes: wasDisliked ? q.dislikes - 1 : q.dislikes + 1,
        };
      }
      return q;
    }));
  };

  const handleShare = (question: Question) => {
    Alert.alert('Share Question', `Share "${question.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => Alert.alert('Shared!', 'Question shared successfully') }
    ]);
  };

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Q&A Community</Text>
        <Text style={styles.headerSubtitle}>Ask questions, share knowledge</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Search size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search questions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94A3B8"
          />
        </View>
        <TouchableOpacity 
          style={styles.askButton}
          onPress={() => Alert.alert('Ask Question', 'Question form coming soon!')}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,247</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3,891</Text>
            <Text style={styles.statLabel}>Answers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>892</Text>
            <Text style={styles.statLabel}>Users</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Questions</Text>

        {filteredQuestions.map((question) => (
          <View key={question.id} style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.authorInfo}>
                <View style={styles.avatar}>
                  <User size={16} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.authorName}>{question.author}</Text>
                  <View style={styles.timestampContainer}>
                    <Clock size={12} color="#94A3B8" />
                    <Text style={styles.timestamp}>{question.timestamp}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.questionTitle}>{question.title}</Text>
            <Text style={styles.questionContent}>{question.content}</Text>

            <View style={styles.tagsContainer}>
              {question.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.questionActions}>
              <TouchableOpacity 
                style={[styles.actionButton, question.isLiked && styles.actionButtonActive]}
                onPress={() => handleLike(question.id)}
              >
                <ThumbsUp size={16} color={question.isLiked ? '#FFFFFF' : '#64748B'} />
                <Text style={[styles.actionText, question.isLiked && styles.actionTextActive]}>
                  {question.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, question.isDisliked && styles.actionButtonDislike]}
                onPress={() => handleDislike(question.id)}
              >
                <ThumbsDown size={16} color={question.isDisliked ? '#FFFFFF' : '#64748B'} />
                <Text style={[styles.actionText, question.isDisliked && styles.actionTextDislike]}>
                  {question.dislikes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <MessageSquare size={16} color="#64748B" />
                <Text style={styles.actionText}>{question.answers}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleShare(question)}
              >
                <Share size={16} color="#64748B" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#BFDBFE',
    fontFamily: 'Inter-Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  askButton: {
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionHeader: {
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    backgroundColor: '#2563EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
    fontFamily: 'Poppins-SemiBold',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    fontFamily: 'Poppins-SemiBold',
  },
  questionContent: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8,
  },
  tag: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  questionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  actionButtonActive: {
    backgroundColor: '#2563EB',
  },
  actionButtonDislike: {
    backgroundColor: '#DC2626',
  },
  actionText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  actionTextActive: {
    color: '#FFFFFF',
  },
  actionTextDislike: {
    color: '#FFFFFF',
  },
});