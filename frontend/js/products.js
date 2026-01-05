
// Data produk contoh
const productsData = [
    {
        id: 1,
        name: "Tenda Camping 2 Person Premium",
        category: "tenda",
        price: 350000,
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 12,
        rating: 4.8,
        description: "Tenda waterproof untuk 2 orang, mudah dipasang",
        badge: "Popular"
    },
    {
        id: 2,
        name: "Sleeping Bag Waterproof",
        category: "tidur",
        price: 150000,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 15,
        rating: 4.5,
        description: "Sleeping bag tahan air untuk kenyamanan maksimal",
        badge: "Best Seller"
    },
    {
        id: 3,
        name: "Kompor Portable Gas",
        category: "masak",
        price: 200000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 8,
        rating: 4.7,
        description: "Kompor praktis untuk memasak di alam",
        badge: null
    },
    {
        id: 4,
        name: "Carrier 60L Pro",
        category: "carrier",
        price: 300000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 5,
        rating: 4.9,
        description: "Carrier kapasitas besar dengan sistem ventilasi",
        badge: "New"
    },
    {
        id: 5,
        name: "Headlamp LED Bright",
        category: "aksesoris",
        price: 75000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        stock: 20,
        rating: 4.4,
        description: "Headlamp dengan sinar terang untuk malam hari",
        badge: null
    },
    {
        id: 6,
        name: "Matras Camping Inflatable",
        category: "tidur",
        price: 120000,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        stock: 10,
        rating: 4.6,
        description: "Matras tiup untuk kenyamanan tidur outdoor",
        badge: null
    },
    {
        id: 7,
        name: "Nesting Set Camping",
        category: "masak",
        price: 180000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 12,
        rating: 4.3,
        description: "Set peralatan masak nesting lengkap",
        badge: "Sale"
    },
    {
        id: 8,
        name: "Tenda Family 6 Person",
        category: "tenda",
        price: 500000,
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 3,
        rating: 4.9,
        description: "Tenda besar untuk keluarga atau kelompok",
        badge: null
    },
    {
        id: 9,
        name: "Trekking Pole Aluminum",
        category: "aksesoris",
        price: 90000,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        stock: 18,
        rating: 4.2,
        description: "Tongkat trekking ringan dan kuat",
        badge: null
    },
    {
        id: 10,
        name: "Cooler Box 25L",
        category: "aksesoris",
        price: 150000,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        stock: 7,
        rating: 4.7,
        description: "Cooler box untuk menjaga makanan tetap segar",
        badge: null
    },
    {
        id: 11,
        name: "Hammock Camping",
        category: "tidur",
        price: 80000,
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 14,
        rating: 4.8,
        description: "Hammock untuk bersantai di alam",
        badge: null
    },
    {
        id: 12,
        name: "Survival Kit Complete",
        category: "aksesoris",
        price: 250000,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        stock: 6,
        rating: 4.9,
        description: "Kit survival lengkap untuk emergency",
        badge: "Limited"
    }
];

let currentProducts = [...productsData];
let currentPage = 1;
const productsPerPage = 8;

