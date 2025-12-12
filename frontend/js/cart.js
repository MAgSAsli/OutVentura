const API = "http://localhost:5000/api";

let cart = JSON.parse(localStorage.getItem("cart") || "[]");

function showCart() {
    let html = "";
    cart.forEach(c => {
        html += `
            <div class="card">
                <img src="${c.gambar}" width="150">
                <h4>${c.nama_alat}</h4>
                <p>Rp ${c.harga}</p>
            </div>
        `;
    });
    document.getElementById("cartItems").innerHTML = html;
}

async function checkout() {
    let user = JSON.parse(localStorage.getItem("user"));

    let res = await fetch(API + "/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_penyewa: user.id,
            cartItems: cart,
            total_harga: cart.reduce((t, c) => t + c.harga, 0),
            tanggal_mulai: "2025-01-01",
            tanggal_selesai: "2025-01-03"
        })
    });

    localStorage.removeItem("cart");
    alert("Transaksi berhasil!");
    window.location.href = "index.html";
}

showCart();
