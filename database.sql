-- ============================================================================
-- PRMS — Property Rental Management System
-- Database Schema for MySQL 8+ / MariaDB (WAMP Server)
-- ============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `prms_db`;
CREATE DATABASE `prms_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `prms_db`;

-- ----------------------------------------------------------------------------
-- 1. USERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'manager', 'tenant') NOT NULL DEFAULT 'tenant',
  `phone` VARCHAR(30) NULL,
  `avatar` VARCHAR(255) NULL,
  `must_change_password` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 2. PROPERTIES TABLE
-- ----------------------------------------------------------------------------
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
  `photo` VARCHAR(255) NULL,
  `manager_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`manager_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_property_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 3. UNITS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `units` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_number` VARCHAR(50) NOT NULL,
  `unit_type` VARCHAR(50) DEFAULT 'Standard',
  `monthly_rent` DECIMAL(12, 2) NOT NULL,
  `status` ENUM('Occupied', 'Vacant', 'Maintenance') NOT NULL DEFAULT 'Vacant',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 4. TENANTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `tenants` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL UNIQUE,
  `id_number` VARCHAR(50) NOT NULL UNIQUE,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_id` INT UNSIGNED NULL,
  `unit_number` VARCHAR(50) NOT NULL DEFAULT '01',
  `emergency_contact` VARCHAR(100) NULL,
  `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`unit_id`) REFERENCES `units`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 5. LEASES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `leases` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id` INT UNSIGNED NOT NULL,
  `property_id` INT UNSIGNED NOT NULL,
  `unit_number` VARCHAR(50) NOT NULL,
  `monthly_rent` DECIMAL(12, 2) NOT NULL,
  `deposit` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `due_day_of_month` TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `status` ENUM('Active', 'Expired', 'Terminated') NOT NULL DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT,
  INDEX `idx_lease_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 6. RENT BALANCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `rent_balances` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id` INT UNSIGNED NOT NULL,
  `lease_id` INT UNSIGNED NOT NULL,
  `total_billed` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `total_paid` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `outstanding_balance` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `last_payment_date` DATETIME NULL,
  `next_due_date` DATE NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lease_id`) REFERENCES `leases`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 7. PAYMENT TRANSACTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `payment_transactions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `transaction_ref` VARCHAR(100) NOT NULL UNIQUE,
  `tenant_id` INT UNSIGNED NOT NULL,
  `lease_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(12, 2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'ZMW',
  `gateway` VARCHAR(50) NOT NULL DEFAULT 'demo',
  `payment_method` ENUM('Mobile Money', 'Bank/Card', 'Demo Gateway') NOT NULL,
  `mobile_provider` ENUM('MTN', 'Airtel', 'Zamtel') NULL,
  `gateway_reference` VARCHAR(150) NULL,
  `status` ENUM('Pending', 'Successful', 'Failed', 'Cancelled') NOT NULL DEFAULT 'Pending',
  `payer_phone_or_card` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completed_at` DATETIME NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`lease_id`) REFERENCES `leases`(`id`) ON DELETE RESTRICT,
  INDEX `idx_txn_status` (`status`),
  INDEX `idx_txn_ref` (`transaction_ref`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 8. RENT PAYMENTS & RECEIPTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `rent_payments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `receipt_no` VARCHAR(100) NOT NULL UNIQUE,
  `transaction_id` INT UNSIGNED NOT NULL,
  `tenant_id` INT UNSIGNED NOT NULL,
  `property_id` INT UNSIGNED NOT NULL,
  `amount_paid` DECIMAL(12, 2) NOT NULL,
  `previous_balance` DECIMAL(12, 2) NOT NULL,
  `remaining_balance` DECIMAL(12, 2) NOT NULL,
  `payment_method` VARCHAR(100) NOT NULL,
  `payment_date` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`transaction_id`) REFERENCES `payment_transactions`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 9. MAINTENANCE REQUESTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `maintenance_requests` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `tenant_id` INT UNSIGNED NOT NULL,
  `property_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT NOT NULL,
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') NOT NULL DEFAULT 'Medium',
  `status` ENUM('Submitted', 'In Progress', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Submitted',
  `assigned_to` INT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` DATETIME NULL,
  FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE RESTRICT,
  FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `notifications` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('payment', 'maintenance', 'rent_due', 'system') NOT NULL DEFAULT 'system',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 11. AUDIT LOGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NULL,
  `action` VARCHAR(100) NOT NULL,
  `record_type` VARCHAR(50) NOT NULL,
  `record_id` VARCHAR(50) NULL,
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 12. SYSTEM SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE `settings` (
  `key_name` VARCHAR(100) PRIMARY KEY,
  `key_value` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================================
-- SEED INITIAL DATA (Matching UI Showcase EXACTLY)
-- Password for all demo accounts: Password@123
-- (Bcrypt hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi)
-- ============================================================================

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`, `status`) VALUES
(1, 'Admin', 'admin@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '0977000001', 'active'),
(2, 'Sarah Mwamba', 'manager@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', '0977000002', 'active'),
(3, 'John Mwale', 'john@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tenant', '0978123456', 'active'),
(4, 'Mary Banda', 'mary@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tenant', '0978765432', 'active'),
(5, 'Chris Tembo', 'chris@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tenant', '0977654321', 'active'),
(6, 'Patricia Ndlovu', 'patricia@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tenant', '0977112233', 'inactive');

INSERT INTO `properties` (`id`, `name`, `address`, `city`, `province`, `property_type`, `monthly_rent`, `status`, `description`, `photo`, `manager_id`) VALUES
(1, 'Sunset Apartments', 'Plot 123, Lusaka', 'Lusaka', 'Lusaka', 'Apartment', 4500.00, 'Occupied', 'Modern apartments with 2 bedrooms, close to town.', 'sunset_apartments.jpg', 2),
(2, 'Chalala House', 'Chalala, Lusaka', 'Lusaka', 'Lusaka', 'House', 3500.00, 'Occupied', 'Spacious 3-bedroom standalone house in serene residential area.', 'chalala_house.jpg', 2),
(3, 'Riverside Flats', 'Riverside, Lusaka', 'Lusaka', 'Lusaka', 'Apartment', 2800.00, 'Vacant', 'Quiet riverside complex with secure automated gate and borehole.', 'riverside_flats.jpg', 2),
(4, 'Garden Villas', 'Meanwood, Lusaka', 'Lusaka', 'Lusaka', 'House', 5000.00, 'Maintenance', 'Executive luxury villa with paved driveway and private lawn.', 'garden_villas.jpg', 2);

INSERT INTO `units` (`id`, `property_id`, `unit_number`, `unit_type`, `monthly_rent`, `status`) VALUES
(1, 1, '02', '2-Bedroom', 4500.00, 'Occupied'),
(2, 2, '04', '3-Bedroom House', 3500.00, 'Occupied'),
(3, 3, '01', '1-Bedroom Flat', 2800.00, 'Vacant'),
(4, 4, '03', '4-Bedroom Villa', 5000.00, 'Maintenance');

INSERT INTO `tenants` (`id`, `user_id`, `id_number`, `property_id`, `unit_id`, `unit_number`, `status`) VALUES
(1, 3, 'NRC-284918/11/1', 2, 2, '04', 'Active'),
(2, 4, 'NRC-391827/10/2', 1, 1, '02', 'Active'),
(3, 5, 'NRC-194829/11/1', 3, 3, '01', 'Active'),
(4, 6, 'NRC-482910/10/1', 4, 4, '03', 'Inactive');

INSERT INTO `leases` (`id`, `tenant_id`, `property_id`, `unit_number`, `monthly_rent`, `deposit`, `start_date`, `end_date`, `due_day_of_month`, `status`) VALUES
(1, 1, 2, '04', 3500.00, 3500.00, '2026-01-01', '2026-12-31', 5, 'Active'),
(2, 2, 1, '02', 4500.00, 4500.00, '2026-02-15', '2027-02-14', 5, 'Active'),
(3, 3, 3, '01', 2800.00, 2800.00, '2026-03-10', '2027-03-09', 5, 'Active'),
(4, 4, 4, '03', 5000.00, 5000.00, '2026-04-01', '2027-03-31', 5, 'Active');

INSERT INTO `rent_balances` (`id`, `tenant_id`, `lease_id`, `total_billed`, `total_paid`, `outstanding_balance`, `last_payment_date`, `next_due_date`) VALUES
(1, 1, 1, 3500.00, 2000.00, 1500.00, '2026-09-28 10:45:00', '2026-10-05'),
(2, 2, 2, 4500.00, 2000.00, 2500.00, '2026-09-27 14:20:00', '2026-10-05'),
(3, 3, 3, 2800.00, 0.00, 2800.00, NULL, '2026-10-05'),
(4, 4, 4, 5000.00, 5000.00, 0.00, '2026-09-22 09:15:00', '2026-10-05');

INSERT INTO `payment_transactions` (`id`, `transaction_ref`, `tenant_id`, `lease_id`, `amount`, `currency`, `gateway`, `payment_method`, `mobile_provider`, `gateway_reference`, `status`, `payer_phone_or_card`, `created_at`, `completed_at`) VALUES
(1, 'PRMS-2026-000120', 1, 1, 3500.00, 'ZMW', 'demo', 'Mobile Money', 'MTN', '254789K12240', 'Successful', '0978123456', '2026-09-05 08:30:00', '2026-09-05 08:31:00'),
(2, 'PRMS-2026-000121', 4, 4, 5000.00, 'ZMW', 'demo', 'Mobile Money', 'Airtel', '254789K12241', 'Successful', '0977112233', '2026-09-22 09:15:00', '2026-09-22 09:16:00'),
(3, 'PRMS-2026-000122', 2, 2, 2000.00, 'ZMW', 'demo', 'Mobile Money', 'MTN', '254789K12242', 'Successful', '0978765432', '2026-09-27 14:20:00', '2026-09-27 14:21:00'),
(4, 'PRMS-2026-000123', 1, 1, 2000.00, 'ZMW', 'demo', 'Mobile Money', 'MTN', '254789K12245', 'Successful', '0978123456', '2026-09-28 10:45:00', '2026-09-28 10:46:00');

INSERT INTO `rent_payments` (`id`, `receipt_no`, `transaction_id`, `tenant_id`, `property_id`, `amount_paid`, `previous_balance`, `remaining_balance`, `payment_method`, `payment_date`) VALUES
(1, 'PRMS-2026-000120', 1, 1, 2, 3500.00, 3500.00, 0.00, 'Mobile Money (MTN)', '2026-09-05 08:31:00'),
(2, 'PRMS-2026-000121', 2, 4, 4, 5000.00, 5000.00, 0.00, 'Mobile Money (Airtel)', '2026-09-22 09:16:00'),
(3, 'PRMS-2026-000122', 3, 2, 1, 2000.00, 4500.00, 2500.00, 'Mobile Money (MTN)', '2026-09-27 14:21:00'),
(4, 'PRMS-2026-000123', 4, 1, 2, 2000.00, 3500.00, 1500.00, 'Mobile Money (MTN)', '2026-09-28 10:46:00');

INSERT INTO `maintenance_requests` (`id`, `tenant_id`, `property_id`, `title`, `description`, `priority`, `status`, `assigned_to`, `created_at`) VALUES
(1, 1, 2, 'Leaking tap', 'Kitchen mixer tap is leaking around the base and dripping into cupboard.', 'Medium', 'In Progress', 2, '2026-09-28 09:15:00'),
(2, 2, 1, 'Power outage', 'Prepaid circuit breaker trips whenever the geyser heater switch is turned on.', 'High', 'Submitted', NULL, '2026-09-27 16:30:00'),
(3, 3, 3, 'Broken window', 'Lounge sliding window latch is loose and glass pane cracked.', 'Medium', 'Completed', 2, '2026-09-22 11:00:00'),
(4, 4, 4, 'AC not working', 'Master bedroom split AC unit is blowing ambient air instead of cold.', 'Low', 'Submitted', NULL, '2026-09-20 13:45:00');

INSERT INTO `settings` (`key_name`, `key_value`) VALUES
('system_name', 'PRMS — Property Rental Management System'),
('currency', 'ZMW'),
('payment_gateway', 'Demo Gateway'),
('api_key', 'demo_key_live_9482947192'),
('api_secret', 'demo_sec_9918237194827103'),
('merchant_id', 'MERCH_ZAM_884920'),
('contact_email', 'admin@prms.local'),
('due_day_default', '5');

INSERT INTO `audit_logs` (`id`, `user_id`, `action`, `record_type`, `record_id`, `details`, `ip_address`, `created_at`) VALUES
(1, 1, 'Admin created property', 'properties', '1', 'Added Sunset Apartments (Plot 123, Lusaka)', '127.0.0.1', '2026-09-01 09:00:00'),
(2, 2, 'Manager added tenant', 'tenants', '1', 'Assigned John Mwale to Chalala House Room 04', '127.0.0.1', '2026-09-02 11:20:00'),
(3, 3, 'Tenant made payment', 'payment_transactions', 'PRMS-2026-000123', 'Paid ZMW 2,000 via Mobile Money (MTN)', '127.0.0.1', '2026-09-28 10:46:00'),
(4, 2, 'Manager updated maintenance', 'maintenance_requests', '1', 'Updated status to In Progress', '127.0.0.1', '2026-09-28 11:00:00');

SET FOREIGN_KEY_CHECKS = 1;
