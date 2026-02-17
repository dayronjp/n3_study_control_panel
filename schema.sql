-- ============================================================
-- N3 Study Control Panel — Schema SQL
-- Compatible with Neon PostgreSQL
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL DEFAULT 'Estudante',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- study_weeks
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS study_weeks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  streak     INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, week_start)
);

-- -------------------------------------------------------
-- study_days
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS study_days (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id       UUID NOT NULL REFERENCES study_weeks(id) ON DELETE CASCADE,
  day_name      TEXT NOT NULL,
  focus         TEXT NOT NULL,
  completed     BOOLEAN NOT NULL DEFAULT FALSE,
  total_minutes INTEGER NOT NULL DEFAULT 0
);

-- -------------------------------------------------------
-- tasks
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_day_id UUID NOT NULL REFERENCES study_days(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  minutes      INTEGER NOT NULL DEFAULT 0,
  completed    BOOLEAN NOT NULL DEFAULT FALSE
);

-- -------------------------------------------------------
-- Indexes for performance
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_study_weeks_user_id ON study_weeks(user_id);
CREATE INDEX IF NOT EXISTS idx_study_weeks_week_start ON study_weeks(week_start);
CREATE INDEX IF NOT EXISTS idx_study_days_week_id ON study_days(week_id);
CREATE INDEX IF NOT EXISTS idx_tasks_study_day_id ON tasks(study_day_id);
