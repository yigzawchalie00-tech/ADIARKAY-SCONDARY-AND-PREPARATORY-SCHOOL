-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query → paste → Run

CREATE TABLE IF NOT EXISTS stats (
  id SERIAL PRIMARY KEY,
  key VARCHAR(50) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL
);

INSERT INTO stats (key, value, label) VALUES
  ('students', '1,200+', 'Students Enrolled'),
  ('teachers', '80+', 'Qualified Teachers'),
  ('grades', 'Grade 9–12', 'Secondary & Preparatory'),
  ('placement', '95%', 'University Placement')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS school_info (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL
);

INSERT INTO school_info (key, value) VALUES
  ('location', 'Adiarkay Town, North Gondar Zone, Amhara Region, Ethiopia'),
  ('office_hours', 'Monday – Friday, 8:00 AM – 5:00 PM'),
  ('phone', ''),
  ('email', ''),
  ('mission', 'To provide every student with the knowledge, skills, and values needed to excel in university education and contribute meaningfully to the development of Ethiopia.'),
  ('vision', 'To be the leading preparatory school in North Gondar, recognized for academic achievement, ethical leadership, and community service.')
ON CONFLICT (key) DO NOTHING;

CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  tag VARCHAR(50) DEFAULT 'Announcement',
  date_label VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO news (title, excerpt, tag, date_label) VALUES
  ('2017 E.C. Academic Year Registration Now Open', 'Registration for the new academic year is now open for Grade 9 and Grade 11 students. Visit the registrar with required documents.', 'Announcement', 'September 2017 E.C.'),
  ('Strong National Exam Results for Grade 12 Students', 'We congratulate our Grade 12 graduates on outstanding performance in the Ethiopian University Entrance Examination.', 'Achievement', 'August 2017 E.C.'),
  ('Annual Science Exhibition Showcases Student Innovation', 'Students from both cycles presented remarkable science projects at the annual exhibition.', 'Event', 'March 2017 E.C.');

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read stats" ON stats;
DROP POLICY IF EXISTS "Public read school_info" ON school_info;
DROP POLICY IF EXISTS "Public read news" ON news;
DROP POLICY IF EXISTS "Public read gallery" ON gallery;
DROP POLICY IF EXISTS "Admin all stats" ON stats;
DROP POLICY IF EXISTS "Admin all school_info" ON school_info;
DROP POLICY IF EXISTS "Admin all news" ON news;
DROP POLICY IF EXISTS "Admin all gallery" ON gallery;

CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read school_info" ON school_info FOR SELECT USING (true);
CREATE POLICY "Public read news" ON news FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);

CREATE POLICY "Admin all stats" ON stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all school_info" ON school_info FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all news" ON news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin all gallery" ON gallery FOR ALL USING (true) WITH CHECK (true);
