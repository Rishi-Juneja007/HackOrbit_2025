-- Drop existing tables and recreate with India-specific structure
DROP TABLE IF EXISTS crime_data CASCADE;
DROP TABLE IF EXISTS location_tracking CASCADE;
DROP TABLE IF EXISTS emergency_alerts CASCADE;

-- Create India crime data table based on typical Kaggle datasets structure
CREATE TABLE IF NOT EXISTS india_crime_data (
    id SERIAL PRIMARY KEY,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    crime_head VARCHAR(200) NOT NULL,
    cases_reported INTEGER DEFAULT 0,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INTEGER,
    crime_rate DECIMAL(10, 4), -- crimes per 100,000 population
    severity_score INTEGER DEFAULT 1, -- 1-5 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample India women crime data (based on NCRB data structure)
INSERT INTO india_crime_data (state, district, year, crime_head, cases_reported, latitude, longitude, population, crime_rate, severity_score) VALUES
-- Delhi - High crime areas
('Delhi', 'New Delhi', 2023, 'Rape', 1200, 28.6139, 77.2090, 1400000, 85.7, 5),
('Delhi', 'South Delhi', 2023, 'Dowry Deaths', 45, 28.5355, 77.2490, 2700000, 1.7, 5),
('Delhi', 'North Delhi', 2023, 'Domestic Violence', 890, 28.7041, 77.1025, 900000, 98.9, 4),
('Delhi', 'East Delhi', 2023, 'Sexual Harassment', 567, 28.6508, 77.2773, 1700000, 33.4, 3),
('Delhi', 'West Delhi', 2023, 'Assault on Women', 234, 28.6692, 77.1100, 2500000, 9.4, 4),

-- Mumbai - Moderate to high crime areas
('Maharashtra', 'Mumbai City', 2023, 'Rape', 800, 19.0760, 72.8777, 12400000, 6.5, 4),
('Maharashtra', 'Mumbai Suburban', 2023, 'Eve Teasing', 456, 19.1136, 72.8697, 9300000, 4.9, 2),
('Maharashtra', 'Thane', 2023, 'Domestic Violence', 234, 19.2183, 72.9781, 1800000, 13.0, 3),

-- Kolkata - Moderate crime areas
('West Bengal', 'Kolkata', 2023, 'Rape', 345, 22.5726, 88.3639, 4500000, 7.7, 3),
('West Bengal', 'North 24 Parganas', 2023, 'Trafficking', 123, 22.6757, 88.4328, 10000000, 1.2, 5),
('West Bengal', 'South 24 Parganas', 2023, 'Sexual Harassment', 189, 22.1667, 88.2833, 8100000, 2.3, 2),

-- Chennai - Low to moderate crime areas
('Tamil Nadu', 'Chennai', 2023, 'Rape', 234, 13.0827, 80.2707, 4700000, 5.0, 3),
('Tamil Nadu', 'Kanchipuram', 2023, 'Domestic Violence', 156, 12.8342, 79.7036, 3900000, 4.0, 2),

-- Bangalore - Moderate crime areas
('Karnataka', 'Bengaluru Urban', 2023, 'Rape', 456, 12.9716, 77.5946, 8400000, 5.4, 3),
('Karnataka', 'Bengaluru Rural', 2023, 'Sexual Harassment', 89, 13.1986, 77.7066, 990000, 9.0, 2),

-- Hyderabad - Low to moderate crime areas
('Telangana', 'Hyderabad', 2023, 'Rape', 234, 17.3850, 78.4867, 6900000, 3.4, 2),
('Telangana', 'Rangareddy', 2023, 'Domestic Violence', 123, 17.4065, 78.5691, 5200000, 2.4, 2),

-- Pune - Moderate crime areas
('Maharashtra', 'Pune', 2023, 'Rape', 345, 18.5204, 73.8567, 3100000, 11.1, 3),
('Maharashtra', 'Pimpri-Chinchwad', 2023, 'Sexual Harassment', 167, 18.6298, 73.7997, 1700000, 9.8, 2),

-- Ahmedabad - Moderate crime areas
('Gujarat', 'Ahmedabad', 2023, 'Rape', 234, 23.0225, 72.5714, 5500000, 4.3, 2),
('Gujarat', 'Gandhinagar', 2023, 'Domestic Violence', 45, 23.2156, 72.6369, 208000, 21.6, 3),

-- Jaipur - Moderate to high crime areas
('Rajasthan', 'Jaipur', 2023, 'Rape', 456, 26.9124, 75.7873, 3100000, 14.7, 4),
('Rajasthan', 'Jodhpur', 2023, 'Dowry Deaths', 34, 26.2389, 73.0243, 1000000, 3.4, 5),

-- Lucknow - High crime areas
('Uttar Pradesh', 'Lucknow', 2023, 'Rape', 567, 26.8467, 80.9462, 2800000, 20.3, 4),
('Uttar Pradesh', 'Kanpur Nagar', 2023, 'Domestic Violence', 789, 26.4499, 80.3319, 2700000, 29.2, 4),
('Uttar Pradesh', 'Ghaziabad', 2023, 'Sexual Harassment', 345, 28.6692, 77.4538, 1700000, 20.3, 3),

-- Patna - High crime areas
('Bihar', 'Patna', 2023, 'Rape', 234, 25.5941, 85.1376, 1700000, 13.8, 4),
('Bihar', 'Gaya', 2023, 'Domestic Violence', 123, 24.7914, 85.0002, 470000, 26.2, 4),

-- Bhopal - Moderate crime areas
('Madhya Pradesh', 'Bhopal', 2023, 'Rape', 178, 23.2599, 77.4126, 1800000, 9.9, 3),
('Madhya Pradesh', 'Indore', 2023, 'Sexual Harassment', 134, 22.7196, 75.8577, 2200000, 6.1, 2);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_india_crime_location ON india_crime_data(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_india_crime_severity ON india_crime_data(severity_score);
CREATE INDEX IF NOT EXISTS idx_india_crime_state ON india_crime_data(state);
CREATE INDEX IF NOT EXISTS idx_india_crime_year ON india_crime_data(year);

-- Create aggregated view for heatmap data
CREATE OR REPLACE VIEW crime_heatmap_data AS
SELECT 
    latitude,
    longitude,
    state,
    district,
    SUM(cases_reported) as total_cases,
    AVG(crime_rate) as avg_crime_rate,
    MAX(severity_score) as max_severity,
    COUNT(*) as crime_types_count,
    CASE 
        WHEN AVG(crime_rate) > 20 OR MAX(severity_score) >= 4 THEN 'danger'
        WHEN AVG(crime_rate) > 10 OR MAX(severity_score) >= 3 THEN 'warning'
        ELSE 'safe'
    END as zone_type
FROM india_crime_data 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
GROUP BY latitude, longitude, state, district;
