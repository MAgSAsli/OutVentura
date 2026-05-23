import * as service from "../services/transaksi.service.js";

export const createTransaksi = async (req, res) => {
  try {
    const result = await service.createTransaksi(req.body);
    res.status(201).json({ message: "Transaksi berhasil", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message || "Transaksi gagal" });
  }
};

export const getRiwayat = async (req, res) => {
  try {
    const data = await service.getRiwayat(req.params.id_penyewa);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDetailTransaksi = async (req, res) => {
  try {
    const data = await service.getDetailTransaksi(req.params.id_transaksi);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTransaksi = async (req, res) => {
  try {
    const data = await service.getAllTransaksi();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    await service.updateStatus(req.params.id, req.body.status);
    res.json({ message: "Status diperbarui" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getLaporanBulanan = async (req, res) => {
  try {
    const tahun = req.query.tahun || new Date().getFullYear();
    const data = await service.getLaporanBulanan(tahun);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const data = await service.getPaymentStatus(req.params.order_id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const handlePaymentNotification = async (req, res) => {
  try {
    const data = await service.handlePaymentNotification(req.body);
    res.json({ message: "Notifikasi pembayaran diproses", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
