import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Share, Search, Plus, User, Clock, Send, X, Trash2, MoveVertical as MoreVertical } from 'lucide-react-native';
import { supabase, qaService, Question, Answer } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserVote = {
  questionId?: string;
  answerId?: string;
  voteType: 'like' | 'dislike';
};
export default function QAScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showAnswersView, setShowAnswersView] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [userQuestions, setUserQuestions] = useState<string[]>([]);
  const [showQuestionOptions, setShowQuestionOptions] = useState<string | null>(null);
  
  // Question form state
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionTags, setQuestionTags] = useState('');
  const [authorName, setAuthorName] = useState('');
  
  // Answer form state
  const [answerContent, setAnswerContent] = useState('');
  const [answerAuthor, setAnswerAuthor] = useState('');

  // Load user votes from storage
  const loadUserVotes = async () => {
    try {
      const savedVotes = await AsyncStorage.getItem('userVotes');
      if (savedVotes) {
        setUserVotes(JSON.parse(savedVotes));
      }
    } catch (error) {
      console.error('Error loading user votes:', error);
    }
  };

  // Load user's posted questions from storage
  const loadUserQuestions = async () => {
    try {
      const savedQuestions = await AsyncStorage.getItem('userQuestions');
      if (savedQuestions) {
        setUserQuestions(JSON.parse(savedQuestions));
      }
    } catch (error) {
      console.error('Error loading user questions:', error);
    }
  };

  // Save user's posted questions to storage
  const saveUserQuestions = async (questionIds: string[]) => {
    try {
      await AsyncStorage.setItem('userQuestions', JSON.stringify(questionIds));
      setUserQuestions(questionIds);
    } catch (error) {
      console.error('Error saving user questions:', error);
    }
  };
  // Save user votes to storage
  const saveUserVotes = async (votes: UserVote[]) => {
    try {
      await AsyncStorage.setItem('userVotes', JSON.stringify(votes));
      setUserVotes(votes);
    } catch (error) {
      console.error('Error saving user votes:', error);
    }
  };

  // Check if user has voted on a question/answer
  const getUserVote = (questionId: string, answerId?: string): 'like' | 'dislike' | null => {
    const vote = userVotes.find(v => 
      v.questionId === questionId && v.answerId === answerId
    );
    return vote ? vote.voteType : null;
  };

  // Check if user has liked a question/answer
  const hasUserLiked = (questionId: string, answerId?: string): boolean => {
    return getUserVote(questionId, answerId) === 'like';
  };

  // Check if user has disliked a question/answer
  const hasUserDisliked = (questionId: string, answerId?: string): boolean => {
    return getUserVote(questionId, answerId) === 'dislike';
  };
  // Load questions from Supabase
  // Check if user can delete a question (they posted it)
  const canDeleteQuestion = (questionId: string): boolean => {
    return userQuestions.includes(questionId);
  };
  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      const fetchedQuestions = await qaService.getQuestions();
      setQuestions(fetchedQuestions);
      setTotalQuestions(fetchedQuestions.length);
      setTotalAnswers(fetchedQuestions.reduce((total, q) => total + (q.answers?.length || 0), 0));
    } catch (error) {
      console.error('Error loading questions:', error);
      Alert.alert('Error', 'Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserVotes();
    loadUserQuestions();
    loadQuestions();

    // Subscribe to real-time updates
    const subscription = qaService.subscribeToQuestions((updatedQuestions) => {
      setQuestions(updatedQuestions);
      setTotalQuestions(updatedQuestions.length);
      setTotalAnswers(updatedQuestions.reduce((total, q) => total + (q.answers?.length || 0), 0));
    });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleLike = async (questionId: string, answerId?: string) => {
    try {
      const currentVote = getUserVote(questionId, answerId);
      let newVotes = [...userVotes];
      
      // Remove existing vote if any
      newVotes = newVotes.filter(v => !(v.questionId === questionId && v.answerId === answerId));
      
      if (answerId) {
        // Like/unlike answer
        const question = questions.find(q => q.id === questionId);
        const answer = question?.answers?.find(a => a.id === answerId);
        if (!answer) return;

        let newLikes = answer.likes;
        let newDislikes = answer.dislikes;
        
        if (currentVote === 'like') {
          // Remove like
          newLikes = Math.max(0, answer.likes - 1);
        } else {
          // Add like
          newLikes = answer.likes + 1;
          // Remove dislike if it exists
          if (currentVote === 'dislike') {
            newDislikes = Math.max(0, answer.dislikes - 1);
          }
          // Add new vote
          newVotes.push({ questionId, answerId, voteType: 'like' });
        }
        await qaService.updateAnswerLikes(answerId, newLikes, newDislikes);
      } else {
        // Like/unlike question
        const question = questions.find(q => q.id === questionId);
        if (!question) return;

        let newLikes = question.likes;
        let newDislikes = question.dislikes;
        
        if (currentVote === 'like') {
          // Remove like
          newLikes = Math.max(0, question.likes - 1);
        } else {
          // Add like
          newLikes = question.likes + 1;
          // Remove dislike if it exists
          if (currentVote === 'dislike') {
            newDislikes = Math.max(0, question.dislikes - 1);
          }
          // Add new vote
          newVotes.push({ questionId, voteType: 'like' });
        }
        await qaService.updateQuestionLikes(questionId, newLikes, newDislikes);
      }
      
      // Save updated votes
      await saveUserVotes(newVotes);
      
      // Reload questions to get updated data
      await loadQuestions();
    } catch (error) {
      console.error('Error updating likes:', error);
      Alert.alert('Error', 'Failed to update likes. Please try again.');
    }
  };

  const handleDislike = async (questionId: string, answerId?: string) => {
    try {
      const currentVote = getUserVote(questionId, answerId);
      let newVotes = [...userVotes];
      
      // Remove existing vote if any
      newVotes = newVotes.filter(v => !(v.questionId === questionId && v.answerId === answerId));
      
      if (answerId) {
        // Dislike answer
        const question = questions.find(q => q.id === questionId);
        const answer = question?.answers?.find(a => a.id === answerId);
        if (!answer) return;

        let newLikes = answer.likes;
        let newDislikes = answer.dislikes;
        
        if (currentVote === 'dislike') {
          // Remove dislike
          newDislikes = Math.max(0, answer.dislikes - 1);
        } else {
          // Add dislike
          newDislikes = answer.dislikes + 1;
          // Remove like if it exists
          if (currentVote === 'like') {
            newLikes = Math.max(0, answer.likes - 1);
          }
          // Add new vote
          newVotes.push({ questionId, answerId, voteType: 'dislike' });
        }
        await qaService.updateAnswerLikes(answerId, newLikes, newDislikes);
      } else {
        // Dislike question
        const question = questions.find(q => q.id === questionId);
        if (!question) return;

        let newLikes = question.likes;
        let newDislikes = question.dislikes;
        
        if (currentVote === 'dislike') {
          // Remove dislike
          newDislikes = Math.max(0, question.dislikes - 1);
        } else {
          // Add dislike
          newDislikes = question.dislikes + 1;
          // Remove like if it exists
          if (currentVote === 'like') {
            newLikes = Math.max(0, question.likes - 1);
          }
          // Add new vote
          newVotes.push({ questionId, voteType: 'dislike' });
        }
        await qaService.updateQuestionLikes(questionId, newLikes, newDislikes);
      }
      
      // Save updated votes
      await saveUserVotes(newVotes);
      
      // Reload questions to get updated data
      await loadQuestions();
    } catch (error) {
      console.error('Error updating dislikes:', error);
      Alert.alert('Error', 'Failed to update dislikes. Please try again.');
    }
  };

  const handleShare = (question: Question) => {
    Alert.alert('Share Question', `Share "${question.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Share', onPress: () => Alert.alert('Shared!', 'Question shared successfully') }
    ]);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await qaService.deleteQuestion(questionId);
              
              // Remove from user's posted questions
              const updatedUserQuestions = userQuestions.filter(id => id !== questionId);
              await saveUserQuestions(updatedUserQuestions);
              
              // Remove any votes for this question
              const updatedVotes = userVotes.filter(vote => vote.questionId !== questionId);
              await saveUserVotes(updatedVotes);
              
              Alert.alert('Success', 'Question deleted successfully');
              
              // Reload questions
              await loadQuestions();
            } catch (error) {
              console.error('Error deleting question:', error);
              Alert.alert('Error', 'Failed to delete question. Please try again.');
            }
          },
        },
      ]
    );
  };
  const handleCreateQuestion = async () => {
    if (!questionTitle.trim() || !questionContent.trim() || !authorName.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const newQuestion = await qaService.createQuestion({
        title: questionTitle.trim(),
        content: questionContent.trim(),
        author: authorName.trim(),
        tags: questionTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      });

      // Add this question to user's posted questions
      const updatedUserQuestions = [...userQuestions, newQuestion.id];
      await saveUserQuestions(updatedUserQuestions);
      // Reset form
      setQuestionTitle('');
      setQuestionContent('');
      setQuestionTags('');
      setAuthorName('');
      setShowQuestionModal(false);

      Alert.alert('Success', 'Your question has been posted successfully!');
      
      // Reload questions
      await loadQuestions();
    } catch (error) {
      console.error('Error creating question:', error);
      Alert.alert('Error', 'Failed to post question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnswer = async () => {
    if (!answerContent.trim() || !answerAuthor.trim() || !selectedQuestionId) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await qaService.createAnswer({
        question_id: selectedQuestionId,
        content: answerContent.trim(),
        author: answerAuthor.trim(),
      });

      // Reset form
      setAnswerContent('');
      setAnswerAuthor('');
      setSelectedQuestionId(null);
      setShowAnswerModal(false);

      Alert.alert('Success', 'Your answer has been posted successfully!');
      
      // Reload questions
      await loadQuestions();
    } catch (error) {
      console.error('Error creating answer:', error);
      Alert.alert('Error', 'Failed to post answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAnswerModal = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setShowAnswerModal(true);
  };

  const openAnswersView = (question: Question) => {
    setSelectedQuestion(question);
    setSelectedQuestionId(question.id);
    setShowAnswersView(true);
  };

  const closeAnswersView = () => {
    setShowAnswersView(false);
    setSelectedQuestion(null);
    setSelectedQuestionId(null);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredQuestions = questions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Q&A Community</Text>
          <Text style={styles.headerSubtitle}>Ask questions, share knowledge</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading questions...</Text>
        </View>
      </View>
    );
  }

  // Answers View
  if (showAnswersView && selectedQuestion) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={closeAnswersView} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Answers</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Question Card */}
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.authorInfo}>
                <View style={styles.avatar}>
                  <User size={16} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.authorName}>{selectedQuestion.author}</Text>
                  <View style={styles.timestampContainer}>
                    <Clock size={12} color="#94A3B8" />
                    <Text style={styles.timestamp}>{formatTimestamp(selectedQuestion.created_at)}</Text>
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.questionTitle}>{selectedQuestion.title}</Text>
            <Text style={styles.questionContent}>{selectedQuestion.content}</Text>

            {selectedQuestion.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {selectedQuestion.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.questionActions}>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  hasUserLiked(selectedQuestion.id) && styles.actionButtonActive
                ]}
                onPress={() => handleLike(selectedQuestion.id)}
              >
                <ThumbsUp 
                  size={16} 
                  color={hasUserLiked(selectedQuestion.id) ? "#2563EB" : "#64748B"} 
                />
                <Text style={styles.actionText}>{selectedQuestion.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  hasUserDisliked(selectedQuestion.id) && styles.actionButtonActive
                ]}
                onPress={() => handleDislike(selectedQuestion.id)}
              >
                <ThumbsDown 
                  size={16} 
                  color={hasUserDisliked(selectedQuestion.id) ? "#DC2626" : "#64748B"} 
                />
                <Text style={styles.actionText}>{selectedQuestion.dislikes}</Text>
              </TouchableOpacity>

              <View style={styles.actionButton}>
                <MessageSquare size={16} color="#64748B" />
                <Text style={styles.actionText}>{selectedQuestion.answers?.length || 0}</Text>
              </View>
            </View>
          </View>

          {/* Add Answer Button */}
          <View style={styles.addAnswerContainer}>
            <TouchableOpacity 
              style={styles.addAnswerButton}
              onPress={() => {
                setShowAnswerModal(true);
              }}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addAnswerButtonText}>Add Answer</Text>
            </TouchableOpacity>
          </View>

          {/* Answers Section */}
          <View style={styles.answersSection}>
            <Text style={styles.answersTitle}>
              {selectedQuestion.answers?.length || 0} Answer{(selectedQuestion.answers?.length || 0) !== 1 ? 's' : ''}
            </Text>
            
            {selectedQuestion.answers && selectedQuestion.answers.length > 0 ? (
              selectedQuestion.answers.map((answer) => (
                <View key={answer.id} style={styles.answerCard}>
                  <View style={styles.answerHeader}>
                    <View style={styles.authorInfo}>
                      <View style={styles.avatarSmall}>
                        <User size={12} color="#FFFFFF" />
                      </View>
                      <View>
                        <Text style={styles.answerAuthor}>{answer.author}</Text>
                        <Text style={styles.answerTimestamp}>{formatTimestamp(answer.created_at)}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.answerContent}>{answer.content}</Text>
                  <View style={styles.answerActions}>
                    <TouchableOpacity 
                      style={[
                        styles.actionButtonSmall,
                        hasUserLiked(selectedQuestion.id, answer.id) && styles.actionButtonSmallActive
                      ]}
                      onPress={() => handleLike(selectedQuestion.id, answer.id)}
                    >
                      <ThumbsUp 
                        size={14} 
                        color={hasUserLiked(selectedQuestion.id, answer.id) ? "#2563EB" : "#64748B"} 
                      />
                      <Text style={styles.actionTextSmall}>{answer.likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[
                        styles.actionButtonSmall,
                        hasUserDisliked(selectedQuestion.id, answer.id) && styles.actionButtonSmallActive
                      ]}
                      onPress={() => handleDislike(selectedQuestion.id, answer.id)}
                    >
                      <ThumbsDown 
                        size={14} 
                        color={hasUserDisliked(selectedQuestion.id, answer.id) ? "#DC2626" : "#64748B"} 
                      />
                      <Text style={styles.actionTextSmall}>{answer.dislikes}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noAnswersState}>
                <MessageSquare size={48} color="#94A3B8" />
                <Text style={styles.noAnswersTitle}>No Answers Yet</Text>
                <Text style={styles.noAnswersSubtitle}>Be the first to answer this question!</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
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
            <Text style={styles.statNumber}>{totalQuestions > 0 ? Math.floor(totalAnswers / totalQuestions * 100) / 100 : 0}</Text>
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
                      <Text style={styles.timestamp}>{formatTimestamp(question.created_at)}</Text>
                    </View>
                  </View>
                </View>
                {canDeleteQuestion(question.id) && (
                  <TouchableOpacity
                    style={styles.optionsButton}
                    onPress={() => setShowQuestionOptions(showQuestionOptions === question.id ? null : question.id)}
                  >
                    <MoreVertical size={20} color="#64748B" />
                  </TouchableOpacity>
                )}
              </View>

              {showQuestionOptions === question.id && canDeleteQuestion(question.id) && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteQuestion(question.id)}
                >
                  <Trash2 size={18} color="#DC2626" />
                </TouchableOpacity>
              )}
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
                  style={[
                    styles.actionButton,
                    hasUserLiked(question.id) && styles.actionButtonActive
                  ]}
                  onPress={() => handleLike(question.id)}
                >
                  <ThumbsUp 
                    size={16} 
                    color={hasUserLiked(question.id) ? "#2563EB" : "#64748B"} 
                  />
                  <Text style={styles.actionText}>{question.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.actionButton,
                    hasUserDisliked(question.id) && styles.actionButtonActive
                  ]}
                  onPress={() => handleDislike(question.id)}
                >
                  <ThumbsDown 
                    size={16} 
                    color={hasUserDisliked(question.id) ? "#DC2626" : "#64748B"} 
                  />
                  <Text style={styles.actionText}>{question.dislikes}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => openAnswersView(question)}
                >
                  <MessageSquare size={16} color="#64748B" />
                  <Text style={styles.actionText}>{question.answers?.length || 0}</Text>
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
              {question.answers && question.answers.length > 0 && (
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
                            <Text style={styles.answerTimestamp}>{formatTimestamp(answer.created_at)}</Text>
                          </View>
                        </View>
                      </View>
                      <Text style={styles.answerContent}>{answer.content}</Text>
                      <View style={styles.answerActions}>
                        <TouchableOpacity 
                          style={[
                            styles.actionButtonSmall,
                            hasUserLiked(question.id, answer.id) && styles.actionButtonSmallActive
                          ]}
                          onPress={() => handleLike(question.id, answer.id)}
                        >
                          <ThumbsUp 
                            size={14} 
                            color={hasUserLiked(question.id, answer.id) ? "#2563EB" : "#64748B"} 
                          />
                          <Text style={styles.actionTextSmall}>{answer.likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[
                            styles.actionButtonSmall,
                            hasUserDisliked(question.id, answer.id) && styles.actionButtonSmallActive
                          ]}
                          onPress={() => handleDislike(question.id, answer.id)}
                        >
                          <ThumbsDown 
                            size={14} 
                            color={hasUserDisliked(question.id, answer.id) ? "#DC2626" : "#64748B"} 
                          />
                          <Text style={styles.actionTextSmall}>{answer.dislikes}</Text>
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

            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
              onPress={handleCreateQuestion}
              disabled={isSubmitting}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Posting...' : 'Post Question'}
              </Text>
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

            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
              onPress={handleAddAnswer}
              disabled={isSubmitting}
            >
              <Send size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Posting...' : 'Post Answer'}
              </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  optionsButton: {
    padding: 8,
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
    backgroundColor: '#EBF4FF',
  },
  actionText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
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
  actionButtonSmallActive: {
    backgroundColor: '#EBF4FF',
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
    marginTop: 24,
    marginBottom: 40,
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  placeholder: {
    width: 60,
  },
  addAnswerContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  addAnswerButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addAnswerButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: 'Inter-SemiBold',
  },
  noAnswersState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAnswersTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  noAnswersSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  deleteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
});