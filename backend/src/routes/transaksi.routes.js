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

const router = express.Router();

router.post("/", createTransaksi);
router.get("/", getAllTransaksi);
router.get("/laporan", getLaporanBulanan);
router.post("/payment/notification", handlePaymentNotification);
router.get("/payment/:order_id", getPaymentStatus);
router.get("/penyewa/:id_penyewa", getRiwayat);
router.get("/:id_transaksi/detail", getDetailTransaksi);
router.patch("/:id/status", updateStatus);

export default router;
