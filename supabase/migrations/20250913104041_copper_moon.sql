/*
  # Create Q&A tables for community questions and answers

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `author` (text)
      - `tags` (text array)
      - `likes` (integer, default 0)
      - `dislikes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `answers`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key)
      - `content` (text)
      - `author` (text)
      - `likes` (integer, default 0)
      - `dislikes` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to create/update
*/

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  tags text[] DEFAULT '{}',
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  content text NOT NULL,
  author text NOT NULL,
  likes integer DEFAULT 0,
  dislikes integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies for questions
CREATE POLICY "Anyone can read questions"
  ON questions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create questions"
  ON questions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update question likes/dislikes"
  ON questions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for answers
CREATE POLICY "Anyone can read answers"
  ON answers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create answers"
  ON answers
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update answer likes/dislikes"
  ON answers
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_created_at ON answers(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at
  BEFORE UPDATE ON answers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();