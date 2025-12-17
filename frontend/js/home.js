// ================== CEK SESSION LOGIN ==================
const penyewa = JSON.parse(localStorage.getItem("penyewa"));

// Ambil elemen navbar
const navLinks = document.querySelector(".nav-links");

if (penyewa && penyewa.nama) {
  // Hapus menu "Masuk"
  const loginLink = document.querySelector('.nav-links a[href="login.html"]');
  if (loginLink) {
    loginLink.parentElement.remove();
  }

  // Tambah info user
  const liUser = document.createElement("li");
  liUser.innerHTML = `
    <span style="font-weight:600;">👤 ${penyewa.nama}</span>
  `;

  // Tombol logout
  const liLogout = document.createElement("li");
  liLogout.innerHTML = `
    <a href="#" id="logoutBtn" style="color:#ffdddd;">Logout</a>
  `;

  navLinks.appendChild(liUser);
  navLinks.appendChild(liLogout);

  // Logout handler
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("penyewa");
    alert("✅ Berhasil logout");
    window.location.href = "login.html";
  });

} else {
  // ❌ Belum login (optional redirect)
  console.log("User belum login");
  // window.location.href = "login.html"; // aktifkan jika mau proteksi
}
