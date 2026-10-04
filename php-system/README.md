# PRMS — Property Rental Management System (PHP / JS / CSS / HTML)

A complete, production-ready Property Rental Management System built using standard **PHP, JavaScript, CSS, HTML, and MySQL**.

---

## 🚀 Quick Setup on WAMP / XAMPP / LAMP

### 1. Copy Files
Copy the contents of this folder into your web server's root directory:
- **WAMP**: `C:\wamp64\www\prms\`
- **XAMPP**: `C:\xampp\htdocs\prms\`
- **Linux (Apache)**: `/var/www/html/prms/`

### 2. Import Database
1. Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Click **Import**.
3. Select `database.sql` located in this folder.
4. Click **Go** to create the `prms_db` database and seed initial sample data.

### 3. Database Credentials (config/db.php)
Default settings in `config/db.php` match standard WAMP/XAMPP:
```php
$host = 'localhost';
$dbname = 'prms_db';
$username = 'root';
$password = ''; // Set your MySQL password if any
```

### 4. Launch Application
Open your browser and navigate to:
```
http://localhost/prms/
```

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@demo.com` | `Password@123` |
| **Property Manager** | `manager@demo.com` | `Password@123` |
| **Tenant** | `john@demo.com` | `Password@123` |

---

## 📂 File Structure

```text
prms/
├── config/
│   └── db.php                     # MySQL PDO connection & session auth
├── assets/
│   ├── css/
│   │   └── style.css              # Pure CSS stylesheet
│   └── js/
│       └── app.js                 # Pure JavaScript client interactions
├── api/
│   └── send-credentials.php       # Real email & SMS credential dispatcher
├── database.sql                   # MySQL database schema & initial data
├── index.php                      # Modern Landing & Login page
├── dashboard.php                  # Admin / Property Manager Dashboard
├── pay-rent.php                   # Rent payment & electronic receipt voucher
└── README.md                      # Documentation
```
