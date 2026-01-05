const API = "http://localhost:5000/api";

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let user = JSON.parse(localStorage.getItem("user") || '{"id": 1, "nama": "Guest"}');

// Data rekomendasi produk
const recommendedProducts = [
    {
        id: 5,
        nama_alat: "Headlamp LED",
        harga: 75000,
        gambar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        kategori: "Penerangan",
        stok: 20
    },
    {
        id: 6,
        nama_alat: "Matras Camping",
        harga: 120000,
        gambar: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        kategori: "Peralatan Tidur",
        stok: 15
    },
    {
        id: 7,
        nama_alat: "Nesting Set",
        harga: 180000,
        gambar: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        kategori: "Peralatan Masak",
        stok: 12
    },
    {
        id: 8,
        nama_alat: "Flysheet Tenda",
        harga: 250000,
        gambar: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        kategori: "Aksesoris Tenda",
        stok: 8
    }
];

// Debug function
function debug(message, data = null) {
    console.log(`[DEBUG] ${message}`, data || '');
}

// Initialize cart on page load
function initCart() {
    debug('Initializing cart...');
    showCart();
    updateCartStats();
    setupEventListeners();
}

function showCart() {
    debug('Showing cart items', cart);
    const cartContainer = document.getElementById('cartItems');
    
    if (!cartContainer) {
        debug('Cart container not found!');
        return;
    }
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3>Keranjang Belanja Kosong</h3>
                <p>Tambahkan beberapa alat petualangan untuk memulai!</p>
                <button id="exploreBtn" class="btn-explore">
                    <i class="fas fa-compass"></i> Jelajahi Produk
                </button>
            </div>
        `;
        updateCartStats();
        updateSummary();
        loadRecommendations();
        return;
    }

    let html = '';
    cart.forEach((item, index) => {
        const formattedHarga = new Intl.NumberFormat('id-ID').format(item.harga);
        const totalPrice = item.harga * (item.quantity || 1);
        const formattedTotal = new Intl.NumberFormat('id-ID').format(totalPrice);
        
        html += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.gambar}" alt="${item.nama_alat}" onerror="this.src='https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-header">
                        <h3>${item.nama_alat}</h3>
                        <div class="cart-item-meta">
                            <span class="cart-item-category">${item.kategori || 'Alat Outdoor'}</span>
                            <span class="cart-item-brand">${item.merek || 'Outventura'}</span>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button type="button" class="quantity-btn decrease-btn" data-index="${index}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="text" class="quantity-input" value="${item.quantity || 1}" 
                                   data-index="${index}" min="1" max="${item.stok || 10}">
                            <button type="button" class="quantity-btn increase-btn" data-index="${index}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button type="button" class="btn-remove" data-index="${index}">
                            <i class="fas fa-trash-alt"></i> Hapus
                        </button>
                    </div>
                </div>
                <div class="cart-item-pricing">
                    <div class="item-price">Rp ${formattedHarga}/hari</div>
                    <div class="item-total">Rp ${formattedTotal}</div>
                </div>
            </div>
        `;
    });

    cartContainer.innerHTML = html;
    updateCartStats();
    updateSummary();
    updateRentalDuration();
    loadRecommendations();
}

function updateCartStats() {
    const itemCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    const totalPrice = cart.reduce((total, item) => total + (item.harga * (item.quantity || 1)), 0);
    const formattedTotal = new Intl.NumberFormat('id-ID').format(totalPrice);
    
    const itemCountEl = document.getElementById('item-count');
    const totalPriceEl = document.getElementById('total-price');
    
    if (itemCountEl) itemCountEl.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
    if (totalPriceEl) totalPriceEl.textContent = `Rp ${formattedTotal}`;
    
    // Update counter di header
    const cartCounter = document.getElementById('cart-counter');
    if (cartCounter) {
        cartCounter.textContent = itemCount;
        cartCounter.style.display = itemCount > 0 ? 'flex' : 'none';
    }
}

