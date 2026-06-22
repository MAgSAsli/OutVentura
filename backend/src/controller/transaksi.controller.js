import * as service from "../services/transaksi.service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const createTransaksi = asyncHandler(async (req, res) => {
  const result = await service.createTransaksi(req.body);

  res.status(201).json({
    success: true,
    message: "Transaksi berhasil dibuat",
    data: result,
  });
});

export const getAllTransaksi = asyncHandler(async (req, res) => {
  const data = await service.getAllTransaksi();

  res.status(200).json({
    success: true,
    message: "Data transaksi berhasil diambil",
    data,
  });
});

export const getRiwayat = asyncHandler(async (req, res) => {
  const { id_penyewa } = req.params;

  if (!id_penyewa) {
    return res.status(400).json({
      success: false,
      message: "ID penyewa wajib diisi",
    });
  }

  const data = await service.getRiwayat(parseInt(id_penyewa));

  res.status(200).json({
    success: true,
    message: "Riwayat transaksi berhasil diambil",
    data,
  });
});

export const getDetailTransaksi = asyncHandler(async (req, res) => {
  const { id_transaksi } = req.params;

  if (!id_transaksi) {
    return res.status(400).json({
      success: false,
      message: "ID transaksi wajib diisi",
    });
  }

  const data = await service.getDetailTransaksi(parseInt(id_transaksi));

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Transaksi tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Detail transaksi berhasil diambil",
    data,
  });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      success: false,
      message: "ID dan status wajib diisi",
    });
  }

  const result = await service.updateStatus(parseInt(id), status);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Transaksi tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Status transaksi berhasil diperbarui",
  });
});

export const getLaporanBulanan = asyncHandler(async (req, res) => {
  const tahun = req.query.tahun || new Date().getFullYear();

  const data = await service.getLaporanBulanan(parseInt(tahun));

  res.status(200).json({
    success: true,
    message: "Laporan bulanan berhasil diambil",
    data,
  });
});

export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { order_id } = req.params;

  if (!order_id) {
    return res.status(400).json({
      success: false,
      message: "Order ID wajib diisi",
    });
  }

  const data = await service.getPaymentStatus(order_id);

  res.status(200).json({
    success: true,
    message: "Status pembayaran berhasil diambil",
    data,
  });
});

export const handlePaymentNotification = asyncHandler(async (req, res) => {
  const data = await service.handlePaymentNotification(req.body);

  res.status(200).json({
    success: true,
    message: "Notifikasi pembayaran berhasil diproses",
    data,
  });
});
