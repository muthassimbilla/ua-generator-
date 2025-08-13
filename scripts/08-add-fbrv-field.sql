-- Add FBRV field to app_versions table
ALTER TABLE app_versions 
ADD COLUMN IF NOT EXISTS fbrv TEXT DEFAULT NULL;

-- Update existing Facebook app versions with sample FBRV values
UPDATE app_versions 
SET fbrv = CASE 
  WHEN app_type = 'facebook' AND version = '518.0.0.52.100' THEN '752257486'
  WHEN app_type = 'facebook' AND version = '517.1.0.48.120' THEN '751234567'
  WHEN app_type = 'facebook' AND version = '516.0.0.44.95' THEN '750987654'
  WHEN app_type = 'facebook' AND version = '515.2.0.39.88' THEN '749876543'
  ELSE NULL
END
WHERE app_type = 'facebook';
