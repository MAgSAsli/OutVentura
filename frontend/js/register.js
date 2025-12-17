const API = "http://localhost:5000/api";

async function register(event) {
  event.preventDefault(); // cegah reload form

  const inputs = document.querySelectorAll("form input");

  const nama = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const password = inputs[2].value;
  const confirm = inputs[3].value;

  if (!nama || !email || !password || !confirm) {
    alert("❌ Semua field wajib diisi");
    return;
  }

  if (password !== confirm) {
    alert("❌ Password tidak sama");
    return;
  }

  try {
    const res = await fetch(API + "/penyewa/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama,
        email,
        password,
        telepon: "-",
        alamat: "-"
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ " + (data.message || "Registrasi gagal"));
      return;
    }

    alert("✅ Registrasi berhasil, silakan login");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("❌ Server tidak dapat dihubungi");
  }
}

// Hubungkan ke form
document.querySelector("form").addEventListener("submit", register);