function updateSummary() {
    const subtotalEl = document.getElementById('subtotal');
    const serviceFeeEl = document.getElementById('service-fee');
    const insuranceEl = document.getElementById('insurance');
    const discountEl = document.getElementById('discount');
    const grandTotalEl = document.getElementById('grand-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    if (cart.length === 0) {
        if (subtotalEl) subtotalEl.textContent = 'Rp 0';
        if (serviceFeeEl) serviceFeeEl.textContent = 'Rp 0';
        if (insuranceEl) insuranceEl.textContent = 'Rp 0';
        if (discountEl) discountEl.textContent = '-Rp 0';
        if (grandTotalEl) grandTotalEl.textContent = 'Rp 0';
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (clearBtn) clearBtn.style.display = 'none';
        return;
    }
    
    if (clearBtn) clearBtn.style.display = 'flex';
    
    const subtotal = cart.reduce((total, item) => total + (item.harga * (item.quantity || 1)), 0);
    const serviceFee = Math.round(subtotal * 0.05);
    const insurance = Math.round(subtotal * 0.03);
    const discount = cart.length >= 3 ? Math.round(subtotal * 0.1) : 0;
    const grandTotal = subtotal + serviceFee + insurance - discount;
    
    if (subtotalEl) subtotalEl.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(subtotal)}`;
    if (serviceFeeEl) serviceFeeEl.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(serviceFee)}`;
    if (insuranceEl) insuranceEl.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(insurance)}`;
    if (discountEl) discountEl.textContent = `-Rp ${new Intl.NumberFormat('id-ID').format(discount)}`;
    if (grandTotalEl) grandTotalEl.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(grandTotal)}`;
    if (checkoutBtn) checkoutBtn.disabled = false;
}

function updateQuantity(index, change) {
    if (!cart[index]) {
        debug('Item not found at index:', index);
        return;
    }
    
    const currentQuantity = cart[index].quantity || 1;
    const newQuantity = currentQuantity + change;
    
    if (newQuantity < 1) {
        removeItem(index);
        return;
    }
    
    const maxStock = cart[index].stok || 10;
    if (newQuantity > maxStock) {
        showNotification(`Stok tersedia hanya ${maxStock} unit`, 'warning');
        return;
    }
    
    cart[index].quantity = newQuantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
    showNotification(`Jumlah "${cart[index].nama_alat}" diperbarui menjadi ${newQuantity}`, 'success');
}

function changeQuantity(index, value) {
    const quantity = parseInt(value);
    if (isNaN(quantity) || quantity < 1) {
        // Reset to current quantity
        showCart();
        return;
    }
    
    const maxStock = cart[index].stok || 10;
    if (quantity > maxStock) {
        showNotification(`Stok tersedia hanya ${maxStock} unit`, 'warning');
        cart[index].quantity = maxStock;
    } else {
        cart[index].quantity = quantity;
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
}

function removeItem(index) {
    const itemName = cart[index].nama_alat;
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();
    showNotification(`"${itemName}" dihapus dari keranjang`, 'info');
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Apakah Anda yakin ingin mengosongkan keranjang belanja?')) {
        cart = [];
        localStorage.removeItem("cart");
        showCart();
        showNotification('Keranjang belanja telah dikosongkan', 'info');
    }
}

function updateRentalDuration() {
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const durationElement = document.getElementById('duration');
    
    if (!startDate || !endDate || !durationElement) return;
    
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    durationElement.textContent = `Durasi: ${diffDays} hari`;
}

function checkout() {
    debug('Checkout button clicked');
    
    if (cart.length === 0) {
        showNotification('Keranjang belanja kosong!', 'warning');
        return;
    }
    
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!startDate || !endDate) {
        showNotification('Silakan pilih tanggal sewa', 'warning');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
        showNotification('Tanggal selesai harus setelah tanggal mulai', 'warning');
        return;
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.harga * (item.quantity || 1)), 0);
    const serviceFee = Math.round(subtotal * 0.05);
    const insurance = Math.round(subtotal * 0.03);
    const discount = cart.length >= 3 ? Math.round(subtotal * 0.1) : 0;
    const total_harga = subtotal + serviceFee + insurance - discount;
    
    const confirmation = confirm(`Total pembayaran: Rp ${new Intl.NumberFormat('id-ID').format(total_harga)}\n\nLanjutkan checkout?`);
    
    if (!confirmation) return;
    
    try {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            checkoutBtn.disabled = true;
        }
        
        // Simulasi API call
        setTimeout(() => {
            showNotification('Transaksi berhasil! Pesanan Anda sedang diproses.', 'success');
            
            const transaction = {
                id: Date.now(),
                tanggal: new Date().toISOString().split('T')[0],
                items: [...cart],
                total: total_harga,
                status: 'Diproses'
            };
            
            let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
            transactions.unshift(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));
            
            localStorage.removeItem("cart");
            cart = [];
            
            setTimeout(() => {
                window.location.href = "checkout-success.html";
            }, 2000);
        }, 1500);
        
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Terjadi kesalahan saat proses checkout', 'danger');
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.innerHTML = '<i class="fas fa-lock"></i> Lanjut ke Pembayaran';
            checkoutBtn.disabled = false;
        }
    }
}

