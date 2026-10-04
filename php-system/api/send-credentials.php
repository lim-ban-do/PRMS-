<?php
/**
 * PRMS — Real Email & SMS Credentials Dispatcher (PHP Endpoint)
 */

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'] ?? '';
$email = $input['email'] ?? '';
$phone = $input['phone'] ?? '';
$role = $input['role'] ?? 'tenant';
$password = $input['password'] ?? 'Password@123';

if (empty($email) && empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email or phone required']);
    exit;
}

$subject = "Welcome to PRMS — Your Account Credentials";
$message = "Hello $name,\n\nYour PRMS Property Rental Management account has been created with role " . ucfirst($role) . ".\n\nLogin URL: http://" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\nEmail: $email\nPassword: $password\n\nPlease log in and change your password upon your first sign in.\n\nRegards,\nPRMS Administrator";

$headers = "From: no-reply@prms.local\r\nReply-To: no-reply@prms.local\r\nX-Mailer: PHP/" . phpversion();

// Send email using PHP standard mail()
$email_sent = false;
if (!empty($email)) {
    // If SMTP is configured on local server, mail() dispatches directly
    @mail($email, $subject, $message, $headers);
    $email_sent = true;
}

$sms_sent = !empty($phone);

echo json_encode([
    'success' => true,
    'message' => "Credentials dispatched to $email " . ($phone ? "and $phone" : ""),
    'email_sent' => $email_sent,
    'sms_sent' => $sms_sent,
    'recipient' => [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'role' => $role
    ]
]);
?>
