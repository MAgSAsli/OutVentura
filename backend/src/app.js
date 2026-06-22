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

// Trust proxy for Vercel/reverse proxy environments
app.set('trust proxy', 1);

// Security
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} tidak diizinkan`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak request dari IP ini, silakan coba lagi nanti",
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
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
