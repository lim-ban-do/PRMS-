<?php
/**
 * PRMS — Property Rental Management System
 * Database Connection & Configuration (PDO MySQL)
 */

declare(strict_types=1);

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
define('DB_NAME', getenv('DB_NAME') ?: 'prms_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

define('APP_NAME', 'PRMS — Property Rental Management System');
define('APP_URL', getenv('APP_URL') ?: 'http://localhost/prms');
define('DEFAULT_CURRENCY', 'ZMW');

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            try {
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // In production do not expose raw passwords or server paths
                error_log("Database connection failed: " . $e->getMessage());
                die(json_encode([
                    'error' => 'Database connection could not be established. Please verify WAMP MySQL is running.'
                ]));
            }
        }
        return self::$instance;
    }
}
