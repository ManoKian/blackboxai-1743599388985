// Sample menu data (would normally come from PHP API)
const menuItems = [
    {
        id: 1,
        name: "Grilled Chicken Salad",
        price: 8.99,
        category: "main",
        image: "https://images.pexels.com/photos/3760442/pexels-photo-3760442.jpeg"
    },
    {
        id: 2,
        name: "Beef Burger",
        price: 6.99,
        category: "main",
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg"
    },
    {
        id: 3,
        name: "Chocolate Cake",
        price: 4.99,
        category: "dessert",
        image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg"
    }
];

// DOM Elements
const menuContainer = document.getElementById('menu-items');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
function init() {
    renderMenu();
    updateCartCount();
    setupEventListeners();
}

// Render menu items
function renderMenu() {
    menuContainer.innerHTML = menuItems.map(item => `
        <div class="bg-white shadow-md p-4 rounded-lg">
            <img src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover rounded-t-lg">
            <h3 class="text-lg font-semibold mt-2">${item.name}</h3>
            <p class="text-gray-600">$${item.price.toFixed(2)}</p>
            <button onclick="addToCart(${item.id})" 
                    class="mt-2 w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Add item to cart
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({...item, quantity: 1});
    }
    
    updateCart();
    showCart();
}

// Update cart in localStorage and UI
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Render cart items
function renderCartItems() {
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="flex justify-between items-center mb-2 pb-2 border-b">
            <div>
                <h4 class="font-medium">${item.name}</h4>
                <p class="text-gray-600">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="flex items-center">
                <button onclick="updateQuantity(${item.id}, -1)" class="px-2 text-gray-500">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="px-2 text-gray-500">+</button>
                <button onclick="removeFromCart(${item.id})" class="ml-2 text-red-500">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
        updateCart();
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(i => i.id !== itemId);
    updateCart();
}

// Show cart modal
function showCart() {
    cartModal.classList.remove('hidden');
}

// Hide cart modal
function hideCart() {
    cartModal.classList.add('hidden');
}

// Setup event listeners
function setupEventListeners() {
    cartBtn.addEventListener('click', showCart);
    closeCart.addEventListener('click', hideCart);
    checkoutBtn.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);

// Make functions available globally
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;