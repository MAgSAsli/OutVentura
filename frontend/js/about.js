// ===== ABOUT PAGE SCRIPT =====

// Inisialisasi halaman about
function initAboutPage() {
    updateCartCounter();
    checkLoginStatus();
    setupEventListeners();
    
    // Tambahkan efek animasi saat scroll
    setupScrollAnimations();
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

// Check login status
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("penyewa"));
    const userIcon = document.querySelector('.user-icon');
    
    if (user && user.nama) {
        // Update user icon with name initial
        if (userIcon) {
            userIcon.innerHTML = `<span style="font-size: 0.9rem; font-weight: 600;">${user.nama.charAt(0)}</span>`;
            userIcon.title = `Halo, ${user.nama}`;
        }
    }
}

// Fungsi untuk kembali ke halaman sebelumnya
function goBack() {
    // Cek apakah ada halaman sebelumnya di history
    if (document.referrer && document.referrer.includes(window.location.hostname)) {
        history.back();
    } else {
        // Jika tidak ada halaman sebelumnya, redirect ke homepage
        window.location.href = "Homepage.html";
    }
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

// Subscribe newsletter
function subscribeNewsletter() {
    const emailInput = document.querySelector('.newsletter-form input[type="email"]');
    if (emailInput && emailInput.value) {
        if (isValidEmail(emailInput.value)) {
            showNotification("Terima kasih! Anda telah berlangganan newsletter kami.", "success");
            emailInput.value = '';
        } else {
            showNotification("Format email tidak valid. Silakan coba lagi.", "danger");
        }
    } else {
        showNotification("Silakan masukkan email Anda.", "warning");
    }
}

// Validasi email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

// Setup scroll animations for elements
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.value-card, .team-card, .mission-card, .vision-card').forEach(el => {
        observer.observe(el);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Tombol back
    const backButton = document.querySelector('.btn-back-nav');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            goBack();
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
    
    // Cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            goToCart();
        });
    }
    
    // User icon
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            goToProfile();
        });
    }
    
    // Newsletter subscription form
    const subscribeBtn = document.querySelector('.btn-subscribe');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            subscribeNewsletter();
        });
    }
    
    // Enter key in newsletter input
    const newsletterInput = document.querySelector('.newsletter-form input[type="email"]');
    if (newsletterInput) {
        newsletterInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                subscribeNewsletter();
            }
        });
    }
    
    // Social links click (for demo purposes)
    document.querySelectorAll('.team-social a, .social-icons a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification("Fitur ini dalam pengembangan", "info");
        });
    });
    
    // Footer links (mencegah redirect halaman)
    document.querySelectorAll('.footer-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification("Navigasi ke " + this.textContent + " dalam pengembangan", "info");
        });
    });
}

// Team member hover effect enhancement
function enhanceTeamHover() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const avatar = this.querySelector('.team-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const avatar = this.querySelector('.team-avatar');
            if (avatar) {
                avatar.style.transform = 'scale(1)';
            }
        });
    });
}

// Animate stats counters
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const originalText = stat.textContent;
        let target;
        
        // Parse angka dari teks (misal: "500+", "4.8/5", dll)
        if (originalText.includes('+')) {
            target = parseInt(originalText);
        } else if (originalText.includes('/')) {
            target = parseFloat(originalText.split('/')[0]);
        } else {
            target = parseInt(originalText);
        }
        
        if (!isNaN(target)) {
            const increment = target / 50; // lebih lambat untuk efek lebih smooth
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                    stat.textContent = originalText; // Kembalikan ke teks asli
                } else {
                    // Format angka sesuai tipe aslinya
                    if (originalText.includes('+')) {
                        stat.textContent = Math.floor(current) + '+';
                    } else if (originalText.includes('/')) {
                        stat.textContent = current.toFixed(1) + '/5';
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }
            }, 30);
        }
    });
}

// Initialize stats animation when in view
function initStatsAnimation() {
    const statsSection = document.querySelector('.stats-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
    enhanceTeamHover();
    initStatsAnimation();
});