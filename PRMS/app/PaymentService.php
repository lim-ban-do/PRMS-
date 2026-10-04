<?php
/**
 * PRMS — Property Rental Management System
 * Payment Service orchestrating gateways, database transactions, balance updates, and receipts
 */

declare(strict_types=1);

namespace PRMS\App;

use PDO;
use Exception;
use PRMS\App\Gateways\DemoPaymentGateway;

class PaymentService
{
    private PDO $db;
    private PaymentGatewayInterface $gateway;

    public function __construct(PDO $db, ?PaymentGatewayInterface $gateway = null)
    {
        $this->db = $db;
        $this->gateway = $gateway ?? new DemoPaymentGateway();
    }

    public function setGateway(PaymentGatewayInterface $gateway): void
    {
        $this->gateway = $gateway;
    }

    /**
     * Process tenant rent payment using strict atomic database transactions
     */
    public function processRentPayment(
        int $tenantId,
        int $leaseId,
        float $amount,
        string $paymentMethod,
        ?string $mobileProvider = null,
        ?string $payerContact = null
    ): array {
        if ($amount <= 0) {
            throw new Exception("Payment amount must be greater than zero.");
        }

        // 1. Initiate with Gateway
        $initResult = $this->gateway->initiatePayment([
            'tenant_id' => $tenantId,
            'lease_id' => $leaseId,
            'amount' => $amount,
            'currency' => 'ZMW',
            'method' => $paymentMethod,
            'provider' => $mobileProvider
        ]);

        $txRef = $initResult['transaction_ref'];

        // 2. Start Atomic MySQL Transaction
        $this->db->beginTransaction();

        try {
            // Fetch Current Rent Balance with Row Lock (FOR UPDATE)
            $stmt = $this->db->prepare("
                SELECT rb.*, l.property_id, p.name AS property_name, u.name AS tenant_name
                FROM rent_balances rb
                JOIN leases l ON l.id = rb.lease_id
                JOIN properties p ON p.id = l.property_id
                JOIN tenants t ON t.id = rb.tenant_id
                JOIN users u ON u.id = t.user_id
                WHERE rb.tenant_id = :tenant_id AND rb.lease_id = :lease_id
                FOR UPDATE
            ");
            $stmt->execute([
                'tenant_id' => $tenantId,
                'lease_id' => $leaseId
            ]);
            $balanceRecord = $stmt->fetch();

            if (!$balanceRecord) {
                throw new Exception("Rent balance record not found for tenant #{$tenantId}.");
            }

            $previousBalance = (float)$balanceRecord['outstanding_balance'];

            // Insert Pending Transaction Record
            $insTx = $this->db->prepare("
                INSERT INTO payment_transactions 
                (transaction_ref, tenant_id, lease_id, amount, currency, gateway, payment_method, mobile_provider, gateway_reference, status, payer_phone_or_card)
                VALUES 
                (:ref, :tenant_id, :lease_id, :amount, 'ZMW', :gateway, :method, :provider, :gw_ref, 'Pending', :contact)
            ");
            $insTx->execute([
                'ref' => $txRef,
                'tenant_id' => $tenantId,
                'lease_id' => $leaseId,
                'amount' => $amount,
                'gateway' => $this->gateway->getName(),
                'method' => $paymentMethod,
                'provider' => $mobileProvider,
                'gw_ref' => $initResult['gateway_ref'] ?? null,
                'contact' => $payerContact
            ]);
            $transactionId = (int)$this->db->lastInsertId();

            // 3. Verify Payment with Gateway (Rule: Never mark successful merely because tenant clicked Pay)
            $verification = $this->gateway->verifyPayment($txRef);

            if ($verification['status'] !== 'Successful') {
                $updTx = $this->db->prepare("UPDATE payment_transactions SET status = :status WHERE id = :id");
                $updTx->execute(['status' => $verification['status'], 'id' => $transactionId]);
                $this->db->commit();
                return [
                    'success' => false,
                    'status' => $verification['status'],
                    'message' => 'Payment could not be completed by the gateway.'
                ];
            }

            // 4. Update Payment Transaction to Successful
            $updTx = $this->db->prepare("
                UPDATE payment_transactions 
                SET status = 'Successful', gateway_reference = :gw_ref, completed_at = NOW() 
                WHERE id = :id
            ");
            $updTx->execute([
                'gw_ref' => $verification['gateway_ref'] ?? $initResult['gateway_ref'],
                'id' => $transactionId
            ]);

            // 5. Calculate New Remaining Balance using exact math (Max 0)
            $remainingBalance = max(0.00, $previousBalance - $amount);
            $newTotalPaid = (float)$balanceRecord['total_paid'] + $amount;

            $updBal = $this->db->prepare("
                UPDATE rent_balances 
                SET total_paid = :total_paid, outstanding_balance = :remaining, last_payment_date = NOW()
                WHERE id = :id
            ");
            $updBal->execute([
                'total_paid' => $newTotalPaid,
                'remaining' => $remainingBalance,
                'id' => $balanceRecord['id']
            ]);

            // 6. Generate Official Receipt
            $receiptMethod = $mobileProvider ? "{$paymentMethod} ({$mobileProvider})" : $paymentMethod;
            $insRcpt = $this->db->prepare("
                INSERT INTO rent_payments 
                (receipt_no, transaction_id, tenant_id, property_id, amount_paid, previous_balance, remaining_balance, payment_method, payment_date)
                VALUES 
                (:receipt_no, :tx_id, :tenant_id, :property_id, :amount, :prev_bal, :rem_bal, :method, NOW())
            ");
            $insRcpt->execute([
                'receipt_no' => $txRef,
                'tx_id' => $transactionId,
                'tenant_id' => $tenantId,
                'property_id' => $balanceRecord['property_id'],
                'amount' => $amount,
                'prev_bal' => $previousBalance,
                'rem_bal' => $remainingBalance,
                'method' => $receiptMethod
            ]);

            // 7. Audit Log & Internal Notification
            $insAudit = $this->db->prepare("
                INSERT INTO audit_logs (user_id, action, record_type, record_id, details, ip_address)
                VALUES (:user_id, 'Tenant made payment', 'payment_transactions', :ref, :details, '127.0.0.1')
            ");
            $insAudit->execute([
                'user_id' => $tenantId,
                'ref' => $txRef,
                'details' => "Paid ZMW " . number_format($amount, 2) . " via {$receiptMethod}"
            ]);

            $this->db->commit();

            return [
                'success' => true,
                'status' => 'Successful',
                'transaction_id' => $txRef,
                'receipt_no' => $txRef,
                'amount' => $amount,
                'currency' => 'ZMW',
                'method' => $receiptMethod,
                'payment_date' => date('d M Y, h:i A'),
                'previous_balance' => $previousBalance,
                'remaining_balance' => $remainingBalance,
                'tenant_name' => $balanceRecord['tenant_name'],
                'property_name' => $balanceRecord['property_name']
            ];

        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
