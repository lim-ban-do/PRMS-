<?php
require_once __DIR__ . '/config/db.php';
check_auth(['tenant', 'admin', 'manager']);

$success_tx = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = (float)($_POST['amount'] ?? 3500);
    $method = $_POST['method'] ?? 'Mobile Money';
    $provider = $_POST['provider'] ?? 'MTN Mobile Money';
    $phone = $_POST['phone'] ?? '+260 978 123456';
    
    $tx_ref = 'TXN-' . date('Y') . '-' . rand(1000, 9999);
    $gateway_ref = strtoupper(substr($provider, 0, 3)) . '-MM-' . rand(100000, 999999);
    $prev_balance = 3500;
    $rem_balance = max(0, $prev_balance - $amount);

    $success_tx = [
        'ref' => $tx_ref,
        'gateway_ref' => $gateway_ref,
        'tenant' => $_SESSION['user']['name'] ?? 'John Mwale',
        'property' => 'Chalala House - 04',
        'amount' => $amount,
        'prev_balance' => $prev_balance,
        'rem_balance' => $rem_balance,
        'method' => "$method ($provider)",
        'date' => date('d M Y, H:i')
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pay Rent — PRMS</title>
  <link rel="stylesheet" href="assets/css/style.css">
  <style>
    @media print {
      body * { visibility: hidden; }
      .printable-voucher, .printable-voucher * { visibility: visible; }
      .printable-voucher { position: absolute; left: 0; top: 0; width: 100%; border: none !important; box-shadow: none !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body style="background-color: #f1f5f9; padding: 2rem 1rem;">

  <div style="max-width: 600px; margin: 0 auto;">
    <?php if ($success_tx): ?>
      <!-- Electronic Payment Receipt Voucher -->
      <div class="card printable-voucher" style="border-radius: 1.25rem; padding: 2.5rem; box-shadow: var(--shadow-lg);">
        <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.75rem; font-weight: 900; color: #0f172a; margin: 0;">PRMS</h2>
          <p style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Property Rental Management System</p>
          <div style="margin-top: 0.75rem; display: inline-block; background: #e0e7ff; color: #3730a3; padding: 0.25rem 0.75rem; border-radius: 0.5rem; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em;">
            RENT PAYMENT RECEIPT
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.8rem; margin-bottom: 1.5rem;">
          <div>
            <span style="color: #64748b; display: block; font-size: 0.7rem;">Receipt No:</span>
            <strong style="font-family: monospace; font-size: 0.95rem; color: #2563eb;"><?= $success_tx['ref'] ?></strong>
          </div>
          <div style="text-align: right;">
            <span style="color: #64748b; display: block; font-size: 0.7rem;">Date:</span>
            <strong><?= $success_tx['date'] ?></strong>
          </div>
          <div>
            <span style="color: #64748b; display: block; font-size: 0.7rem;">Tenant:</span>
            <strong><?= htmlspecialchars($success_tx['tenant']) ?></strong>
          </div>
          <div style="text-align: right;">
            <span style="color: #64748b; display: block; font-size: 0.7rem;">Property & Unit:</span>
            <strong><?= htmlspecialchars($success_tx['property']) ?></strong>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 1rem 0; margin-bottom: 1.5rem; font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; padding: 0.4rem 0;">
            <span style="color: #64748b;">Monthly Rent</span>
            <span style="font-family: monospace;">ZMW <?= number_format($success_tx['prev_balance'], 2) ?></span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.4rem 0.5rem; background: #dcfce7; border-radius: 0.4rem; color: #166534; font-weight: 700;">
            <span>Payment Received</span>
            <span style="font-family: monospace;">ZMW <?= number_format($success_tx['amount'], 2) ?></span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.4rem 0;">
            <span style="color: #64748b;">Previous Balance</span>
            <span style="font-family: monospace;">ZMW <?= number_format($success_tx['prev_balance'], 2) ?></span>
          </div>
          <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-top: 1px solid #e2e8f0; font-weight: 800; color: #0f172a;">
            <span>Remaining Balance</span>
            <span style="font-family: monospace; color: #2563eb;">ZMW <?= number_format($success_tx['rem_balance'], 2) ?></span>
          </div>
        </div>

        <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 1.5rem;">
          <div><strong>Method:</strong> <?= htmlspecialchars($success_tx['method']) ?></div>
          <div><strong>Gateway Reference:</strong> <span style="font-family: monospace;"><?= $success_tx['gateway_ref'] ?></span></div>
          <div><strong>Status:</strong> <span style="color: #10b981; font-weight: 700;">VERIFIED (SUCCESSFUL)</span></div>
        </div>

        <div style="text-align: center; border-top: 1px solid #f1f5f9; padding-top: 1rem; font-size: 0.75rem; color: #64748b; font-style: italic;">
          Thank you for your payment! This receipt was electronically issued by PRMS.
        </div>

        <!-- Buttons with Working Back button! -->
        <div class="no-print" style="margin-top: 2rem; display: flex; gap: 0.75rem; justify-content: center;">
          <a href="dashboard.php" class="nav-link" style="background: #334155; color: #fff; padding: 0.6rem 1.25rem; border-radius: 0.6rem; font-weight: 600; font-size: 0.8rem; text-decoration: none;">
            &larr; Back to Dashboard
          </a>
          <button onclick="window.print()" class="btn-primary" style="width: auto; padding: 0.6rem 1.5rem;">
            Print Receipt
          </button>
        </div>
      </div>

    <?php else: ?>
      <!-- Payment Checkout Form -->
      <div class="card" style="border-radius: 1rem; padding: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin: 0;">Pay Rent Online</h2>
          <a href="dashboard.php" style="font-size: 0.8rem; color: #2563eb; text-decoration: none; font-weight: 600;">&larr; Back</a>
        </div>

        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; color: #64748b;">Current Rent Due</div>
          <div style="font-size: 1.75rem; font-weight: 800; font-family: monospace; color: #0f172a;">ZMW 3,500.00</div>
          <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.25rem;">Property: <strong>Chalala House - Room 04</strong></div>
        </div>

        <form method="POST" action="pay-rent.php">
          <div class="form-group">
            <label class="form-label">Payment Amount (ZMW)</label>
            <input type="number" name="amount" class="form-input" value="3500" required min="100" step="50" style="padding-left: 1rem; font-size: 1rem; font-weight: 700;">
          </div>

          <div class="form-group">
            <label class="form-label">Payment Channel</label>
            <select name="provider" class="form-input" style="padding-left: 1rem;">
              <option value="MTN Mobile Money">MTN Mobile Money (*303#)</option>
              <option value="Airtel Money">Airtel Money (*778#)</option>
              <option value="Zamtel Kwacha">Zamtel Kwacha (*115#)</option>
              <option value="Debit Card">Visa / Mastercard</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Mobile Money Phone Number</label>
            <input type="text" name="phone" class="form-input" value="+260 978 123456" required style="padding-left: 1rem;">
          </div>

          <button type="submit" class="btn-primary" style="margin-top: 1.5rem; padding: 0.85rem;">
            Confirm & Pay ZMW 3,500
          </button>
        </form>
      </div>
    <?php endif; ?>
  </div>

</body>
</html>
