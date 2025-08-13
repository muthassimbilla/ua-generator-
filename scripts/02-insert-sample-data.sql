-- Insert sample device models
INSERT INTO device_models (model_name, min_ios_version, max_ios_version) VALUES
('iPhone14,5', '15.0', '18.3'),
('iPhone14,4', '15.0', '18.3'),
('iPhone14,3', '15.0', '18.3'),
('iPhone14,2', '15.0', '18.3'),
('iPhone13,4', '14.0', '18.3'),
('iPhone13,3', '14.0', '18.3'),
('iPhone13,2', '14.0', '18.3'),
('iPhone13,1', '14.0', '18.3'),
('iPhone12,8', '13.0', '18.3'),
('iPhone12,5', '13.0', '18.3'),
('iPhone12,3', '13.0', '18.3'),
('iPhone12,1', '13.0', '18.3');

-- Insert sample iOS versions
INSERT INTO ios_versions (version, build_number, webkit_version, usage_percentage) VALUES
('18.3', '22D63', '605.1.15', 45.0),
('18.2.1', '22C161', '605.1.15', 25.0),
('18.1.1', '22B91', '605.1.15', 15.0),
('17.7.2', '21H221', '605.1.15', 10.0),
('17.6.1', '21G93', '605.1.15', 5.0);

-- Insert sample Instagram app versions
INSERT INTO app_versions (app_type, version, build_number, usage_percentage) VALUES
('instagram', '389.0.0.49.87', '379506944', 40.0),
('instagram', '388.1.0.31.101', '378234567', 30.0),
('instagram', '387.0.0.23.105', '377123456', 20.0),
('instagram', '386.1.0.56.112', '376987654', 10.0);

-- Insert sample Facebook app versions
INSERT INTO app_versions (app_type, version, build_number, usage_percentage) VALUES
('facebook', '518.0.0.52.100', '518052100', 35.0),
('facebook', '517.1.0.48.120', '517148120', 25.0),
('facebook', '516.0.0.44.95', '516044095', 25.0),
('facebook', '515.2.0.39.88', '515239088', 15.0);

-- Insert sample configurations
INSERT INTO configurations (config_key, config_value, description) VALUES
('languages', '["en_US", "es_US", "fr_FR", "de_DE", "it_IT", "pt_BR", "ja_JP", "ko_KR"]', 'Supported language codes for user agents'),
('screen_scaling', '["2.00", "3.00"]', 'Screen scaling factors for iOS devices'),
('resolutions', '["828x1792", "1170x2532", "1242x2688", "1284x2778", "1290x2796", "1179x2556"]', 'Common iOS device resolutions');

-- Insert admin user (you'll need to update this with actual email)
INSERT INTO users (email, role, is_approved) VALUES
('admin@example.com', 'admin', true);
