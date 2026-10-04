<?php
/**
 * PRMS — Property Rental Management System
 * Database Configuration (MySQL / WAMP / XAMPP / LAMP)
 */

$host = 'localhost';
$dbname = 'prms_db';
$username = 'root';
$password = ''; // Default empty in WAMP/XAMPP
$port = 3306;

try {
    $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    // If running in development before database is imported, fallback gracefully
    $db_error = $e->getMessage();
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
?>
