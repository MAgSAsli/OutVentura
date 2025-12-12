async function login() {
    const email = document.getElementById("email").value;
    const pw = document.getElementById("password").value;
    const errBox = document.getElementById("error");

    errBox.innerText = "";

    const res = await API_PENYEWA.login({ email, password: pw });

    if (res.error) {
        errBox.innerText = "❌ " + res.error;
        return;
    }

    // Simpan session local
    localStorage.setItem("penyewa", JSON.stringify(res));

    window.location.href = "Homepage.html";  // masuk ke halaman utama
}

function goRegister() {
    window.location.href = "register.html";
}