function loadRecommendations() {
    const recommendationsContainer = document.getElementById('recommendations');
    if (!recommendationsContainer) return;
    
    recommendationsContainer.innerHTML = recommendedProducts.map(product => {
        const formattedPrice = new Intl.NumberFormat('id-ID').format(product.harga);
        const stockClass = product.stok > 10 ? "in-stock" : product.stok > 0 ? "low-stock" : "out-of-stock";
        const stockText = product.stok > 0 ? `${product.stok} tersedia` : "Stok habis";
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.gambar}" alt="${product.nama_alat}">
                </div>
                <div class="product-info">
                    <h3>${product.nama_alat}</h3>
                    <div class="product-price">Rp ${formattedPrice}/hari</div>
                    <span class="stock-badge ${stockClass}" style="font-size: 0.9rem;">
                        <i class="fas fa-box"></i> ${stockText}
                    </span>
                    <button type="button" class="btn-add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function addToCartFromRecommendation(productId) {
    debug('Adding product to cart:', productId);
    const product = recommendedProducts.find(p => p.id === productId);
    if (!product) {
        debug('Product not found');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    this.cart = cart; // Update global cart variable
    showCart();
    showNotification(`"${product.nama_alat}" ditambahkan ke keranjang`, 'success');
}

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

// Navigation functions
function goToHome() {
    window.location.href = "Homepage.html";
}

function goToProducts() {
    window.location.href = "products.html";
}

function goToProfile() {
    const user = JSON.parse(localStorage.getItem("penyewa"));
    if (user) {
        window.location.href = "profile.html";
    } else {
        window.location.href = "login.html";
    }
}

function continueShopping() {
    window.location.href = "products.html";
}

// Event Delegation Setup
function setupEventListeners() {
    debug('Setting up event listeners');
    
    // Event delegation untuk cart items - DIPERBAIKI
    document.addEventListener('click', function(e) {
        debug('Click event target:', e.target);
        debug('Click event class:', e.target.className);
        
        // Quantity decrease button
        if (e.target.classList.contains('decrease-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            debug('Decrease button clicked for index:', index);
            updateQuantity(index, -1);
            return;
        }
        
        // Quantity increase button
        if (e.target.classList.contains('increase-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            debug('Increase button clicked for index:', index);
            updateQuantity(index, 1);
            return;
        }
        
        // Icon dalam tombol quantity
        if (e.target.parentElement) {
            const parent = e.target.parentElement;
            if (parent.classList.contains('decrease-btn')) {
                const index = parseInt(parent.getAttribute('data-index'));
                updateQuantity(index, -1);
                return;
            }
            if (parent.classList.contains('increase-btn')) {
                const index = parseInt(parent.getAttribute('data-index'));
                updateQuantity(index, 1);
                return;
            }
        }
        
        // Remove button
        if (e.target.classList.contains('btn-remove')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            debug('Remove button clicked for index:', index);
            removeItem(index);
            return;
        }
        
        // Icon dalam remove button
        if (e.target.parentElement && e.target.parentElement.classList.contains('btn-remove')) {
            const index = parseInt(e.target.parentElement.getAttribute('data-index'));
            removeItem(index);
            return;
        }
        
        // Clear cart button
        if (e.target.id === 'clear-btn') {
            debug('Clear cart button clicked');
            clearCart();
            return;
        }
        
        // Text dalam clear cart button
        if (e.target.parentElement && e.target.parentElement.id === 'clear-btn') {
            debug('Clear cart parent clicked');
            clearCart();
            return;
        }
        
        // Explore button in empty cart
        if (e.target.id === 'exploreBtn') {
            debug('Explore button clicked');
            goToProducts();
            return;
        }
        
        // Icon dalam explore button
        if (e.target.parentElement && e.target.parentElement.id === 'exploreBtn') {
            goToProducts();
            return;
        }
        
        // Add to cart from recommendations
        if (e.target.classList.contains('btn-add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            debug('Add to cart button clicked for product:', productId);
            addToCartFromRecommendation(productId);
            return;
        }
        
        // Icon dalam add to cart button
        if (e.target.parentElement && e.target.parentElement.classList.contains('btn-add-to-cart')) {
            const productId = parseInt(e.target.parentElement.getAttribute('data-id'));
            addToCartFromRecommendation(productId);
            return;
        }
        
        // Product card click (go to detail) - FIXED
        const productCard = e.target.closest('.product-card');
        if (productCard && !e.target.classList.contains('btn-add-to-cart') && 
            !e.target.parentElement.classList.contains('btn-add-to-cart')) {
            const addToCartBtn = productCard.querySelector('.btn-add-to-cart');
            if (addToCartBtn) {
                const productId = addToCartBtn.getAttribute('data-id');
                if (productId) {
                    window.location.href = `detail.html?id=${productId}`;
                }
            }
            return;
        }
    });
    
    // Input changes - DIPERBAIKI
    document.addEventListener('input', function(e) {
        // Quantity input change
        if (e.target.classList.contains('quantity-input')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            const value = e.target.value;
            debug('Quantity input changed:', {index, value});
            changeQuantity(index, value);
        }
    });
    
    // Date changes
    document.addEventListener('change', function(e) {
        if (e.target.id === 'start-date' || e.target.id === 'end-date') {
            updateRentalDuration();
        }
    });
    
    // Direct button event listeners (untuk button yang ada di awal load)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            debug('Checkout button clicked via direct listener');
            checkout();
        });
    }
    
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function(e) {
            e.preventDefault();
            debug('Continue shopping button clicked');
            continueShopping();
        });
    }
    
    const backNavBtn = document.querySelector('.btn-back-nav');
    if (backNavBtn) {
        backNavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            debug('Back button clicked');
            history.back();
        });
    }
    
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            debug('Cart icon clicked');
            // Already on cart page, do nothing
            showCart();
        });
    }
    
    // Tombol tambahan di homepage
    const exploreBtnStatic = document.getElementById('exploreBtn');
    if (exploreBtnStatic) {
        exploreBtnStatic.addEventListener('click', function(e) {
            e.preventDefault();
            debug('Explore button (static) clicked');
            goToProducts();
        });
    }
}

