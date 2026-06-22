import express from "express";
import {
  createTransaksi,
  getRiwayat,
  getDetailTransaksi,
  getAllTransaksi,
  updateStatus,
  getLaporanBulanan,
  getPaymentStatus,
  handlePaymentNotification,
} from "../controller/transaksi.controller.js";
import { validate, transaksiSchema } from "../validations/schemas.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes (Midtrans callback - no auth needed)
router.post("/payment/notification", handlePaymentNotification);

// Protected Routes
router.post("/", verifyToken, validate(transaksiSchema), createTransaksi);
router.get("/", verifyToken, verifyRole(["admin", "pegawai"]), getAllTransaksi);
router.get("/laporan", verifyToken, verifyRole(["admin"]), getLaporanBulanan);
router.get("/payment/:order_id", verifyToken, getPaymentStatus);
router.get("/penyewa/:id_penyewa", verifyToken, getRiwayat);
router.get("/:id_transaksi/detail", verifyToken, getDetailTransaksi);
router.patch("/:id/status", verifyToken, verifyRole(["admin"]), updateStatus);

export default router;
