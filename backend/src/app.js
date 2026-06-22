import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler, logger } from "./middleware/errorHandler.js";

import alatRoutes from "./routes/alat.routes.js";
import pegawaiRoutes from "./routes/pegawai.routes.js";
import penyewaRoutes from "./routes/penyewa.routes.js";
import transaksiRoutes from "./routes/transaksi.routes.js";

const app = express();

// 🔒 Security Middleware
app.use(helmet()); // Set various HTTP headers for security

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Terlalu banyak request dari IP ini, silakan coba lagi nanti",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 📋 PASANG ROUTES
app.use("/api/alat", alatRoutes);
app.use("/api/pegawai", pegawaiRoutes);
app.use("/api/penyewa", penyewaRoutes);
app.use("/api/transaksi", transaksiRoutes);

// TEST ROOT
app.get("/", (req, res) => {
  res.json({
    message: "🚀 OutVentura API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    path: req.path,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
