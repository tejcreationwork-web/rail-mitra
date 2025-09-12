import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Share, Search, Plus, User, Clock, Send, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Answer = {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
};

type Question = {
  id: string;
  title: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  answers: Answer[];
  tags: string[];
  isLiked?: boolean;
  isDisliked?: boolean;
};

export default function QAScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  
  // Question form state
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionTags, setQuestionTags] = useState('');
  const [authorName, setAuthorName] = useState('');
  
  // Answer form state
  const [answerContent, setAnswerContent] = useState('');
  const [answerAuthor, setAnswerAuthor] = useState('');

  // Load questions from storage
  const loadQuestions = async () => {
    try {
      const savedQuestions = await AsyncStorage.getItem('qaQuestions');
      if (savedQuestions) {
        const parsedQuestions: Question[] = JSON.parse(savedQuestions);
        setQuestions(parsedQuestions);
        setTotalQuestions(parsedQuestions.length);
        setTotalAnswers(parsedQuestions.reduce((total, q) => total + q.answers.length, 0));
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  // Save questions to storage
  const saveQuestions = async (updatedQuestions: Question[]) => {
    try {
      await AsyncStorage.setItem('qaQuestions', JSON.stringify(updatedQuestions));
      setQuestions(updatedQuestions);
      setTotalQuestions(updatedQuestions.length);
      setTotalAnswers(updatedQuestions.reduce((total, q) => total + q.answers.length, 0));
    } catch (error) {
      console.error('Error saving questions:', error);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleLike = async (questionId: string, answerId?: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        if (answerId) {
          // Like/unlike answer
          const updatedAnswers = q.answers.map(a => {
            if (a.id === answerId) {
              const wasLiked = a.isLiked;
              const wasDisliked = a.isDisliked;
              return {
                ...a,
                isLiked: !wasLiked,
                isDisliked: false,
                likes: wasLiked ? a.likes - 1 : a.likes + 1,
                dislikes: wasDisliked ? a.dislikes - 1 : a.dislikes,
              };
            }
            return a;
          });
          return { ...q, answers: updatedAnswers };
        } else {
          // Like/unlike question
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
      }
      return q;
    });
    
    await saveQuestions(updatedQuestions);
  };

  const handleDislike = async (questionId: string, answerId?: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        if (answerId) {
          // Dislike answer
          const updatedAnswers = q.answers.map(a => {
            if (a.id === answerId) {
              const wasLiked = a.isLiked;
              const wasDisliked = a.isDisliked;
              return {
                ...a,
                isLiked: false,
                isDisliked: !wasDisliked,
                likes: wasLiked ? a.likes - 1 : a.likes,
                dislikes: wasDisliked ? a.dislikes - 1 : a.dislikes + 1,
              };
            }
            return a;
          });
          return { ...q, answers: updatedAnswers };
        } else {
          // Dislike question
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
      }
      return q;
    });
    
    await saveQuestions(updatedQuestions);
  };

  const handleShare = (question: Question) => {
    Alert.alert('Share Question', `Share "${question.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => Alert.alert('Shared!', 'Question shared successfully') }
    ]);
  };

  const handleCreateQuestion = async () => {
    if (!questionTitle.trim() || !questionContent.trim() || !authorName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      title: questionTitle.trim(),
      content: questionContent.trim(),
      author: authorName.trim(),
      timestamp: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      answers: [],
      tags: questionTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      isLiked: false,
      isDisliked: false,
    };

    const updatedQuestions = [newQuestion, ...questions];
    await saveQuestions(updatedQuestions);

    // Reset form
    setQuestionTitle('');
    setQuestionContent('');
    setQuestionTags('');
    setAuthorName('');
    setShowQuestionModal(false);

    Alert.alert('Success', 'Your question has been posted successfully!');
  };

  const handleAddAnswer = async () => {
    if (!answerContent.trim() || !answerAuthor.trim() || !selectedQuestionId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newAnswer: Answer = {
      id: Date.now().toString(),
      content: answerContent.trim(),
      author: answerAuthor.trim(),
      timestamp: new Date().toLocaleString(),
      likes: 0,
      dislikes: 0,
      isLiked: false,
      isDisliked: false,
    };

    const updatedQuestions = questions.map(q => {
      if (q.id === selectedQuestionId) {
        return {
          ...q,
          answers: [...q.answers, newAnswer],
        };
      }
      return q;
    });

    await saveQuestions(updatedQuestions);

    // Reset form
    setAnswerContent('');
    setAnswerAuthor('');
    setSelectedQuestionId(null);
    setShowAnswerModal(false);

    Alert.alert('Success', 'Your answer has been posted successfully!');
  };

  const openAnswerModal = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setShowAnswerModal(true);
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
          onPress={() => setShowQuestionModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalQuestions}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalAnswers}</Text>
            <Text style={styles.statLabel}>Answers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{questions.length > 0 ? Math.floor(totalAnswers / totalQuestions * 100) / 100 : 0}</Text>
            <Text style={styles.statLabel}>Avg Answers</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {filteredQuestions.length === 0 && questions.length > 0 ? 'No matching questions' : 'Recent Questions'}
        </Text>

        {filteredQuestions.length === 0 && questions.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No Questions Yet</Text>
            <Text style={styles.emptySubtitle}>Be the first to ask a question in the community!</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => setShowQuestionModal(true)}
            >
              <Text style={styles.emptyButtonText}>Ask First Question</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredQuestions.map((question) => (
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

              {question.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {question.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

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

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => openAnswerModal(question.id)}
                >
                  <MessageSquare size={16} color="#64748B" />
                  <Text style={styles.actionText}>{question.answers.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleShare(question)}
                >
                  <Share size={16} color="#64748B" />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>

              {/* Answers Section */}
              {question.answers.length > 0 && (
                <View style={styles.answersSection}>
                  <Text style={styles.answersTitle}>Answers ({question.answers.length})</Text>
                  {question.answers.map((answer) => (
                    <View key={answer.id} style={styles.answerCard}>
                      <View style={styles.answerHeader}>
                        <View style={styles.authorInfo}>
                          <View style={styles.avatarSmall}>
                            <User size={12} color="#FFFFFF" />
                          </View>
                          <View>
                            <Text style={styles.answerAuthor}>{answer.author}</Text>
                            <Text style={styles.answerTimestamp}>{answer.timestamp}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.answerContent}>{answer.content}</Text>
                      <View style={styles.answerActions}>
                        <TouchableOpacity 
                          style={[styles.actionButtonSmall, answer.isLiked && styles.actionButtonActive]}
                          onPress={() => handleLike(question.id, answer.id)}
                        >
                          <ThumbsUp size={14} color={answer.isLiked ? '#FFFFFF' : '#64748B'} />
                          <Text style={[styles.actionTextSmall, answer.isLiked && styles.actionTextActive]}>
                            {answer.likes}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.actionButtonSmall, answer.isDisliked && styles.actionButtonDislike]}
                          onPress={() => handleDislike(question.id, answer.id)}
                        >
                          <ThumbsDown size={14} color={answer.isDisliked ? '#FFFFFF' : '#64748B'} />
                          <Text style={[styles.actionTextSmall, answer.isDisliked && styles.actionTextDislike]}>
                            {answer.dislikes}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Question Modal */}
      <Modal
        visible={showQuestionModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ask a Question</Text>
            <TouchableOpacity onPress={() => setShowQuestionModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Your Name *</Text>
            <TextInput
              style={styles.textInput}
              value={authorName}
              onChangeText={setAuthorName}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>Question Title *</Text>
            <TextInput
              style={styles.textInput}
              value={questionTitle}
              onChangeText={setQuestionTitle}
              placeholder="What's your question?"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>Question Details *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={questionContent}
              onChangeText={setQuestionContent}
              placeholder="Provide more details about your question..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
            />

            <Text style={styles.inputLabel}>Tags (comma separated)</Text>
            <TextInput
              style={styles.textInput}
              value={questionTags}
              onChangeText={setQuestionTags}
              placeholder="e.g. PNR, Booking, Train"
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleCreateQuestion}>
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Post Question</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Answer Modal */}
      <Modal
        visible={showAnswerModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Answer</Text>
            <TouchableOpacity onPress={() => setShowAnswerModal(false)}>
              <X size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Your Name *</Text>
            <TextInput
              style={styles.textInput}
              value={answerAuthor}
              onChangeText={setAnswerAuthor}
              placeholder="Enter your name"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>Your Answer *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={answerContent}
              onChangeText={setAnswerContent}
              placeholder="Share your knowledge and help others..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddAnswer}>
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Post Answer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  emptyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
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
  avatarSmall: {
    width: 24,
    height: 24,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
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
  answersSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  answersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  answerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  answerHeader: {
    marginBottom: 8,
  },
  answerAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: 'Poppins-SemiBold',
  },
  answerTimestamp: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
  },
  answerContent: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  answerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  actionTextSmall: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: 'Poppins-Bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    marginTop: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 32,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
});