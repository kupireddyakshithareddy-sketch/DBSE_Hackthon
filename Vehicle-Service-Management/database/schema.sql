CREATE DATABASE IF NOT EXISTS vehicle_service_db;
USE vehicle_service_db;

CREATE TABLE IF NOT EXISTS users (
 id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL,
 email VARCHAR(100) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL,
 phone VARCHAR(20), role ENUM('customer','admin','mechanic') NOT NULL DEFAULT 'customer',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS vehicles (
 id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL,
 registration_number VARCHAR(30) NOT NULL UNIQUE, brand VARCHAR(60) NOT NULL,
 model VARCHAR(60) NOT NULL, vehicle_year SMALLINT, current_km INT NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS mechanics (
 id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL,
 phone VARCHAR(20), specialization VARCHAR(100), availability BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS services (
 id INT AUTO_INCREMENT PRIMARY KEY, service_name VARCHAR(100) NOT NULL,
 description TEXT, base_price DECIMAL(10,2) NOT NULL, estimated_minutes INT
);
CREATE TABLE IF NOT EXISTS bookings (
 id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, vehicle_id INT NOT NULL,
 service_id INT NOT NULL, mechanic_id INT NULL, booking_date DATETIME NOT NULL,
 problem_description TEXT,
 status ENUM('pending','approved','rejected','assigned','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
 odometer_reading INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
 FOREIGN KEY (service_id) REFERENCES services(id), FOREIGN KEY (mechanic_id) REFERENCES mechanics(id)
);
CREATE TABLE IF NOT EXISTS invoices (
 id INT AUTO_INCREMENT PRIMARY KEY, booking_id INT NOT NULL UNIQUE,
 labor_cost DECIMAL(10,2) NOT NULL DEFAULT 0, parts_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
 tax DECIMAL(10,2) NOT NULL DEFAULT 0, total_amount DECIMAL(10,2) NOT NULL,
 payment_status ENUM('pending','paid') NOT NULL DEFAULT 'pending',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
CREATE TABLE IF NOT EXISTS service_history (
 id INT AUTO_INCREMENT PRIMARY KEY, booking_id INT NOT NULL UNIQUE, vehicle_id INT NOT NULL,
 service_date DATE NOT NULL, odometer_reading INT, description TEXT,
 next_service_km INT, next_service_date DATE,
 FOREIGN KEY (booking_id) REFERENCES bookings(id), FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

INSERT INTO services (service_name, description, base_price, estimated_minutes)
SELECT 'General Service','Complete vehicle inspection and routine maintenance',1500,120
WHERE NOT EXISTS (SELECT 1 FROM services WHERE service_name='General Service');
INSERT INTO services (service_name, description, base_price, estimated_minutes)
SELECT 'Oil Change','Engine oil and oil filter replacement',800,45
WHERE NOT EXISTS (SELECT 1 FROM services WHERE service_name='Oil Change');
INSERT INTO services (service_name, description, base_price, estimated_minutes)
SELECT 'Engine Repair','Engine diagnosis and repair',3000,240
WHERE NOT EXISTS (SELECT 1 FROM services WHERE service_name='Engine Repair');
INSERT INTO services (service_name, description, base_price, estimated_minutes)
SELECT 'Brake Service','Brake inspection and repair',1200,90
WHERE NOT EXISTS (SELECT 1 FROM services WHERE service_name='Brake Service');
INSERT INTO services (service_name, description, base_price, estimated_minutes)
SELECT 'Tyre Replacement','Tyre inspection and replacement',2000,60
WHERE NOT EXISTS (SELECT 1 FROM services WHERE service_name='Tyre Replacement');
INSERT INTO services (service_name, description, base_price, estimated_minutes)
SELECT 'Battery Service','Battery inspection and replacement',1000,45
WHERE NOT EXISTS (SELECT 1 FROM services WHERE service_name='Battery Service');
