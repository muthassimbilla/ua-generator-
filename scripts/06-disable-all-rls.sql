-- Disable RLS on all tables for development
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE device_models DISABLE ROW LEVEL SECURITY;
ALTER TABLE ios_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions DISABLE ROW LEVEL SECURITY;
ALTER TABLE configurations DISABLE ROW LEVEL SECURITY;
ALTER TABLE generation_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE blacklisted_user_agents DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Allow read all users" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

DROP POLICY IF EXISTS "Authenticated users can read device_models" ON device_models;
DROP POLICY IF EXISTS "Allow authenticated manage" ON device_models;
DROP POLICY IF EXISTS "Allow authenticated read" ON device_models;

DROP POLICY IF EXISTS "Authenticated users can read ios_versions" ON ios_versions;
DROP POLICY IF EXISTS "Allow authenticated manage" ON ios_versions;
DROP POLICY IF EXISTS "Allow authenticated read" ON ios_versions;

DROP POLICY IF EXISTS "Authenticated users can read app_versions" ON app_versions;
DROP POLICY IF EXISTS "Allow authenticated manage" ON app_versions;
DROP POLICY IF EXISTS "Allow authenticated read" ON app_versions;

DROP POLICY IF EXISTS "Authenticated users can read configurations" ON configurations;
DROP POLICY IF EXISTS "Allow authenticated manage" ON configurations;
DROP POLICY IF EXISTS "Allow authenticated read" ON configurations;

DROP POLICY IF EXISTS "Users can manage their own generation_history" ON generation_history;
DROP POLICY IF EXISTS "Users can manage own generation_history" ON generation_history;

DROP POLICY IF EXISTS "Users can manage their own blacklisted_user_agents" ON blacklisted_user_agents;
DROP POLICY IF EXISTS "Users can manage own blacklisted_user_agents" ON blacklisted_user_agents;
