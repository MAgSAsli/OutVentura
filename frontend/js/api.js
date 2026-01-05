const API = "http://localhost:8000/api";

// Penyewa
const API_PENYEWA = {
    register: (data) =>
        fetch(API + "/penyewa/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(r => r.json()),

    login: (data) =>
        fetch(API + "/penyewa/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(r => r.json()),

    all: () => fetch(API + "/penyewa").then(r => r.json()),
};

// Alat
const API_ALAT = {
  all: async () => {
    const res = await fetch(`${BASE_URL}/alat`);
    return res.json();
  }
}

// Transaksi
const API_TRANS = {
    checkout: (data) =>
        fetch(API + "/transaksi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(r => r.json()),
};