// Inisialisasi halaman
function initProductsPage() {
    updateCartCounter();
    loadProducts();
    setupEventListeners();
    updatePriceSlider();
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

// Load products
function loadProducts() {
    const container = document.getElementById('products-container');
    const loading = document.getElementById('loading');
    const emptyState = document.getElementById('empty-state');
    
    if (loading) loading.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    
    setTimeout(() => {
        if (currentProducts.length === 0) {
            container.innerHTML = '';
            if (loading) loading.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const pageProducts = currentProducts.slice(startIndex, endIndex);
        
        container.innerHTML = pageProducts.map(product => createProductCard(product)).join('');
        
        updateProductsCount();
        updatePagination();
        
        if (loading) loading.style.display = 'none';
    }, 500);
}

// Create product card HTML
function createProductCard(product) {
    const formattedPrice = new Intl.NumberFormat('id-ID').format(product.price);
    const stockClass = product.stock > 10 ? "in-stock" : product.stock > 0 ? "low-stock" : "out-of-stock";
    const stockText = product.stock > 0 ? `${product.stock} tersedia` : "Stok habis";
    
    // Category icon
    const categoryIcons = {
        tenda: "fas fa-campground",
        tidur: "fas fa-bed",
        masak: "fas fa-utensils",
        carrier: "fas fa-hiking",
        aksesoris: "fas fa-tools"
    };
    
    const categoryIcon = categoryIcons[product.category] || "fas fa-box";
    
    return `
        <div class="product-card" data-id="${product.id}" onclick="viewProduct(${product.id})">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'">
                <div class="product-overlay">
                    <p>${product.description}</p>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-category">
                    <i class="${categoryIcon}"></i> ${getCategoryName(product.category)}
                </div>
                <div class="product-price">
                    Rp ${formattedPrice} <small>/hari</small>
                </div>
                <div class="product-meta">
                    <span class="stock-badge ${stockClass}">
                        <i class="fas fa-box"></i> ${stockText}
                    </span>
                    <span class="product-rating">
                        <i class="fas fa-star"></i> ${product.rating}
                    </span>
                </div>
                <button onclick="addToCartFromProduct(event, ${product.id})" class="btn-add-to-cart" ${product.stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-cart-plus"></i> Tambah ke Keranjang
                </button>
            </div>
        </div>
    `;
}

// Get category name
function getCategoryName(category) {
    const categories = {
        tenda: "Tenda Camping",
        tidur: "Perlengkapan Tidur",
        masak: "Peralatan Masak",
        carrier: "Carrier & Tas",
        aksesoris: "Aksesoris Outdoor"
    };
    return categories[category] || category;
}

// Update products count
function updateProductsCount() {
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = `${currentProducts.length} produk tersedia`;
    }
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Update page numbers (simplified for demo)
    const pageNumbers = document.querySelector('.page-numbers');
    if (pageNumbers && totalPages > 1) {
        let numbersHtml = '';
        for (let i = 1; i <= Math.min(3, totalPages); i++) {
            numbersHtml += `<span class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</span>`;
        }
        if (totalPages > 3) {
            numbersHtml += '<span class="page-number">...</span>';
        }
        pageNumbers.innerHTML = numbersHtml;
    }
}

// Filter products
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    
    const maxPrice = parseInt(document.getElementById('price-slider').value);
    const sortBy = document.getElementById('sort-select').value;
    const stockOnly = document.getElementById('stock-only').checked;
    
    // Filter by category
    let filtered = productsData.filter(product => 
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
    );
    
    // Filter by price
    filtered = filtered.filter(product => product.price <= maxPrice);
    
    // Filter by stock
    if (stockOnly) {
        filtered = filtered.filter(product => product.stock > 0);
    }
    
    // Sort products
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.rating - a.rating;
            case 'new':
                return b.id - a.id;
            default: // popular
                return (b.rating * 10 + b.stock) - (a.rating * 10 + a.stock);
        }
    });
    
    currentProducts = filtered;
    currentPage = 1;
    loadProducts();
}

// Reset filters
function resetFilters() {
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = true);
    document.getElementById('price-slider').value = 1000000;
    document.getElementById('sort-select').value = 'popular';
    document.getElementById('stock-only').checked = true;
    updatePriceSlider();
    
    currentProducts = [...productsData];
    currentPage = 1;
    loadProducts();
}

// Update price slider display
function updatePriceSlider() {
    const slider = document.getElementById('price-slider');
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    
    if (slider && minPrice && maxPrice) {
        const value = parseInt(slider.value);
        maxPrice.textContent = `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
    }
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (!searchTerm) {
        currentProducts = [...productsData];
    } else {
        currentProducts = productsData.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            getCategoryName(product.category).toLowerCase().includes(searchTerm)
        );
    }
    
    currentPage = 1;
    loadProducts();
}

// Pagination functions
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function nextPage() {
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(currentProducts.length / productsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        loadProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// View product detail
function viewProduct(productId) {
    window.location.href = `detail.html?id=${productId}`;
}

// Add to cart from product list
function addToCartFromProduct(event, productId) {
    event.stopPropagation(); // Prevent card click
    
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    if (product.stock === 0) {
        showNotification("Maaf, stok produk ini habis!", "warning");
        return;
    }
    
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
            kategori: getCategoryName(product.category),
            stok: product.stock,
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

// Navigation functions
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

function goToHome() {
    window.location.href = "Homepage.html";
}

// Setup event listeners
function setupEventListeners() {
    // Price slider
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
        priceSlider.addEventListener('input', updatePriceSlider);
    }
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    // Logo click
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            goToHome();
        });
    }
    
    // Filter apply button
    const applyBtn = document.querySelector('.btn-apply');
    if (applyBtn) {
        applyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Filter reset button
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetFilters();
        });
    }
    
    // Filter checkboxes
    document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.addEventListener('change', applyFilters);
    });
    
    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
    
    // Stock checkbox
    const stockCheckbox = document.getElementById('stock-only');
    if (stockCheckbox) {
        stockCheckbox.addEventListener('change', applyFilters);
    }
    
    // Newsletter subscription
    const subscribeBtn = document.querySelector('.btn-subscribe');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = this.closest('.newsletter-form').querySelector('input[type="email"]');
            if (emailInput.value) {
                showNotification("Terima kasih! Anda telah berlangganan newsletter.", "success");
                emailInput.value = '';
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProductsPage);
