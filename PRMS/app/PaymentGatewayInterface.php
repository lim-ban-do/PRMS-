<?php
/**
 * PRMS — Property Rental Management System
 * Payment Gateway Interface Contract
 */

declare(strict_types=1);

namespace PRMS\App;

interface PaymentGatewayInterface
{
    /**
     * Gateway machine name (e.g. 'demo', 'mtn_momo', 'airtel_money', 'card')
     */
    public function getName(): string;

    /**
     * Human readable title
     */
    public function getTitle(): string;

    /**
     * Initiate payment transaction
     * @param array $payload ['amount' => float, 'currency' => string, 'tenant_id' => int, 'lease_id' => int, 'method' => string, 'provider' => ?string]
     * @return array ['success' => bool, 'transaction_ref' => string, 'redirect_url' => ?string, 'message' => string]
     */
    public function initiatePayment(array $payload): array;

    /**
     * Verify payment status with the gateway
     * @param string $transactionRef
     * @return array ['status' => 'Successful'|'Failed'|'Pending'|'Cancelled', 'gateway_ref' => string, 'amount' => float]
     */
    public function verifyPayment(string $transactionRef): array;
}
