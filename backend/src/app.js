import express from "express";
import cors from "cors";

import alatRoutes from "./routes/alat.routes.js";
import pegawaiRoutes from "./routes/pegawai.routes.js";
import penyewaRoutes from "./routes/penyewa.routes.js";
import transaksiRoutes from "./routes/transaksi.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ PASANG ROUTES
app.use("/api/alat", alatRoutes);
app.use("/api/pegawai", pegawaiRoutes);
app.use("/api/penyewa", penyewaRoutes);
app.use("/api/transaksi", transaksiRoutes);

// TEST ROOT
app.get("/", (req, res) => {
  res.send("🚀 OutVentura API is running");
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ message: "Internal Server Error" });
});


export default app;
