-- Enable RLS (Row Level Security)

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  is_approved BOOLEAN DEFAULT false,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create device_models table
CREATE TABLE IF NOT EXISTS device_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  min_ios_version TEXT NOT NULL,
  max_ios_version TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ios_versions table
CREATE TABLE IF NOT EXISTS ios_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version TEXT NOT NULL,
  build_number TEXT NOT NULL,
  webkit_version TEXT NOT NULL,
  usage_percentage DECIMAL(5,2) DEFAULT 10.0 CHECK (usage_percentage >= 0 AND usage_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_versions table
CREATE TABLE IF NOT EXISTS app_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_type TEXT NOT NULL CHECK (app_type IN ('instagram', 'facebook')),
  version TEXT NOT NULL,
  build_number TEXT NOT NULL,
  usage_percentage DECIMAL(5,2) DEFAULT 10.0 CHECK (usage_percentage >= 0 AND usage_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create configurations table
CREATE TABLE IF NOT EXISTS configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value TEXT NOT NULL,
  description TEXT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create generation_history table
CREATE TABLE IF NOT EXISTS generation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_type TEXT NOT NULL CHECK (app_type IN ('instagram', 'facebook')),
  quantity INTEGER NOT NULL,
  user_agents TEXT[] NOT NULL,
  is_downloaded BOOLEAN DEFAULT false,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blacklisted_user_agents table
CREATE TABLE IF NOT EXISTS blacklisted_user_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_agent TEXT NOT NULL,
  hash TEXT NOT NULL,
  downloaded_by TEXT NOT NULL,
  app_type TEXT NOT NULL CHECK (app_type IN ('instagram', 'facebook')),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_device_models_active ON device_models(is_active);
CREATE INDEX IF NOT EXISTS idx_ios_versions_active ON ios_versions(is_active);
CREATE INDEX IF NOT EXISTS idx_app_versions_active_type ON app_versions(is_active, app_type);
CREATE INDEX IF NOT EXISTS idx_blacklisted_hash ON blacklisted_user_agents(hash);
CREATE INDEX IF NOT EXISTS idx_generation_history_created_by ON generation_history(created_by);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ios_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE blacklisted_user_agents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.email() = email);
CREATE POLICY "Admins can view all users" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'admin')
);

-- Allow all authenticated users to read device_models, ios_versions, app_versions, configurations
CREATE POLICY "Authenticated users can read device_models" ON device_models FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage device_models" ON device_models FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'admin')
);

CREATE POLICY "Authenticated users can read ios_versions" ON ios_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage ios_versions" ON ios_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'admin')
);

CREATE POLICY "Authenticated users can read app_versions" ON app_versions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage app_versions" ON app_versions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'admin')
);

CREATE POLICY "Authenticated users can read configurations" ON configurations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage configurations" ON configurations FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE email = auth.email() AND role = 'admin')
);

-- Users can manage their own generation history
CREATE POLICY "Users can manage their own generation_history" ON generation_history FOR ALL USING (created_by = auth.email());

-- Users can manage their own blacklisted user agents
CREATE POLICY "Users can manage their own blacklisted_user_agents" ON blacklisted_user_agents FOR ALL USING (downloaded_by = auth.email());
