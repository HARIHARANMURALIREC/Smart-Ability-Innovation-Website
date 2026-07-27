-- ==========================================================
-- SMART ABILITY HACKATHON DATABASE
-- Run in Supabase SQL Editor for a NEW project
-- Columns are lowercase to match the frontend services
-- ==========================================================

DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-------------------------------------------------------------
-- TEAMS
-------------------------------------------------------------

CREATE TABLE teams (
    id TEXT PRIMARY KEY,
    teamname TEXT NOT NULL UNIQUE,
    leadername TEXT NOT NULL,
    leaderemail TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    college TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    mobile TEXT,
    members JSONB DEFAULT '[]'::jsonb,
    memberscomplete BOOLEAN DEFAULT FALSE,
    -- Free-text id from frontend abstracts (ps_001…) — no FK
    selectedprojectid TEXT,
    pdfname TEXT,
    pdfurl TEXT,
    submissionstatus TEXT DEFAULT 'not_started',
    submissiondate TIMESTAMP,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE team_members (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    status TEXT DEFAULT 'accepted',
    joined_at TIMESTAMP,
    createdat TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_team_email ON teams(leaderemail);
CREATE INDEX idx_team_name ON teams(teamname);
CREATE INDEX idx_member_team ON team_members(team_id);
CREATE INDEX idx_member_email ON team_members(email);

-------------------------------------------------------------
-- PROJECTS & SUBMISSIONS
-------------------------------------------------------------

CREATE TABLE projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    abstract TEXT NOT NULL,
    problem_statement TEXT,
    difficulty TEXT DEFAULT 'beginner',
    domain TEXT,
    technology TEXT,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
);

CREATE TABLE submissions (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    project_id TEXT,
    pdfname TEXT,
    fileurl TEXT,
    status TEXT DEFAULT 'draft',
    score NUMERIC(5,2),
    feedback TEXT,
    submittedat TIMESTAMP,
    evaluatedat TIMESTAMP,
    createdat TIMESTAMP DEFAULT NOW(),
    updatedat TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_project_title ON projects(title);
CREATE INDEX idx_project_difficulty ON projects(difficulty);
CREATE INDEX idx_submission_team ON submissions(team_id);
CREATE INDEX idx_submission_status ON submissions(status);

-------------------------------------------------------------
-- ACTIVITY LOGS
-------------------------------------------------------------

CREATE TABLE activity_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    createdat TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_action ON activity_logs(action);
CREATE INDEX idx_activity_created ON activity_logs(createdat);

-------------------------------------------------------------
-- updatedat TRIGGER
-------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updatedat_column()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updatedat = NOW();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_teams
BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

CREATE TRIGGER trigger_update_projects
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

CREATE TRIGGER trigger_update_submissions
BEFORE UPDATE ON submissions
FOR EACH ROW EXECUTE FUNCTION update_updatedat_column();

-------------------------------------------------------------
-- RLS (open for current frontend + anon key architecture)
-- Tighten before storing sensitive production data
-------------------------------------------------------------

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all teams" ON teams;
DROP POLICY IF EXISTS "Allow all members" ON team_members;
DROP POLICY IF EXISTS "Allow all projects" ON projects;
DROP POLICY IF EXISTS "Allow all submissions" ON submissions;
DROP POLICY IF EXISTS "Allow all activity_logs" ON activity_logs;

CREATE POLICY "Allow all teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all members" ON team_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all submissions" ON submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all activity_logs" ON activity_logs FOR ALL USING (true) WITH CHECK (true);

-------------------------------------------------------------
-- SAMPLE PROJECTS
-------------------------------------------------------------

INSERT INTO projects (id, title, abstract, problem_statement, difficulty, domain, technology)
VALUES
(
    'P001',
    'Smart Wheelchair',
    'AI powered wheelchair navigation',
    'Assist physically challenged people',
    'beginner',
    'Healthcare',
    'React, Python'
),
(
    'P002',
    'Sign Language Translator',
    'Convert sign language into text and speech',
    'Assist hearing impaired people',
    'intermediate',
    'AI',
    'Python, OpenCV'
),
(
    'P003',
    'Smart Classroom',
    'AI classroom assistant for disabled students',
    'Inclusive education',
    'advanced',
    'Education',
    'React, TensorFlow'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- If upgrading an EXISTING database that still has the
-- selectedprojectid → projects FK (breaks ps_001 ids), run:
--
--   ALTER TABLE teams DROP CONSTRAINT IF EXISTS fk_selected_project;
--
-- For PDF upload / admin view+download, run separately:
--   STORAGE_SETUP.sql
-- ==========================================================
