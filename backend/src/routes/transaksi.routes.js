import express from "express";
import { createTransaksi, getRiwayat, getDetailTransaksi, getAllTransaksi, updateStatus, getLaporanBulanan } from "../controller/transaksi.controller.js";

const router = express.Router();

router.post("/", createTransaksi);
router.get("/", getAllTransaksi);
router.get("/laporan", getLaporanBulanan);
router.get("/penyewa/:id_penyewa", getRiwayat);
router.get("/:id_transaksi/detail", getDetailTransaksi);
router.patch("/:id/status", updateStatus);

export default router;
