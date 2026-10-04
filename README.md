# PRMS — Property Rental Management System

A web-based system that allows landlords/property managers to manage properties and tenants, while tenants can view their rent balance and pay rent directly through the system.

Built for **WAMP Server** running **PHP 8+** and **MySQL 8+ / MariaDB**, using **HTML5, CSS3, JavaScript, and Bootstrap 5**.

---

## 1. System Overview

- **Target URL**: `http://localhost/prms/`
- **Database**: `prms_db` (MySQL 8+ / MariaDB)
- **Currency**: `ZMW` (Zambian Kwacha)
- **Architecture**: Lightweight MVC with decoupled `PaymentService` and configurable `PaymentGateway` providers.

---

## 2. Directory Structure

```text
PRMS/
├── app/
│   ├── PaymentGatewayInterface.php
│   ├── PaymentService.php
│   └── Gateways/
│       ├── DemoPaymentGateway.php
│       ├── MobileMoneyGateway.php
│       └── CardPaymentGateway.php
├── config/
│   └── database.php
├── controllers/
│   ├── AuthController.php
│   ├── DashboardController.php
│   ├── PropertyController.php
│   ├── TenantController.php
│   ├── LeaseController.php
│   ├── PaymentController.php
│   └── MaintenanceController.php
├── database/
│   └── schema.sql
├── models/
│   ├── User.php
│   ├── Property.php
│   ├── Tenant.php
│   ├── Lease.php
│   ├── Payment.php
│   └── Maintenance.php
├── public/
│   ├── index.php
│   ├── assets/
│   └── uploads/
├── views/
│   ├── layout.php
│   ├── dashboard.php
│   ├── pay_rent.php
│   ├── receipt.php
│   └── properties.php
├── database.sql
├── .env.example
├── README.md
└── INSTALLATION.md
```

---

## 3. Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@demo.com` (or `admin@prms.local`) | `Password@123` |
| **Property Manager** | `manager@demo.com` (or `manager@prms.local`) | `Password@123` |
| **Tenant** | `john@demo.com` (or `tenant@prms.local`) | `Password@123` |

---

## 4. Key Workflows & Features

1. **Online Rent Payment**:
   - Tenants can pay full rent or partial rent.
   - Demo Gateway simulates telecom mobile money (MTN MoMo, Airtel Money, Zamtel Kwacha) and Card switches.
   - Payment status is verified by the gateway before balance update.
   - Database transactions guarantee atomic updates to `rent_balances` and `payment_transactions`.
2. **Instant Receipt Generation**:
   - Official voucher containing receipt number, tenant, property, payment method, previous balance, and remaining balance.
   - 1-click Download PDF and Print format.
3. **Properties, Tenants & Leases**:
   - Full CRUD operations with occupancy tracking and unit assignment.
4. **Maintenance Work Orders**:
   - Tenants submit requests with photos/descriptions; managers update status (`Submitted` -> `In Progress` -> `Completed`).
5. **Rent Collection Reports**:
   - Filter by date range, property, tenant, and status with 1-click CSV export.
6. **Payment Gateway Settings**:
   - Admin can configure API Key, API Secret, Merchant ID, and switch between Demo, Mobile Money, and Card gateways.
