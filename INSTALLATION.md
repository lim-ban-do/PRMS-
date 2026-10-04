# PRMS — Property Rental Management System
## WAMP Server (Windows) Installation & Setup Guide

This system is built with **PHP 8+**, **MySQL 8+ / MariaDB**, **Apache**, **HTML5**, **CSS3 (Bootstrap 5)**, and **JavaScript**. It runs locally on WAMP Server without requiring Docker, Node.js, Redis, or cloud dependencies.

---

### Prerequisites
- [WAMP Server 3.3+](https://www.wampserver.com/) with **PHP 8.1 or 8.2+** and **MySQL 8.0+ / MariaDB 10.6+**
- Modern Web Browser (Chrome, Firefox, Edge)

---

### Step 1: Copy PRMS into WAMP Web Root

1. Extract or copy the `prms` project folder directly into your WAMP web root directory:
   ```text
   C:\wamp64\www\prms\
   ```
2. Verify that the folder structure looks like:
   ```text
   C:\wamp64\www\prms\
   ├── app/
   ├── config/
   ├── controllers/
   ├── database/
   ├── models/
   ├── public/
   ├── uploads/
   ├── views/
   ├── database.sql
   ├── .env.example
   ├── README.md
   └── INSTALLATION.md
   ```

---

### Step 2: Start WAMP Services

1. Launch **WampServer** from your Start menu or desktop shortcut.
2. Wait for the WAMP notification tray icon to turn **solid GREEN** (indicating both Apache and MySQL are running).

---

### Step 3: Create & Import the MySQL Database

#### Method A: Using phpMyAdmin (Recommended)
1. Open your browser and navigate to:
   ```text
   http://localhost/phpmyadmin/
   ```
2. Log in (default username: `root`, password: *(blank / leave empty)*).
3. Click on the **Databases** tab, enter database name: `prms_db`, and click **Create**.
4. Select `prms_db` from the left sidebar.
5. Click on the **Import** tab.
6. Click **Choose File** and browse to `C:\wamp64\www\prms\database.sql`.
7. Click **Import** at the bottom of the page. You will see a success message confirming all 12 tables and initial seed data were imported.

#### Method B: Using MySQL Console
Open the WAMP MySQL Console and run:
```sql
SOURCE C:/wamp64/www/prms/database.sql;
```

---

### Step 4: Configure Database Credentials

1. Open `C:\wamp64\www\prms\config\database.php` in a text editor (e.g. Notepad, VS Code).
2. Check your local WAMP MySQL settings (standard defaults):
   ```php
   <?php
   define('DB_HOST', 'localhost');
   define('DB_PORT', 3306);
   define('DB_NAME', 'prms_db');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Leave empty for standard WAMP root
   define('APP_URL', 'http://localhost/prms');
   define('CURRENCY', 'ZMW');
   ```

---

### Step 5: Test WAMP VirtualHost or Direct Alias

Open your browser and navigate to:
```text
http://localhost/prms/
```
or if using VirtualHost:
```text
http://prms.local/
```

---

### Step 6: Demo Accounts & Passwords

The system comes pre-seeded with 3 realistic roles matching the PRMS Showcase:

| Role | Email | Password | Access Details |
|---|---|---|---|
| **Admin** | `admin@demo.com` *(or admin@prms.local)* | `Password@123` | Full system control: properties, tenants, leases, payments, reports, users, settings |
| **Property Manager** | `manager@demo.com` *(or manager@prms.local)* | `Password@123` | Manages assigned properties, tenants, leases, payments, maintenance |
| **Tenant** | `john@demo.com` *(or tenant@prms.local)* | `Password@123` | John Mwale: Chalala House Room 04, outstanding ZMW 1,500, online rent payment |

*Note: For security, the system prompts demo accounts to update their password after initial testing.*

---

### Step 7: Testing the Complete Rent Payment Workflow

1. Log in as Tenant (`john@demo.com` / `Password@123`).
2. Notice your outstanding balance is **ZMW 1,500** on **Chalala House Room 04**.
3. Click the prominent green **[ PAY RENT ]** button.
4. Choose **Full Rent** or **Partial Rent** (e.g., enter ZMW 1,500).
5. Select payment method (**Mobile Money** — MTN, Airtel, or Zamtel, or Demo Gateway).
6. Click **Proceed to Payment**.
7. In the **Demo Payment Gateway**, select your provider (e.g. MTN) and click **Confirm Payment**.
8. The payment status is verified via callback, database transaction updates the `rent_balances` and `payment_transactions` tables.
9. See the **Payment Success** screen with reference `PRMS-2026-000123`.
10. Click **View Receipt** to inspect and click **Download PDF** or **Print**.
