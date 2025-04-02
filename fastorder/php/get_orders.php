<?php
header('Content-Type: application/json');

$ordersFile = '../data/orders.json';
$orders = [];

if (file_exists($ordersFile)) {
    $orders = json_decode(file_get_contents($ordersFile), true);
    if (!is_array($orders)) {
        $orders = [];
    }
}

// Return only pending and in-progress orders by default
$filteredOrders = array_filter($orders, function($order) {
    return $order['status'] !== 'completed';
});

// Sort by timestamp (oldest first)
usort($filteredOrders, function($a, $b) {
    return strtotime($a['timestamp']) - strtotime($b['timestamp']);
});

echo json_encode(array_values($filteredOrders));
?>