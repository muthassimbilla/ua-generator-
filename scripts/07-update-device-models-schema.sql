-- Add new columns to device_models table for resolutions and screen_scaling
ALTER TABLE device_models 
ADD COLUMN IF NOT EXISTS resolutions TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS screen_scaling TEXT[] DEFAULT '{}';

-- Update existing device models with appropriate resolutions and screen_scaling
UPDATE device_models SET 
  resolutions = CASE 
    WHEN model_name LIKE 'iPhone14%' THEN ARRAY['1179x2556', '1290x2796']
    WHEN model_name LIKE 'iPhone13%' THEN ARRAY['1170x2532', '1284x2778'] 
    WHEN model_name LIKE 'iPhone12%' THEN ARRAY['828x1792', '1170x2532', '1242x2688']
    ELSE ARRAY['828x1792', '1170x2532']
  END,
  screen_scaling = CASE
    WHEN model_name LIKE 'iPhone14%' THEN ARRAY['3.00']
    WHEN model_name LIKE 'iPhone13%' THEN ARRAY['3.00']
    WHEN model_name LIKE 'iPhone12%' THEN ARRAY['2.00', '3.00']
    ELSE ARRAY['2.00', '3.00']
  END
WHERE resolutions = '{}' OR screen_scaling = '{}';

-- Remove old global configurations that are now device-specific
DELETE FROM configurations WHERE config_key IN ('resolutions', 'screen_scaling');
