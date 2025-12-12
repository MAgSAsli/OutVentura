const API = "http://localhost:5000/api";

async function loadAlat() {
    let res = await fetch(API + "/alat");
    let alat = await res.json();

    let html = "";
    alat.forEach(a => {
        html += `
            <div class="card">
                <img src="${a.gambar}" width="150">
                <h4>${a.nama_alat}</h4>
                <p>Rp ${a.harga}</p>
                <button onclick="detail(${a.id})">Detail</button>
            </div>
        `;
    });

    document.getElementById("alatList").innerHTML = html;
}

function detail(id) {
    window.location.href = "tenda.html?id=" + id;
}

function goCart() {
    window.location.href = "cart.html";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

loadAlat();
