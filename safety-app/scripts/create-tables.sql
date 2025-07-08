-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create crime data table (based on Kaggle dataset structure)
CREATE TABLE IF NOT EXISTS crime_data (
    id SERIAL PRIMARY KEY,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    crime_category VARCHAR(50) NOT NULL,
    date_occurred DATE NOT NULL,
    time_occurred TIME,
    location_description TEXT,
    severity_level INTEGER DEFAULT 1, -- 1-5 scale
    against_women BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create location tracking table
CREATE TABLE IF NOT EXISTS location_tracking (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    zone_type VARCHAR(20) NOT NULL, -- 'safe', 'warning', 'danger'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    duration_in_zone INTEGER DEFAULT 0 -- seconds
);

-- Create emergency alerts table
CREATE TABLE IF NOT EXISTS emergency_alerts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    message TEXT,
    contacts_notified TEXT[], -- Array of contact IDs
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'resolved', 'false_alarm'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crime_data_location ON crime_data(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_crime_data_women ON crime_data(against_women);
CREATE INDEX IF NOT EXISTS idx_location_tracking_user ON location_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_location_tracking_timestamp ON location_tracking(timestamp);
CREATE INDEX IF NOT EXISTS idx_emergency_alerts_user ON emergency_alerts(user_id);
