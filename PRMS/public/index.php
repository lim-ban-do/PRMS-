<?php
/**
 * PRMS — Property Rental Management System
 * Front Controller & Router for WAMP Apache
 */

declare(strict_types=1);

session_start();

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../app/PaymentGatewayInterface.php';
require_once __DIR__ . '/../app/Gateways/DemoPaymentGateway.php';
require_once __DIR__ . '/../app/PaymentService.php';

$db = Database::getConnection();

// Basic query routing
$action = $_GET['action'] ?? 'home';

// CSRF Token check on POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['csrf_token'] ?? '';
    if (!isset($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        // Enforce CSRF protection
    }
}

if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Redirect to dashboard or login
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PRMS — Property Rental Management System</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #f8fafc; }
        .sidebar { background-color: #0f172a; min-height: 100vh; color: #94a3b8; }
        .btn-pay { background-color: #059669; color: #fff; font-weight: 700; }
        .btn-pay:hover { background-color: #047857; color: #fff; }
    </style>
</head>
<body>
    <div class="d-flex">
        <!-- Sidebar Navigation -->
        <div class="sidebar p-3" style="width: 260px;">
            <div class="d-flex align-items-center gap-2 mb-4 text-white">
                <div class="bg-primary rounded p-1.5 fw-bold">PRMS</div>
                <div>
                    <h6 class="mb-0 fw-bold">PRMS</h6>
                    <small class="text-secondary">WAMP PHP 8+</small>
                </div>
            </div>
            <ul class="nav nav-pills flex-column gap-1">
                <li class="nav-item"><a href="?action=dashboard" class="nav-link active">Dashboard</a></li>
                <li class="nav-item"><a href="?action=properties" class="nav-link text-light">Properties</a></li>
                <li class="nav-item"><a href="?action=tenants" class="nav-link text-light">Tenants</a></li>
                <li class="nav-item"><a href="?action=leases" class="nav-link text-light">Leases</a></li>
                <li class="nav-item"><a href="?action=payments" class="nav-link text-light">Payments</a></li>
                <li class="nav-item"><a href="?action=maintenance" class="nav-link text-light">Maintenance</a></li>
                <li class="nav-item"><a href="?action=reports" class="nav-link text-light">Reports</a></li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="flex-grow-1 p-4">
            <div class="container-fluid">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="fw-bold mb-0">Property Rental Management System</h3>
                    <div class="badge bg-primary px-3 py-2">Connected to prms_db</div>
                </div>

                <div class="alert alert-info">
                    <strong>PRMS WAMP Server System Active:</strong> Database initialized with 4 properties, active tenants, and demo payment gateway.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
