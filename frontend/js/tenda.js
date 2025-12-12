const API = "http://localhost:5000/api";

let params = new URLSearchParams(location.search);
let id = params.get("id");
let alat = null;

async function loadDetail() {
    let res = await fetch(API + "/alat/" + id);
    alat = await res.json();

    document.getElementById("detail").innerHTML = `
        <img src="${alat.gambar}" width="200">
        <h2>${alat.nama_alat}</h2>
        <p>Harga: Rp ${alat.harga}</p>
        <p>Stock: ${alat.stok}</p>
    `;
}

function addToCart() {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(alat);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Ditambahkan ke cart!");
}

function goCart() {
    window.location.href = "cart.html";
}

loadDetail();
