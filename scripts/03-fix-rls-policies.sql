-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Allow authenticated manage" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Create more permissive policies for testing
-- Allow anyone to insert into users table (for registration)
CREATE POLICY "Allow user registration" ON users 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to read their own data
CREATE POLICY "Users can read own data" ON users 
  FOR SELECT 
  USING (email = auth.email() OR auth.email() IS NULL);

-- Allow users to update their own data
CREATE POLICY "Users can update own data" ON users 
  FOR UPDATE 
  USING (email = auth.email() OR auth.email() IS NULL);

-- For development: Allow reading all users (you can restrict this later)
CREATE POLICY "Allow read all users" ON users 
  FOR SELECT 
  USING (true);

-- Allow admins to manage all users
CREATE POLICY "Admins can manage all users" ON users 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = auth.email() 
      AND role = 'admin' 
      AND is_approved = true
    )
  );
