import { createClient } from '@supabase/supabase-js';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

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

/* ---------- Station Types ---------- */
export type Station = {
  stn_code: string; // Station code is the ID
  stn_name: string;
  stn_des?: string;
  lat: Float;
  lon: Float;
  amenities?: Amenity[];
};

export type Amenity = {
  id: string;
  stn_code: string; // FK to Station
  ame_name: string;
  ame_desc?: string;
  photo_url?: string | null;
  availability: string; // e.g., "24/7", "6 AM - 10 PM"
  location : string; // e.g., "Near Platform 1"
  hours : string; // e.g., "6 AM - 10 PM"
  rating : Number; // average rating
  ame_short_name : string; // short name for quick reference
  ame_type : string; // e.g., "Restroom", "Food", "ATM"
  icon_name : string; // name of the icon to represent the amenity
  // you can add detailedInfo JSON later if needed
};

// Database functions
export const qaService = {
  // Fetch all questions with their answers
  async getQuestions(): Promise<Question[]> {
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select(`
        *,
        answers(*)
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

/* ---------- Station Service ---------- */
export const stationService = {
  // Fetch all stations with their amenities
  async getStations(): Promise<Station[]> {
    const { data, error } = await supabase
      .from('stations')
      .select(`
        *,
        amenities(*)
      `);

    if (error) throw new Error(`Failed to fetch stations: ${error.message}`);
    return data || [];
  },

  // Fetch a single station by code
  async getStationByCode(stn_code: string): Promise<Station | null> {
    const { data, error } = await supabase
      .from('stations')
      .select(`*, amenities(*)`)
      .eq('stn_code', stn_code)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
      throw new Error(`Failed to fetch station: ${error.message}`);
    }

    return data;
  },

  // Add a station
  async createStation(stationData: Omit<Station, 'amenities'>): Promise<Station> {
    const { data, error } = await supabase
      .from('stations')
      .insert([stationData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create station: ${error.message}`);
    return data;
  },

  // Add an amenity
  async createAmenity(amenityData: Omit<Amenity, 'id'>): Promise<Amenity> {
    const { data, error } = await supabase
      .from('amenities')
      .insert([amenityData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create amenity: ${error.message}`);
    return data;
  },
};

