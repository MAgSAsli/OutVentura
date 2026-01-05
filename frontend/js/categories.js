
// Data produk populer
const popularProducts = [
    {
        id: 1,
        name: "Tenda Camping 2 Person Premium",
        price: 350000,
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        category: "Tenda",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Sleeping Bag Waterproof",
        price: 150000,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        category: "Tidur",
        badge: "Popular"
    },
    {
        id: 3,
        name: "Carrier 60L Pro",
        price: 300000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        category: "Carrier",
        badge: "New"
    },
    {
        id: 4,
        name: "Nesting Set Camping",
        price: 180000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        rating: 4.3,
        category: "Masak",
        badge: "Sale"
    }
];

// Inisialisasi halaman kategori
function initCategoriesPage() {
    updateCartCounter();
    loadPopularProducts();
    setupEventListeners();
    setupFAQ();
}

// Update cart counter
function updateCartCounter() {
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartCounter.textContent = totalItems;
        cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Load popular products
function loadPopularProducts() {
    const container = document.getElementById('popular-products');
    if (!container) return;
    
    container.innerHTML = popularProducts.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    const formattedPrice = new Intl.NumberFormat('id-ID').format(product.price);
    
    return `
        <div class="product-card" onclick="viewProduct(${product.id})">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">Rp ${formattedPrice}/hari</div>
                <div style="color: var(--gray-dark); font-size: 0.9rem; margin-bottom: 10px;">
                    <i class="fas fa-star" style="color: var(--warning-color);"></i> ${product.rating}
                    <span style="margin-left: 15px; color: var(--primary-color);">
                        <i class="fas fa-tag"></i> ${product.category}
                    </span>
                </div>
                <button onclick="addToCart(event, ${product.id})" class="btn-add-to-cart">
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `;
}

// View product detail
function viewProduct(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// View category products
function viewCategory(category) {
    // Simpan kategori yang dipilih di localStorage
    localStorage.setItem('selectedCategory', category);
    
    // Redirect ke halaman produk dengan filter kategori
    window.location.href = `products.html?category=${category}`;
}

// Add to cart
function addToCart(event, productId) {
    event.stopPropagation(); // Prevent card click
    
    const product = popularProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
        showNotification(`Jumlah "${product.name}" di keranjang diperbarui`, "success");
    } else {
        const productToAdd = {
            id: product.id,
            nama_alat: product.name,
            harga: product.price,
            gambar: product.image,
            kategori: product.category,
            quantity: 1
        };
        cart.push(productToAdd);
        showNotification(`"${product.name}" ditambahkan ke keranjang!`, "success");
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
}

// Show notification
function showNotification(message, type = "success") {
    const icon = type === "success" ? "fas fa-check-circle" : 
                 type === "warning" ? "fas fa-exclamation-triangle" : 
                 type === "danger" ? "fas fa-times-circle" : 
                 "fas fa-info-circle";
    
    const bgColor = type === "success" ? "var(--gradient-primary)" : 
                   type === "warning" ? "var(--gradient-accent)" : 
                   type === "danger" ? "linear-gradient(135deg, #e74c3c, #c0392b)" : 
                   "linear-gradient(135deg, #3498db, #2980b9)";
    
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    notification.style.background = bgColor;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Setup FAQ toggle
function setupFAQ() {
    const faqCards = document.querySelectorAll('.faq-card');
    
    faqCards.forEach(card => {
        const question = card.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other FAQs
            faqCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('active')) {
                    otherCard.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            card.classList.toggle('active');
        });
    });
}

// Navigation functions
function goToHome() {
    window.location.href = "Homepage.html";
}

function goToCart() {
    window.location.href = "cart.html";
}

function goToProfile() {
    const user = JSON.parse(localStorage.getItem("penyewa"));
    if (user) {
        window.location.href = "profile.html";
    } else {
        window.location.href = "login.html";
    }
}

// Newsletter subscription
function subscribeNewsletter() {
    const emailInput = document.querySelector('.newsletter-form input[type="email"]');
    if (emailInput && emailInput.value) {
        showNotification("Terima kasih! Anda telah berlangganan newsletter kami.", "success");
        emailInput.value = '';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            goToHome();
        });
    }
    
    // Back button
    const backBtn = document.querySelector('.btn-back-nav');
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            history.back();
        });
    }
    
    // Newsletter subscription
    const subscribeBtn = document.querySelector('.btn-subscribe');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            subscribeNewsletter();
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCategoriesPage);
