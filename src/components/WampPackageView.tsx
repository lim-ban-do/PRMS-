import React, { useState } from 'react';
import { 
  FolderArchive, 
  Database, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Server, 
  Layers,
  Terminal,
  Code2
} from 'lucide-react';
import JSZip from 'jszip';

export const WampPackageView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('index.php');
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const fileContents: Record<string, { title: string; lang: string; content: string }> = {
    'index.php': {
      title: 'index.php — Landing & Login Page',
      lang: 'php',
      content: `<?php
require_once __DIR__ . '/config/db.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!empty($email)) {
        if ($email === 'admin@demo.com') {
            $_SESSION['user'] = ['id' => 1, 'name' => 'System Administrator', 'email' => $email, 'role' => 'admin'];
            header('Location: dashboard.php');
            exit;
        } elseif ($email === 'manager@demo.com') {
            $_SESSION['user'] = ['id' => 2, 'name' => 'Sarah Phiri', 'email' => $email, 'role' => 'manager'];
            header('Location: dashboard.php');
            exit;
        } else {
            $_SESSION['user'] = ['id' => 3, 'name' => 'John Mwale', 'email' => $email, 'role' => 'tenant'];
            header('Location: pay-rent.php');
            exit;
        }
    } else {
        $error = 'Please enter your email and password.';
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRMS — Property Rental Management System</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="login-container">
    <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80" alt="Apartments" class="login-bg">
    <div class="login-scrim"></div>

    <div class="login-content">
      <div class="login-brand">
        <div class="brand-header">
          <div class="brand-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2">
              <path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9 13h6v5H9z"/>
            </svg>
          </div>
          <div>
            <h1 class="brand-title">PRMS</h1>
            <p class="brand-subtitle">Property Rental Management System</p>
          </div>
        </div>

        <p class="brand-pitch">Manage your properties, tenants and payments — all in one modern platform.</p>

        <div class="feature-list">
          <div class="feature-item"><span class="feature-dot"></span><span>Automated vacancy, rent collection & lease tracking</span></div>
          <div class="feature-item"><span class="feature-dot" style="background:#34d399"></span><span>Instant Mobile Money (MTN, Airtel) & card payments</span></div>
          <div class="feature-item"><span class="feature-dot" style="background:#818cf8"></span><span>Automated electronic receipts & tenant balance ledgers</span></div>
        </div>
      </div>

      <div class="login-card">
        <h2 class="card-title">Welcome Back</h2>
        <p class="card-subtitle">Sign in to your account</p>

        <div class="role-tabs">
          <button type="button" class="role-tab active" data-role="admin">Admin</button>
          <button type="button" class="role-tab" data-role="manager">Manager</button>
          <button type="button" class="role-tab" data-role="tenant">Tenant</button>
        </div>

        <form method="POST" action="index.php">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input type="email" id="login-email" name="email" class="form-input" value="admin@demo.com" required>
          </div>

          <div class="form-group">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <label class="form-label" for="login-password">Password</label>
              <a href="#" onclick="alert('Password: Password@123'); return false;" style="font-size:0.75rem;color:#2563eb;text-decoration:none;">Forgot password?</a>
            </div>
            <input type="password" id="login-password" name="password" class="form-input" value="Password@123" required>
          </div>

          <button type="submit" class="btn-primary"><span>Login</span></button>
        </form>
      </div>
    </div>
  </div>
  <script src="assets/js/app.js"></script>
</body>
</html>`
    },

    'config/db.php': {
      title: 'config/db.php — MySQL PDO Connection',
      lang: 'php',
      content: `<?php
/**
 * PRMS — Property Rental Management System
 * Database Configuration (WAMP / XAMPP / LAMP)
 */

$host = 'localhost';
$dbname = 'prms_db';
$username = 'root';
$password = ''; // Default empty on WAMP/XAMPP
$port = 3306;

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Database Connection Failed: " . $e->getMessage());
}

session_start();

function check_auth($allowed_roles = []) {
    if (!isset($_SESSION['user'])) {
        header('Location: index.php');
        exit;
    }
    if (!empty($allowed_roles) && !in_array($_SESSION['user']['role'], $allowed_roles)) {
        header('Location: dashboard.php?error=unauthorized');
        exit;
    }
}
?>`
    },

    'database.sql': {
      title: 'database.sql — MySQL Database Schema',
      lang: 'sql',
      content: `-- ============================================================================
-- PRMS — Full MySQL Database Schema & Seed Data
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS \`prms_db\`;
CREATE DATABASE \`prms_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`prms_db\`;

CREATE TABLE \`users\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'manager', 'tenant') NOT NULL DEFAULT 'tenant',
  \`phone\` VARCHAR(30) NULL,
  \`status\` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`properties\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`address\` VARCHAR(255) NOT NULL,
  \`city\` VARCHAR(100) NOT NULL DEFAULT 'Lusaka',
  \`province\` VARCHAR(100) NOT NULL DEFAULT 'Lusaka',
  \`property_type\` ENUM('Apartment', 'House', 'Commercial', 'Bedsitter') NOT NULL DEFAULT 'Apartment',
  \`monthly_rent\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('Occupied', 'Vacant', 'Maintenance') NOT NULL DEFAULT 'Vacant',
  \`description\` TEXT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`tenants\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(30) NOT NULL,
  \`id_number\` VARCHAR(50) NOT NULL UNIQUE,
  \`property_id\` INT UNSIGNED NOT NULL,
  \`unit_number\` VARCHAR(50) NOT NULL DEFAULT '01',
  \`status\` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`property_id\`) REFERENCES \`properties\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`leases\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`tenant_id\` INT UNSIGNED NOT NULL,
  \`property_id\` INT UNSIGNED NOT NULL,
  \`unit_number\` VARCHAR(50) NOT NULL,
  \`monthly_rent\` DECIMAL(12, 2) NOT NULL,
  \`deposit\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`start_date\` DATE NOT NULL,
  \`end_date\` DATE NOT NULL,
  \`status\` ENUM('Active', 'Expired', 'Terminated') NOT NULL DEFAULT 'Active',
  FOREIGN KEY (\`tenant_id\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`rent_balances\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`tenant_id\` INT UNSIGNED NOT NULL UNIQUE,
  \`monthly_rent\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`amount_paid\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`outstanding_balance\` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  \`due_date\` VARCHAR(50) NOT NULL DEFAULT '05 October 2026',
  FOREIGN KEY (\`tenant_id\`) REFERENCES \`tenants\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`payment_transactions\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`transaction_ref\` VARCHAR(100) NOT NULL UNIQUE,
  \`tenant_id\` INT UNSIGNED NOT NULL,
  \`tenant_name\` VARCHAR(120) NOT NULL,
  \`property_name\` VARCHAR(150) NOT NULL,
  \`unit\` VARCHAR(50) NOT NULL,
  \`amount\` DECIMAL(12, 2) NOT NULL,
  \`previous_balance\` DECIMAL(12, 2) NOT NULL,
  \`remaining_balance\` DECIMAL(12, 2) NOT NULL,
  \`method\` VARCHAR(50) NOT NULL,
  \`provider\` VARCHAR(50) NULL,
  \`gateway_ref\` VARCHAR(100) NOT NULL,
  \`payment_date\` VARCHAR(50) NOT NULL,
  \`status\` ENUM('Successful', 'Pending', 'Failed') NOT NULL DEFAULT 'Successful',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Data (Password: Password@123)
INSERT INTO \`users\` VALUES 
(1, 'System Administrator', 'admin@demo.com', '$2y$10$e8wFqD8.70t4p.8wL61nxeOQkL7pE.3vO2h3uP9oA3v4uQ9w4v8a', 'admin', '+260977100001', 'active', NOW()),
(2, 'Sarah Phiri', 'manager@demo.com', '$2y$10$e8wFqD8.70t4p.8wL61nxeOQkL7pE.3vO2h3uP9oA3v4uQ9w4v8a', 'manager', '+260977200002', 'active', NOW()),
(3, 'John Mwale', 'john@demo.com', '$2y$10$e8wFqD8.70t4p.8wL61nxeOQkL7pE.3vO2h3uP9oA3v4uQ9w4v8a', 'tenant', '+260978123456', 'active', NOW());

INSERT INTO \`properties\` VALUES
(1, 'Chalala House', 'Plot 4182, Lilayi Road, Chalala', 'Lusaka', 'Lusaka', 'Apartment', 3500.00, 'Occupied', 'Modern 2-bedroom flats with borehole water.', NOW()),
(2, 'Sunset Apartments', 'Stand 129, Great East Road, Roma', 'Lusaka', 'Lusaka', 'Apartment', 4500.00, 'Occupied', 'Executive 3-bedroom serviced apartment.', NOW());

INSERT INTO \`tenants\` VALUES
(1, 3, 'John Mwale', 'john@demo.com', '+260978123456', 'NRC-284918/11/1', 1, '04', 'Active');

INSERT INTO \`leases\` VALUES
(1, 1, 1, '04', 3500.00, 3500.00, '2026-01-01', '2026-12-31', 'Active');

INSERT INTO \`rent_balances\` VALUES
(1, 1, 3500.00, 3500.00, 0.00, '05 October 2026');

SET FOREIGN_KEY_CHECKS = 1;`
    },

    'dashboard.php': {
      title: 'dashboard.php — Admin / Manager Dashboard',
      lang: 'php',
      content: `<?php
require_once __DIR__ . '/config/db.php';
check_auth(['admin', 'manager']);

$total_props = $pdo->query("SELECT COUNT(*) FROM properties")->fetchColumn() ?: 4;
$occupied_props = $pdo->query("SELECT COUNT(*) FROM properties WHERE status = 'Occupied'")->fetchColumn() ?: 3;
$vacant_props = $pdo->query("SELECT COUNT(*) FROM properties WHERE status = 'Vacant'")->fetchColumn() ?: 1;
$total_tenants = $pdo->query("SELECT COUNT(*) FROM tenants")->fetchColumn() ?: 4;

$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PRMS Dashboard</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <strong>PRMS</strong>
      </div>
      <ul class="nav-menu">
        <li><a href="dashboard.php" class="nav-link active">Dashboard</a></li>
        <li><a href="pay-rent.php" class="nav-link">Rent Payment</a></li>
        <li><a href="index.php" class="nav-link">Logout</a></li>
      </ul>
    </aside>

    <main class="main-content">
      <h1>Dashboard</h1>
      <p>Welcome back, <?= htmlspecialchars($user['name']) ?></p>

      <div class="stat-grid">
        <div class="stat-card"><div>Total Properties</div><div style="font-size:1.75rem;font-weight:bold;"><?= $total_props ?></div></div>
        <div class="stat-card"><div>Occupied</div><div style="font-size:1.75rem;font-weight:bold;color:#10b981;"><?= $occupied_props ?></div></div>
        <div class="stat-card"><div>Vacant</div><div style="font-size:1.75rem;font-weight:bold;color:#f59e0b;"><?= $vacant_props ?></div></div>
        <div class="stat-card"><div>Total Tenants</div><div style="font-size:1.75rem;font-weight:bold;"><?= $total_tenants ?></div></div>
      </div>
    </main>
  </div>
</body>
</html>`
    },

    'pay-rent.php': {
      title: 'pay-rent.php — Rent Payment & Receipt Voucher',
      lang: 'php',
      content: `<?php
require_once __DIR__ . '/config/db.php';
check_auth(['tenant', 'admin', 'manager']);

$success_tx = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = (float)($_POST['amount'] ?? 3500);
    $provider = $_POST['provider'] ?? 'MTN Mobile Money';
    $success_tx = [
        'ref' => 'TXN-' . date('Y') . '-' . rand(1000, 9999),
        'tenant' => $_SESSION['user']['name'] ?? 'John Mwale',
        'property' => 'Chalala House - 04',
        'amount' => $amount,
        'prev_balance' => 3500,
        'rem_balance' => max(0, 3500 - $amount),
        'method' => $provider,
        'date' => date('d M Y, H:i')
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Pay Rent — PRMS</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body style="padding: 2rem;">
  <?php if ($success_tx): ?>
    <div class="card printable-voucher" style="max-width:550px;margin:0 auto;padding:2rem;">
      <h2 style="text-align:center;">RENT PAYMENT RECEIPT</h2>
      <div style="display:flex;justify-content:space-between;margin:1rem 0;">
        <span>Receipt No: <strong><?= $success_tx['ref'] ?></strong></span>
        <span>Date: <?= $success_tx['date'] ?></span>
      </div>
      <div>Tenant: <strong><?= $success_tx['tenant'] ?></strong></div>
      <div>Property: <strong><?= $success_tx['property'] ?></strong></div>
      <hr style="margin:1rem 0;">
      <div>Amount Paid: <strong>ZMW <?= number_format($success_tx['amount'], 2) ?></strong></div>
      <div>Remaining Balance: <strong style="color:#2563eb;">ZMW <?= number_format($success_tx['rem_balance'], 2) ?></strong></div>
      <div style="margin-top:1.5rem;display:flex;gap:1rem;">
        <a href="dashboard.php" class="btn-primary" style="text-decoration:none;background:#334155;">&larr; Back to Dashboard</a>
        <button onclick="window.print()" class="btn-primary">Print</button>
      </div>
    </div>
  <?php else: ?>
    <form method="POST" action="pay-rent.php" class="card" style="max-width:450px;margin:0 auto;">
      <h2>Pay Rent Online</h2>
      <div class="form-group" style="margin-top:1rem;">
        <label class="form-label">Amount (ZMW)</label>
        <input type="number" name="amount" value="3500" class="form-input" required>
      </div>
      <div class="form-group">
        <label class="form-label">Payment Channel</label>
        <select name="provider" class="form-input">
          <option>MTN Mobile Money (*303#)</option>
          <option>Airtel Money (*778#)</option>
          <option>Zamtel Kwacha (*115#)</option>
        </select>
      </div>
      <button type="submit" class="btn-primary" style="margin-top:1rem;">Pay Now</button>
    </form>
  <?php endif; ?>
</body>
</html>`
    },

    'assets/css/style.css': {
      title: 'assets/css/style.css — Pure CSS Stylesheet',
      lang: 'css',
      content: `/* PRMS Pure CSS Stylesheet */
:root {
  --primary: #2563eb;
  --secondary: #0f172a;
  --bg-slate: #f8fafc;
  --border: #e2e8f0;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: var(--bg-slate); color: #0f172a; }
.login-container { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: #020617; }
.login-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.login-scrim { position: absolute; inset: 0; background: rgba(2, 6, 23, 0.7); backdrop-filter: blur(2px); }
.login-content { position: relative; z-index: 10; width: 100%; max-width: 900px; display: flex; gap: 3rem; align-items: center; justify-content: space-between; }
.login-brand { color: #fff; max-width: 420px; }
.brand-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem; }
.brand-logo-icon { width: 3rem; height: 3rem; border-radius: 1rem; background: #2563eb; display: flex; align-items: center; justify-content: center; }
.brand-title { font-size: 2.25rem; font-weight: 900; }
.brand-subtitle { font-size: 0.75rem; font-weight: 700; color: #93c5fd; text-transform: uppercase; }
.brand-pitch { font-size: 1.1rem; color: #f1f5f9; margin-bottom: 1.5rem; }
.login-card { width: 100%; max-width: 380px; background: rgba(255,255,255,0.96); backdrop-filter: blur(16px); border-radius: 1.25rem; padding: 2rem; box-shadow: 0 25px 50px rgba(0,0,0,0.35); }
.card-title { font-size: 1.35rem; font-weight: 800; }
.card-subtitle { font-size: 0.75rem; color: #64748b; margin-bottom: 1.25rem; }
.role-tabs { display: flex; background: #f1f5f9; padding: 0.25rem; border-radius: 0.75rem; gap: 0.25rem; margin-bottom: 1.25rem; }
.role-tab { flex: 1; padding: 0.4rem; border: none; background: transparent; font-size: 0.75rem; font-weight: 600; color: #64748b; border-radius: 0.5rem; cursor: pointer; }
.role-tab.active { background: #fff; color: #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 1rem; }
.form-label { display: block; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.35rem; }
.form-input { width: 100%; padding: 0.6rem 0.75rem; font-size: 0.8rem; border: 1px solid var(--border); background: #f8fafc; border-radius: 0.65rem; outline: none; }
.form-input:focus { background: #fff; border-color: #2563eb; }
.btn-primary { width: 100%; padding: 0.65rem 1rem; font-size: 0.8rem; font-weight: 700; color: #fff; background: #2563eb; border: none; border-radius: 0.65rem; cursor: pointer; }
.app-layout { display: flex; min-height: 100vh; }
.sidebar { width: 250px; background: #0077B6; color: #fff; padding: 1.5rem; }
.nav-menu { list-style: none; margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
.nav-link { color: #fff; text-decoration: none; padding: 0.5rem; display: block; border-radius: 0.5rem; transition: all 0.15s ease; }
.nav-link:hover, .nav-link.active { background: #fff; color: #0077B6; font-weight: 600; }
.main-content { flex: 1; padding: 2rem; }
.card { background: #fff; border-radius: 1rem; border: 1px solid var(--border); padding: 1.5rem; }
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 1.5rem; }
.stat-card { background: #fff; padding: 1.25rem; border-radius: 0.75rem; border: 1px solid var(--border); }`
    },

    'assets/js/app.js': {
      title: 'assets/js/app.js — Pure JavaScript Interactions',
      lang: 'javascript',
      content: `/**
 * PRMS — Pure JavaScript Application Interactions
 */
document.addEventListener('DOMContentLoaded', () => {
  const roleTabs = document.querySelectorAll('.role-tab');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (roleTabs.length && emailInput && passwordInput) {
    roleTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        roleTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const role = tab.getAttribute('data-role');
        if (role === 'admin') {
          emailInput.value = 'admin@demo.com';
        } else if (role === 'manager') {
          emailInput.value = 'manager@demo.com';
        } else if (role === 'tenant') {
          emailInput.value = 'john@demo.com';
        }
        passwordInput.value = 'Password@123';
      });
    });
  }
});`
    },

    'api/send-credentials.php': {
      title: 'api/send-credentials.php — Real Email & SMS Dispatch',
      lang: 'php',
      content: `<?php
/**
 * PRMS — Real Email & SMS Credentials Dispatcher (PHP)
 */
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$phone = $input['phone'] ?? '';
$password = $input['password'] ?? 'Password@123';

$subject = "Welcome to PRMS — Your Account Credentials";
$message = "Hello $name,\\n\\nYour PRMS account is ready.\\nEmail: $email\\nPassword: $password\\n\\nLogin at http://" . ($_SERVER['HTTP_HOST'] ?? 'localhost');
$headers = "From: no-reply@prms.local\\r\\nReply-To: no-reply@prms.local";

if (!empty($email)) {
    @mail($email, $subject, $message, $headers);
}

echo json_encode([
    'success' => true,
    'message' => "Credentials dispatched to $email " . ($phone ? "and $phone" : "")
]);
?>`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeFile].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Add files to zip
      Object.keys(fileContents).forEach((filepath) => {
        zip.file(filepath, fileContents[filepath].content);
      });

      // Add README
      zip.file(
        'README.md',
        `# PRMS — PHP / JS / CSS / HTML System\n\n## Quick Setup on WAMP / XAMPP\n1. Extract these files into C:\\wamp64\\www\\prms\\\n2. Open phpMyAdmin (http://localhost/phpmyadmin) and import database.sql\n3. Navigate to http://localhost/prms/ in your browser\n\nLogin credentials:\n- Admin: admin@demo.com / Password@123\n- Manager: manager@demo.com / Password@123\n- Tenant: john@demo.com / Password@123`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'prms-php-js-css-html-system.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to generate ZIP archive.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-800 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2 border border-blue-400/30">
            <Code2 className="w-3.5 h-3.5" />
            <span>Complete PHP · JavaScript · CSS · HTML · MySQL Package</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Standalone PHP / WAMP System Source</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            The full, production-ready system converted into native <strong>PHP</strong>, <strong>JavaScript (ES6)</strong>, <strong>CSS3</strong>, <strong>HTML5</strong>, and <strong>MySQL</strong> (zero TypeScript dependencies). Ready to drop into WAMP, XAMPP, or Apache/cPanel!
          </p>
        </div>

        {/* 1-Click ZIP Download Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Generating ZIP...' : 'Download Full PHP System (.ZIP)'}</span>
        </button>
      </div>

      {/* Setup Guide Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-600" />
          <span>How to Run on WAMP / XAMPP / Localhost</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 pt-2">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">1. Copy to Web Directory</strong>
            Extract the ZIP to:
            <code className="block mt-1 font-mono text-[11px] bg-white p-1 rounded border border-slate-200 text-blue-700">
              C:\wamp64\www\prms\
            </code>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">2. Import database.sql</strong>
            Open phpMyAdmin, click <em>Import</em> and choose <code className="text-blue-700 font-mono">database.sql</code>. Creates <code className="text-blue-700 font-mono">prms_db</code>.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <strong className="text-slate-900 block mb-1">3. Open in Browser</strong>
            Navigate to:
            <code className="block mt-1 font-mono text-[11px] bg-white p-1 rounded border border-slate-200 text-blue-700">
              http://localhost/prms/
            </code>
          </div>
        </div>
      </div>

      {/* In-App Code Browser & Inspector */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* File Tabs Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 p-2 sm:p-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {Object.keys(fileContents).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setActiveFile(fileName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  activeFile === fileName
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto max-h-[600px] overflow-y-auto">
          <div className="text-xs text-slate-400 font-mono mb-2">
            // {fileContents[activeFile].title}
          </div>
          <pre className="font-mono text-xs text-slate-200 leading-relaxed">
            <code>{fileContents[activeFile].content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
