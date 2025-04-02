<?php
header('Content-Type: application/json');

// Get the raw POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Generate a unique order ID
$orderId = uniqid('order_');

// Add order ID to the data
$data['orderId'] = $orderId;

// Path to orders JSON file
$ordersFile = '../data/orders.json';

// Read existing orders
$orders = [];
if (file_exists($ordersFile)) {
    $orders = json_decode(file_get_contents($ordersFile), true);
    if (!is_array($orders)) {
        $orders = [];
    }
}

// Add new order
$orders[] = $data;

// Save back to file
file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT));

// Also add to payments if paid by card
if ($data['paymentMethod'] === 'card') {
    $paymentsFile = '../data/payments.json';
    $payments = [];
    if (file_exists($paymentsFile)) {
        $payments = json_decode(file_get_contents($paymentsFile), true);
        if (!is_array($payments)) {
            $payments = [];
        }
    }

    $payment = [
        'orderId' => $orderId,
        'amount' => $data['total'],
        'status' => 'pending',
        'timestamp' => $data['timestamp']
    ];

    $payments[] = $payment;
    file_put_contents($paymentsFile, json_encode($payments, JSON_PRETTY_PRINT));
}

// Return success response
echo json_encode([
    'success' => true,
    'orderId' => $orderId
]);
?>