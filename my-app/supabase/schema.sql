-- Supabase Database Schema for Calorie Tracker

-- Food table (replaces the in-memory defaultFoods)
CREATE TABLE IF NOT EXISTS foods (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  carbs DECIMAL(5,2) NOT NULL,
  fat DECIMAL(5,2) NOT NULL,
  protein DECIMAL(5,2) NOT NULL,
  image TEXT DEFAULT '🍽️',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily intake table
CREATE TABLE IF NOT EXISTS daily_intakes (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  carbs DECIMAL(5,2) NOT NULL DEFAULT 0,
  fat DECIMAL(5,2) NOT NULL DEFAULT 0,
  protein DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create unique constraint for one entry per day
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_intakes_date ON daily_intakes(date);

-- Insert default foods
INSERT INTO foods (name, carbs, fat, protein, image) VALUES
  ('Oats', 27, 3, 5, '🥣'),
  ('Chicken Breast', 0, 1, 31, '🍗'),
  ('Rice', 28, 0, 3, '🍚'),
  ('Egg', 1, 5, 6, '🥚'),
  ('Banana', 23, 0, 1, '🍌'),
  ('Milk', 12, 5, 8, '🥛'),
  ('Bread', 13, 1, 4, '🍞'),
  ('Almonds', 6, 14, 6, '🥜')
ON CONFLICT DO NOTHING;
