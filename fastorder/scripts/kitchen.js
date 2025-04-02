document.addEventListener('DOMContentLoaded', function() {
    const ordersContainer = document.getElementById('orders-container');
    
    // Function to fetch and display orders
    function fetchOrders() {
        fetch('../php/get_orders.php')
            .then(response => response.json())
            .then(orders => {
                if (orders.length === 0) {
                    ordersContainer.innerHTML = `
                        <div class="text-center text-gray-500 py-10">
                            <i class="fas fa-utensils text-4xl mb-2"></i>
                            <p>Waiting for orders...</p>
                        </div>
                    `;
                    return;
                }

                ordersContainer.innerHTML = orders.map(order => `
                    <div class="bg-white rounded-lg shadow-md p-4 border-l-4 ${order.status === 'ready' ? 'border-green-500' : 'border-yellow-500'}">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="font-bold">Order #${order.orderId.substring(6)}</h3>
                            <span class="text-sm ${order.status === 'ready' ? 'text-green-600' : 'text-yellow-600'}">
                                ${order.status === 'ready' ? 'Ready' : 'In Progress'}
                            </span>
                        </div>
                        ${order.tableNumber ? `<p class="text-sm text-gray-600 mb-2">Table: ${order.tableNumber}</p>` : ''}
                        ${order.specialNotes ? `<p class="text-sm text-gray-600 mb-2">Notes: ${order.specialNotes}</p>` : ''}
                        
                        <div class="border-t pt-2 mt-2">
                            ${order.items.map(item => `
                                <div class="flex justify-between py-1">
                                    <span>${item.quantity}x ${item.name}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="flex justify-between items-center border-t pt-2 mt-2">
                            <span class="font-bold">Total:</span>
                            <span class="font-bold">$${order.total.toFixed(2)}</span>
                        </div>
                        
                        <div class="flex space-x-2 mt-4">
                            <button onclick="updateOrderStatus('${order.orderId}', 'ready')" 
                                    class="px-4 py-2 bg-green-500 text-white rounded ${order.status === 'ready' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}">
                                Mark as Ready
                            </button>
                        </div>
                    </div>
                `).join('');
            });
    }

    // Function to update order status
    window.updateOrderStatus = function(orderId, status) {
        fetch('../php/update_status.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId, status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchOrders(); // Refresh orders after update
            }
        });
    }

    // Fetch orders every 5 seconds
    fetchOrders();
    setInterval(fetchOrders, 5000);
});