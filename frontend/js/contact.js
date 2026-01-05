// Inisialisasi halaman kontak
function initContactPage() {
    updateCartCounter();
    setupEventListeners();
    setupFAQ();
    setupForm();
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

// Setup contact form
function setupForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value.trim();
        
        // Validate form
        if (!name || !email || !phone || !subject || !message) {
            showNotification('Harap isi semua field yang wajib diisi', 'warning');
            return;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Format email tidak valid', 'warning');
            return;
        }
        
        // Validate phone
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Format nomor telepon tidak valid', 'warning');
            return;
        }
        
        // Show loading
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Save contact message to localStorage (for demo)
            const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            const newMessage = {
                id: Date.now(),
                name,
                email,
                phone,
                subject,
                message,
                date: new Date().toISOString(),
                status: 'unread'
            };
            
            contactMessages.unshift(newMessage);
            localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
            
            // Show success message
            showNotification('Pesan Anda berhasil dikirim! Kami akan menghubungi Anda dalam 24 jam.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
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

// Map placeholder click
function viewMap() {
    showNotification("Fitur peta akan segera hadir!", "info");
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
    
    // Map placeholder
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', viewMap);
    }
    
    // Newsletter subscription
    const subscribeBtn = document.querySelector('.btn-subscribe');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            subscribeNewsletter();
        });
    }
    
    // Social media cards
    const socialCards = document.querySelectorAll('.social-card');
    socialCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.classList.contains('instagram') ? 'Instagram' :
                           this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('whatsapp') ? 'WhatsApp' : 'Twitter';
            showNotification(`Mengarahkan ke ${platform}...`, 'info');
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initContactPage);
