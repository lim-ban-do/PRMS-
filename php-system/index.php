<?php
require_once __DIR__ . '/config/db.php';

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Quick demo login verification
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
            header('Location: tenant-portal.php');
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
    <!-- Architectural Background Image -->
    <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=80" alt="Apartment Architecture" class="login-bg">
    <div class="login-scrim"></div>

    <div class="login-content">
      <!-- Left: System Branding -->
      <div class="login-brand">
        <div class="brand-header">
          <div class="brand-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
              <path d="M9 13h6v5H9z" />
            </svg>
          </div>
          <div>
            <h1 class="brand-title">PRMS</h1>
            <p class="brand-subtitle">Property Rental Management System</p>
          </div>
        </div>

        <p class="brand-pitch">
          Manage your properties, tenants and payments — all in one modern platform.
        </p>

        <div class="feature-list">
          <div class="feature-item">
            <span class="feature-dot"></span>
            <span>Automated vacancy, rent collection & lease tracking</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot" style="background-color: #34d399;"></span>
            <span>Instant Mobile Money (MTN, Airtel) & card payments</span>
          </div>
          <div class="feature-item">
            <span class="feature-dot" style="background-color: #818cf8;"></span>
            <span>Automated electronic receipts & tenant balance ledgers</span>
          </div>
        </div>
      </div>

      <!-- Right: White Login Card -->
      <div class="login-card">
        <h2 class="card-title" style="text-align: center;">Login Portal</h2>
        <p class="card-subtitle" style="text-align: center;">Sign in to your account</p>

        <?php if (!empty($error)): ?>
          <div style="background: #ffe4e6; color: #be123c; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.75rem; margin-bottom: 1rem;">
            <?= htmlspecialchars($error) ?>
          </div>
        <?php endif; ?>

        <form method="POST" action="index.php">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input type="email" id="login-email" name="email" class="form-input" value="" required placeholder="Enter your email">
            </div>
          </div>

          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <label class="form-label" for="login-password" style="margin-bottom: 0;">Password</label>
            </div>
            <div class="input-wrapper">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type="password" id="login-password" name="password" class="form-input" value="" required placeholder="Enter your password">
            </div>
          </div>

          <button type="submit" class="btn-primary">
            <span>Login</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>

        <p style="font-size: 0.75rem; text-align: center; color: #64748b; margin-top: 1.25rem;">
          Don't have an account? <span style="color: #2563eb; font-weight: 600; cursor: pointer;">Contact administrator.</span>
        </p>
      </div>
    </div>
  </div>

  <script src="assets/js/app.js"></script>
</body>
</html>
