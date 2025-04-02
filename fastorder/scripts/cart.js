document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    const paymentForm = document.getElementById('payment-form');
    const cartCount = document.getElementById('cart-count');

    // Render order items
    function renderOrderItems() {
        orderItems.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center mb-4 pb-4 border-b">
                <div>
                    <h4 class="font-medium">${item.name}</h4>
                    <p class="text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <span class="font-medium">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderTotal.textContent = `$${total.toFixed(2)}`;
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Handle form submission
    paymentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderData = {
            items: cart,
            tableNumber: document.getElementById('table-number').value,
            specialNotes: document.getElementById('special-notes').value,
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            total: parseFloat(orderTotal.textContent.replace('$', '')),
            status: 'pending',
            timestamp: new Date().toISOString()
        };

        // Send order to server
        fetch('../php/order_handler.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear cart and redirect
                localStorage.removeItem('cart');
                window.location.href = 'order_confirmation.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error processing your order. Please try again.');
        });
    });

    // Initialize the page
    renderOrderItems();
});