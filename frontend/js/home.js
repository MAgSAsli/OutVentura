// ================= CONFIG =================
const API_HOST = "http://localhost:8000";
const BASE_URL = API_HOST + "/api";

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    loadBestProducts();
    updateCartCounter();
    checkLoginStatus();
});

// ================= LOAD DATA FROM BACKEND =================
async function loadBestProducts() {
    const container = document.getElementById("best-products");
    if (!container) return;

    try {
        const res = await fetch(`${BASE_URL}/alat`);
        const data = await res.json();

        const products = data.slice(0, 4); // ambil 4 produk teratas
        container.innerHTML = products.map(p => createProductCard(p)).join("");
    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Gagal memuat produk.</p>";
    }
}

// ================= PRODUCT CARD =================
function createProductCard(p) {
    const harga = new Intl.NumberFormat("id-ID").format(p.harga);

    const gambar = p.gambar
        ? `${API_HOST}/uploads/${p.gambar}`
        : "https://via.placeholder.com/400x300?text=No+Image";

    return `
        <div class="product-card" onclick="viewProduct(${p.id})">
            <div class="product-image">
                <img 
                    src="${gambar}" 
                    alt="${p.nama_alat}"
                    onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'"
                >
            </div>
            <div class="product-info">
                <h3>${p.nama_alat}</h3>
                <div class="product-price">Rp ${harga}/hari</div>
                <div style="font-size: 0.85rem">Stok: ${p.stok}</div>
            </div>
        </div>
    `;
}

// ================= ADD TO CART =================
async function addToCart(event, id) {
    event.stopPropagation();

    try {
        const res = await fetch(`${BASE_URL}/alat/${id}`);
        const p = await res.json();

        if (p.stok <= 0) {
            showNotification("Stok habis", "danger");
            return;
        }

        let cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = cart.findIndex(item => item.id === p.id);

        if (idx !== -1) {
            cart[idx].quantity++;
        } else {
            cart.push({
                id: p.id,
                nama_alat: p.nama_alat,
                harga: p.harga,
                gambar: p.gambar,
                kategori: p.kategori,
                quantity: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCounter();
        showNotification(`${p.nama_alat} ditambahkan ke keranjang`);
    } catch (err) {
        console.error(err);
    }
}

// ================= CART COUNTER =================
function updateCartCounter() {
    const counter = document.getElementById("cart-counter");
    if (!counter) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    counter.textContent = total;
    counter.style.display = total > 0 ? "flex" : "none";
}

// ================= LOGIN STATUS =================
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem("penyewa"));
    const icon = document.querySelector(".user-icon");

    if (user && user.nama && icon) {
        icon.innerHTML = `<span>${user.nama.charAt(0)}</span>`;
        icon.title = `Halo, ${user.nama}`;
    }
}

// ================= NAVIGATION =================
function viewProduct(id) {
    window.location.href = `products.html?id=${id}`;
}
function goToProducts() { window.location.href = "products.html"; }
function goToCart() { window.location.href = "cart.html"; }
function goToHome() { window.location.href = "Homepage.html"; }
function goToProfile() {
    const user = JSON.parse(localStorage.getItem("penyewa"));
    window.location.href = user ? "profile.html" : "login.html";
}
function filterCategory(kategori) {
    localStorage.setItem("selectedCategory", kategori);
    window.location.href = "products.html";
}

// ================= NOTIFICATION =================
function showNotification(msg) {
    const notif = document.createElement("div");
    notif.className = "notification";
    notif.textContent = msg;

    document.body.appendChild(notif);
    setTimeout(() => notif.classList.add("show"), 10);
    setTimeout(() => {
        notif.classList.remove("show");
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}
