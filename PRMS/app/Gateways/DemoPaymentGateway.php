<?php
/**
 * PRMS — Property Rental Management System
 * Demo Payment Gateway implementation for WAMP local testing
 */

declare(strict_types=1);

namespace PRMS\App\Gateways;

use PRMS\App\PaymentGatewayInterface;

class DemoPaymentGateway implements PaymentGatewayInterface
{
    private string $apiKey;
    private string $apiSecret;
    private string $merchantId;

    public function __construct(string $apiKey = '', string $apiSecret = '', string $merchantId = '')
    {
        $this->apiKey = $apiKey;
        $this->apiSecret = $apiSecret;
        $this->merchantId = $merchantId;
    }

    public function getName(): string
    {
        return 'demo';
    }

    public function getTitle(): string
    {
        return 'Demo Payment Gateway';
    }

    public function initiatePayment(array $payload): array
    {
        $year = date('Y');
        $randomNum = str_pad((string)rand(100, 9999), 6, '0', STR_PAD_LEFT);
        $transactionRef = "PRMS-{$year}-{$randomNum}";

        return [
            'success' => true,
            'transaction_ref' => $transactionRef,
            'gateway_ref' => 'DEMO-' . strtoupper(bin2hex(random_bytes(6))),
            'amount' => (float)$payload['amount'],
            'currency' => $payload['currency'] ?? 'ZMW',
            'status' => 'Pending',
            'message' => 'Demo transaction initiated successfully'
        ];
    }

    public function verifyPayment(string $transactionRef): array
    {
        // Demo gateway verifies simulated payment successfully
        return [
            'status' => 'Successful',
            'gateway_ref' => 'DEMO-' . strtoupper(bin2hex(random_bytes(6))),
            'verified_at' => date('Y-m-d H:i:s'),
            'message' => 'Simulated demo payment verified by gateway'
        ];
    }
}