// Initialize on page load - DIPERBAIKI
document.addEventListener('DOMContentLoaded', function() {
    debug('Page loaded, initializing...');
    
    // Set tanggal default
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    if (startDateInput) {
        startDateInput.min = today.toISOString().split('T')[0];
        startDateInput.value = today.toISOString().split('T')[0];
        debug('Start date set to:', startDateInput.value);
        
        // Tambah event listener untuk perubahan tanggal
        startDateInput.addEventListener('change', updateRentalDuration);
    }
    
    if (endDateInput) {
        endDateInput.min = today.toISOString().split('T')[0];
        endDateInput.value = nextWeek.toISOString().split('T')[0];
        debug('End date set to:', endDateInput.value);
        
        // Tambah event listener untuk perubahan tanggal
        endDateInput.addEventListener('change', updateRentalDuration);
    }
    
    // Initialize cart
    initCart();
    
    // Update rental duration awal
    updateRentalDuration();
    
    // Add debug info to page
    const debugInfo = document.createElement('div');
    debugInfo.style.cssText = 'position:fixed;bottom:10px;left:10px;background:rgba(0,0,0,0.7);color:white;padding:5px;font-size:12px;z-index:9999;border-radius:5px;';
    debugInfo.textContent = `Cart Items: ${cart.length}`;
    document.body.appendChild(debugInfo);
});
