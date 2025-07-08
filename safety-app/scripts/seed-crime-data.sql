-- Insert sample crime data (simulating Kaggle dataset)
-- This represents crimes against women in different areas

INSERT INTO crime_data (latitude, longitude, crime_type, crime_category, date_occurred, time_occurred, location_description, severity_level, against_women) VALUES
-- High crime area (Red zone)
(40.7589, -73.9851, 'Harassment', 'Sexual Offense', '2024-01-15', '22:30:00', 'Times Square Area', 4, TRUE),
(40.7614, -73.9776, 'Assault', 'Violent Crime', '2024-01-20', '23:45:00', 'Near Subway Station', 5, TRUE),
(40.7505, -73.9934, 'Stalking', 'Harassment', '2024-02-01', '19:20:00', 'Central Park South', 3, TRUE),
(40.7580, -73.9855, 'Robbery', 'Property Crime', '2024-02-10', '21:15:00', 'Theater District', 4, TRUE),
(40.7600, -73.9800, 'Sexual Assault', 'Sexual Offense', '2024-02-15', '02:30:00', 'Near Hotel', 5, TRUE),

-- Medium crime area (Yellow zone)
(40.7282, -73.7949, 'Theft', 'Property Crime', '2024-01-25', '14:30:00', 'Shopping Center', 2, TRUE),
(40.7300, -73.7900, 'Harassment', 'Harassment', '2024-02-05', '18:45:00', 'Public Transport', 2, TRUE),
(40.7250, -73.7980, 'Intimidation', 'Harassment', '2024-02-12', '20:00:00', 'Parking Lot', 3, TRUE),

-- Low crime area (Green zone)
(40.6782, -73.9442, 'Petty Theft', 'Property Crime', '2024-01-30', '12:00:00', 'Park Area', 1, FALSE),
(40.6800, -73.9400, 'Vandalism', 'Property Crime', '2024-02-08', '16:30:00', 'Residential Area', 1, FALSE),

-- Additional high-risk locations
(40.7128, -74.0060, 'Assault', 'Violent Crime', '2024-01-18', '23:00:00', 'Financial District', 4, TRUE),
(40.7488, -73.9857, 'Harassment', 'Sexual Offense', '2024-01-22', '21:30:00', 'Broadway Area', 3, TRUE),
(40.7831, -73.9712, 'Stalking', 'Harassment', '2024-02-03', '19:45:00', 'Upper West Side', 3, TRUE),
(40.7505, -73.9934, 'Robbery', 'Property Crime', '2024-02-07', '22:15:00', 'Central Park', 4, TRUE),
(40.7614, -73.9776, 'Sexual Harassment', 'Sexual Offense', '2024-02-14', '20:30:00', 'Midtown East', 4, TRUE);

-- Insert more data points to create realistic heatmap zones
INSERT INTO crime_data (latitude, longitude, crime_type, crime_category, date_occurred, time_occurred, location_description, severity_level, against_women) VALUES
-- Cluster around Times Square (High danger zone)
(40.7580, -73.9857, 'Harassment', 'Sexual Offense', '2024-01-16', '22:00:00', 'Times Square', 3, TRUE),
(40.7590, -73.9850, 'Assault', 'Violent Crime', '2024-01-17', '23:30:00', 'Times Square', 4, TRUE),
(40.7585, -73.9855, 'Stalking', 'Harassment', '2024-01-19', '21:45:00', 'Times Square', 3, TRUE),
(40.7575, -73.9860, 'Robbery', 'Property Crime', '2024-01-21', '22:30:00', 'Times Square', 4, TRUE),

-- Cluster around Central Park (Medium danger zone)
(40.7829, -73.9654, 'Harassment', 'Harassment', '2024-01-23', '19:00:00', 'Central Park North', 2, TRUE),
(40.7681, -73.9781, 'Theft', 'Property Crime', '2024-01-24', '18:30:00', 'Central Park West', 2, TRUE),
(40.7794, -73.9632, 'Intimidation', 'Harassment', '2024-01-26', '20:15:00', 'Central Park East', 2, TRUE);
