-- ============================================================================
-- PRMS — Property Rental Management System
-- Full MySQL Schema & Seed Data (WAMP / LAMP / XAMPP Compatible)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `prms_db`;
CREATE DATABASE `prms_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `prms_db`;

-- 1. USERS TABLE
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'manager', 'tenant') NOT NULL DEFAULT 'tenant',
  `phone` VARCHAR(30) NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. PROPERTIES TABLE
CREATE TABLE `properties` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `city` VARCHAR(100) NOT NULL DEFAULT 'Lusaka',
  `province` VARCHAR(100) NOT NULL DEFAULT 'Lusaka',
  `property_type` ENUM('Apartment', 'House', 'Commercial', 'Bedsitter') NOT NULL DEFAULT 'Apartment',
  `monthly_rent` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `status` ENUM('Occupied', 'Vacant', 'Maintenance') NOT NULL DEFAULT 'Vacant',
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TENANTS TABLE
CREATE TABLE `tenants` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(30) NOT NULL,
  `id_number` VARCHAR(50) NOT NULL UNIQUE,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_number` VARCHAR(50) NOT NULL DEFAULT '01',
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. LEASES TABLE
CREATE TABLE `leases` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id` INT UNSIGNED NOT NULL,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_number` VARCHAR(50) NOT NULL,
  `monthly_rent` DECIMAL(12, 2) NOT NULL,
  `deposit` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('Active', 'Expired', 'Terminated') NOT NULL DEFAULT 'Active',
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. RENT BALANCES TABLE
CREATE TABLE `rent_balances` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id` INT UNSIGNED NOT NULL UNIQUE,
  `monthly_rent` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `amount_paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `outstanding_balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `due_date` VARCHAR(50) NOT NULL DEFAULT '05 October 2026',
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. PAYMENT TRANSACTIONS TABLE
CREATE TABLE `payment_transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `tenant_id` INT UNSIGNED NOT NULL,
  `tenant_name` VARCHAR(120) NOT NULL,
  `property_name` VARCHAR(150) NOT NULL,
  `unit` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `previous_balance` DECIMAL(12, 2) NOT NULL,
  `remaining_balance` DECIMAL(12, 2) NOT NULL,
  `method` VARCHAR(50) NOT NULL,
  `provider` VARCHAR(50) NULL,
  `gateway_ref` VARCHAR(100) NOT NULL,
  `payment_date` VARCHAR(50) NOT NULL,
  `status` ENUM('Successful', 'Pending', 'Failed') NOT NULL DEFAULT 'Successful',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. MAINTENANCE REQUESTS TABLE
CREATE TABLE `maintenance_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `property_name` VARCHAR(150) NOT NULL,
  `unit` VARCHAR(50) NOT NULL,
  `tenant_name` VARCHAR(120) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `priority` ENUM('Urgent', 'High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
  `description` TEXT NOT NULL,
  `status` ENUM('Submitted', 'In Progress', 'Completed') NOT NULL DEFAULT 'Submitted',
  `request_date` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

-- Users (Password: Password@123)
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`, `status`) VALUES
(1, 'System Administrator', 'admin@demo.com', '$2y$10$e8wFqD8.70t4p.8wL61nxeOQkL7pE.3vO2h3uP9oA3v4uQ9w4v8a', 'admin', '+260 977 100001', 'active'),
(2, 'Sarah Phiri', 'manager@demo.com', '$2y$10$e8wFqD8.70t4p.8wL61nxeOQkL7pE.3vO2h3uP9oA3v4uQ9w4v8a', 'manager', '+260 977 200002', 'active'),
(3, 'John Mwale', 'john@demo.com', '$2y$10$e8wFqD8.70t4p.8wL61nxeOQkL7pE.3vO2h3uP9oA3v4uQ9w4v8a', 'tenant', '+260 978 123456', 'active'),
(4, 'Mary Banda', 'mary@demo.com', '$2y$10$e8wFqD8.70t4p.8wL61nxeOQkL7pE.3vO2h3uP9oA3v4uQ9w4v8a', 'tenant', '+260 966 654321', 'active');

