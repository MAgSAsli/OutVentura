const API = "http://localhost:5000/api";

async function login(event) {
  event.preventDefault(); // cegah reload form

  const email = document.querySelector('input[type="text"]').value.trim();
  const password = document.querySelector('input[type="password"]').value.trim();

  if (!email || !password) {
    alert(" Email dan password wajib diisi");
    return;
  }

  try {
    const res = await fetch(API + "/penyewa/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ " + (data.message || "Login gagal"));
      return;
    }

    // ✅ Simpan session login
    localStorage.setItem("penyewa", JSON.stringify(data));

    alert("✅ Login berhasil");
    globalThis.location.href = "Homepage.html"; // ke homepage

  } catch (err) {
    console.error(err);
    alert("❌ Server tidak dapat dihubungi");
  }
}

// Hubungkan ke form
document.querySelector("form").addEventListener("submit", login);
