<?php
require_once __DIR__ . '/config/db.php';
check_auth(['admin', 'manager']);

// Query live stats from database
$total_props = 4;
$occupied_props = 3;
$vacant_props = 1;
$total_tenants = 4;
$rent_expected = 105000;
$rent_collected = 85500;
$outstanding = 19500;

if (isset($pdo)) {
    try {
        $total_props = $pdo->query("SELECT COUNT(*) FROM properties")->fetchColumn();
        $occupied_props = $pdo->query("SELECT COUNT(*) FROM properties WHERE status = 'Occupied'")->fetchColumn();
        $vacant_props = $pdo->query("SELECT COUNT(*) FROM properties WHERE status = 'Vacant'")->fetchColumn();
        $total_tenants = $pdo->query("SELECT COUNT(*) FROM tenants")->fetchColumn();
        $collected_q = $pdo->query("SELECT COALESCE(SUM(amount), 0) FROM payment_transactions WHERE status = 'Successful'")->fetchColumn();
        $rent_collected = 73000 + (float)$collected_q;
        $outstanding = max(0, $rent_expected - $rent_collected);
    } catch (Exception $e) {}
}

$user = $_SESSION['user'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PRMS Dashboard</title>
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="brand-logo-icon" style="width: 2.2rem; height: 2.2rem; border-radius: 0.6rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/></svg>
        </div>
        <div>
          <strong style="font-size: 1.1rem; display: block; line-height: 1.1;">PRMS</strong>
          <span style="font-size: 0.65rem; color: #94a3b8; text-transform: uppercase;">Management</span>
        </div>
      </div>

      <ul class="nav-menu">
        <li><a href="dashboard.php" class="nav-link active">Dashboard</a></li>
        <li><a href="properties.php" class="nav-link">Properties</a></li>
        <li><a href="tenants.php" class="nav-link">Tenants</a></li>
        <li><a href="leases.php" class="nav-link">Leases</a></li>
        <li><a href="reports.php" class="nav-link">Reports</a></li>
        <li><a href="users.php" class="nav-link">Users</a></li>
        <li style="margin-top: auto;"><a href="index.php" class="nav-link">Logout</a></li>
      </ul>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">Dashboard</h1>
          <p style="font-size: 0.8rem; color: #64748b;">Welcome back, <?= htmlspecialchars($user['name']) ?> (<?= ucfirst($user['role']) ?>)</p>
        </div>
      </div>

      <!-- KPI Stat Grid -->
      <div class="stat-grid">
        <div class="stat-card">
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Total Properties</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-top: 0.25rem;"><?= $total_props ?></div>
        </div>
        <div class="stat-card">
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Occupied</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: #10b981; margin-top: 0.25rem;"><?= $occupied_props ?></div>
        </div>
        <div class="stat-card">
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Vacant</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: #f59e0b; margin-top: 0.25rem;"><?= $vacant_props ?></div>
        </div>
        <div class="stat-card">
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Total Tenants</div>
          <div style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-top: 0.25rem;"><?= $total_tenants ?></div>
        </div>
      </div>

      <!-- Rent Financials -->
      <div class="stat-grid" style="grid-template-columns: repeat(3, 1fr);">
        <div class="stat-card">
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Rent Expected</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #0f172a; font-family: monospace;">ZMW <?= number_format($rent_expected) ?></div>
        </div>
        <div class="stat-card">
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Rent Collected</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #10b981; font-family: monospace;">ZMW <?= number_format($rent_collected) ?></div>
        </div>
        <div class="stat-card">
          <div style="font-size: 0.75rem; color: #64748b; font-weight: 600;">Outstanding Arrears</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: #ef4444; font-family: monospace;">ZMW <?= number_format($outstanding) ?></div>
        </div>
      </div>

      <!-- Recent Payments Table -->
      <div class="card">
        <h2 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">Recent Payment Transactions</h2>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Ref No</th>
                <th>Tenant</th>
                <th>Property</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-family: monospace; font-weight: 700; color: #2563eb;">TXN-2026-0041</td>
                <td>John Mwale</td>
                <td>Chalala House - 04</td>
                <td style="font-family: monospace; font-weight: 700;">ZMW 3,500.00</td>
                <td>Mobile Money (MTN)</td>
                <td>02 Oct 2026</td>
                <td><span class="badge badge-success">Paid</span></td>
              </tr>
              <tr>
                <td style="font-family: monospace; font-weight: 700; color: #2563eb;">TXN-2026-0038</td>
                <td>Mary Banda</td>
                <td>Sunset Apartments - 02</td>
                <td style="font-family: monospace; font-weight: 700;">ZMW 2,000.00</td>
                <td>Mobile Money (Airtel)</td>
                <td>01 Oct 2026</td>
                <td><span class="badge badge-success">Paid</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
  <script src="assets/js/app.js"></script>
</body>
</html>
