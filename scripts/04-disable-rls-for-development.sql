-- ONLY FOR DEVELOPMENT - Disable RLS temporarily
-- DO NOT USE IN PRODUCTION

-- Disable RLS on users table for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or keep RLS enabled but create a very permissive policy
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Allow all operations" ON users;
-- CREATE POLICY "Allow all operations" ON users FOR ALL USING (true) WITH CHECK (true);
