import { API_PENYEWA } from "./api.js";

window.register = async function () {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pw = document.getElementById("password").value;
    const errBox = document.getElementById("error");

    errBox.innerText = "";

    if (!name || !email || !pw) {
        errBox.innerText = "❌ Semua field wajib diisi";
        return;
    }

    const res = await API_PENYEWA.register({
        nama: name,
        email: email,
        password: pw,
        telepon: "-",
        alamat: "-"
    });

    if (res.error || res.message?.includes("error")) {
        errBox.innerText = "❌ Registrasi gagal";
        return;
    }

    alert("✅ Registrasi berhasil, silakan login");
    window.location.href = "login.html";
};

window.goLogin = function () {
    window.location.href = "login.html";
};
