-- ============================================
-- Migration: Tambah kolom supabase_id ke users
-- ============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_id UUID UNIQUE;
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- ============================================
-- Fungsi untuk increment/decrement counter
-- ============================================
CREATE OR REPLACE FUNCTION increment_discussion_likes(row_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE discussions SET likes_count = likes_count + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_discussion_likes(row_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE discussions SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_discussion_replies(row_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE discussions SET replies_count = replies_count + 1 WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_discussion_replies(row_id INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE discussions SET replies_count = GREATEST(replies_count - 1, 0) WHERE id = row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