-- Properties
INSERT INTO `properties` (`id`, `name`, `address`, `city`, `province`, `property_type`, `monthly_rent`, `status`, `description`) VALUES
(1, 'Chalala House', 'Plot 4182, Lilayi Road, Chalala', 'Lusaka', 'Lusaka', 'Apartment', 3500.00, 'Occupied', 'Modern 2-bedroom flats with paved driveway, borehole water, and 24/7 security.'),
(2, 'Sunset Apartments', 'Stand 129, Great East Road, Roma', 'Lusaka', 'Lusaka', 'Apartment', 4500.00, 'Occupied', 'Executive 3-bedroom serviced apartment with backup generator and air conditioning.'),
(3, 'Riverside Flats', 'Plot 88, Kafue Road, Makeni', 'Lusaka', 'Lusaka', 'Apartment', 2800.00, 'Occupied', 'Affordable 1-bedroom apartments close to public transport corridors.'),
(4, 'Garden Villas', 'Stand 404, Independence Ave, Woodlands', 'Lusaka', 'Lusaka', 'House', 5000.00, 'Vacant', 'Standalone 4-bedroom house with spacious private garden and double garage.');

-- Tenants
INSERT INTO `tenants` (`id`, `user_id`, `name`, `email`, `phone`, `id_number`, `property_id`, `unit_number`, `status`) VALUES
(1, 3, 'John Mwale', 'john@demo.com', '+260 978 123456', 'NRC-284918/11/1', 1, '04', 'Active'),
(2, 4, 'Mary Banda', 'mary@demo.com', '+260 966 654321', 'NRC-192847/52/1', 2, '02', 'Active'),
(3, 1, 'Chris Tembo', 'chris@demo.com', '+260 955 789123', 'NRC-349012/11/1', 3, '01', 'Active'),
(4, 2, 'Patricia Ndlovu', 'patricia@demo.com', '+260 977 445566', 'NRC-562910/64/1', 4, 'Main House', 'Active');

-- Leases
INSERT INTO `leases` (`id`, `tenant_id`, `property_id`, `unit_number`, `monthly_rent`, `deposit`, `start_date`, `end_date`, `status`) VALUES
(1, 1, 1, '04', 3500.00, 3500.00, '2026-01-01', '2026-12-31', 'Active'),
(2, 2, 2, '02', 4500.00, 4500.00, '2026-02-01', '2027-01-31', 'Active'),
(3, 3, 3, '01', 2800.00, 2800.00, '2026-03-01', '2027-02-28', 'Active'),
(4, 4, 4, 'Main House', 5000.00, 5000.00, '2026-04-01', '2027-03-31', 'Active');

-- Rent Balances
INSERT INTO `rent_balances` (`id`, `tenant_id`, `monthly_rent`, `amount_paid`, `outstanding_balance`, `due_date`) VALUES
(1, 1, 3500.00, 3500.00, 0.00, '05 October 2026'),
(2, 2, 4500.00, 2000.00, 2500.00, '05 October 2026'),
(3, 3, 2800.00, 0.00, 2800.00, '05 October 2026'),
(4, 4, 5000.00, 5000.00, 0.00, '05 October 2026');

-- Payments
INSERT INTO `payment_transactions` (`id`, `transaction_ref`, `tenant_id`, `tenant_name`, `property_name`, `unit`, `amount`, `previous_balance`, `remaining_balance`, `method`, `provider`, `gateway_ref`, `payment_date`, `status`) VALUES
(1, 'TXN-2026-0041', 1, 'John Mwale', 'Chalala House', '04', 3500.00, 3500.00, 0.00, 'Mobile Money', 'MTN Mobile Money', 'MTN-MM-928419', '02 Oct 2026, 14:22', 'Successful'),
(2, 'TXN-2026-0038', 2, 'Mary Banda', 'Sunset Apartments', '02', 2000.00, 4500.00, 2500.00, 'Mobile Money', 'Airtel Money', 'AIR-MM-581902', '01 Oct 2026, 09:15', 'Successful'),
(3, 'TXN-2026-0032', 4, 'Patricia Ndlovu', 'Garden Villas', 'Main House', 5000.00, 5000.00, 0.00, 'Bank Transfer', 'Zanaco Express', 'ZNCO-FT-849201', '28 Sep 2026, 16:40', 'Successful');

SET FOREIGN_KEY_CHECKS = 1;
