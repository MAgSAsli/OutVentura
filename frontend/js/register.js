async function register(){
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const pw = document.getElementById("password").value;
    const errBox = document.getElementById("error");

    errBox.innerText = "";

    const res = await API_PENYEWA.register({ nama: name, email, password: pw });

    if (res.error) {
        errBox.innerText = "❌ " + res.error;
        return;
    }

    window.location.href = "Homepage.html";

}

function goLogin(){
    window.location.href = "login.html";
}