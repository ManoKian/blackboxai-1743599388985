<?php
header('Content-Type: application/json');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$ordersFile = '../data/orders.json';
$orders = [];

if (file_exists($ordersFile)) {
    $orders = json_decode(file_get_contents($ordersFile), true);
    if (!is_array($orders)) {
        $orders = [];
    }
}

// Find and update the order
$updated = false;
foreach ($orders as &$order) {
    if ($order['orderId'] === $data['orderId']) {
        $order['status'] = $data['status'];
        $order['updatedAt'] = date('c');
        $updated = true;
        break;
    }
}

if ($updated) {
    file_put_contents($ordersFile, json_encode($orders, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Order not found']);
}
?>