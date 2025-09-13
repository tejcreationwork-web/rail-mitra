import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type Question = {
  id: string;
  title: string;
  content: string;
  author: string;
  tags: string[];
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  answers?: Answer[];
};

export type Answer = {
  id: string;
  question_id: string;
  content: string;
  author: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
};

// Database functions
export const qaService = {
  // Fetch all questions with their answers
  async getQuestions(): Promise<Question[]> {
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select(`
        *,
        answers (*)
      `)
      .order('created_at', { ascending: false });

    if (questionsError) {
      throw new Error(`Failed to fetch questions: ${questionsError.message}`);
    }

    return questions || [];
  },

  // Create a new question
  async createQuestion(questionData: {
    title: string;
    content: string;
    author: string;
    tags: string[];
  }): Promise<Question> {
    const { data, error } = await supabase
      .from('questions')
      .insert([questionData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create question: ${error.message}`);
    }

    return data;
  },

  // Create a new answer
  async createAnswer(answerData: {
    question_id: string;
    content: string;
    author: string;
  }): Promise<Answer> {
    const { data, error } = await supabase
      .from('answers')
      .insert([answerData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create answer: ${error.message}`);
    }

    return data;
  },

  // Update question likes/dislikes
  async updateQuestionLikes(questionId: string, likes: number, dislikes: number): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .update({ likes, dislikes })
      .eq('id', questionId);

    if (error) {
      throw new Error(`Failed to update question likes: ${error.message}`);
    }
  },

  // Update answer likes/dislikes
  async updateAnswerLikes(answerId: string, likes: number, dislikes: number): Promise<void> {
    const { error } = await supabase
      .from('answers')
      .update({ likes, dislikes })
      .eq('id', answerId);

    if (error) {
      throw new Error(`Failed to update answer likes: ${error.message}`);
    }
  },

  // Delete a question (and all its answers due to CASCADE)
  async deleteQuestion(questionId: string): Promise<void> {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      throw new Error(`Failed to delete question: ${error.message}`);
    }
  },
  // Subscribe to real-time changes
  subscribeToQuestions(callback: (questions: Question[]) => void) {
    return supabase
      .channel('questions_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'questions' },
        () => {
          // Refetch questions when changes occur
          this.getQuestions().then(callback).catch(console.error);
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'answers' },
        () => {
          // Refetch questions when answers change
          this.getQuestions().then(callback).catch(console.error);
        }
      )
      .subscribe();
  }
};