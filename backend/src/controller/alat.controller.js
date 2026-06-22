import * as service from "../services/alat.service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  res.status(200).json({
    success: true,
    message: "Data alat berhasil diambil",
    data,
  });
});

export const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID wajib diisi",
    });
  }

  const data = await service.getById(parseInt(id));

  if (!data) {
    return res.status(404).json({
      success: false,
      message: "Alat tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Data alat berhasil diambil",
    data,
  });
});

export const create = asyncHandler(async (req, res) => {
  const { nama_alat, kategori, harga, stok, deskripsi, gambar } = req.body;

  if (!nama_alat || !kategori || !harga || stok === undefined) {
    return res.status(400).json({
      success: false,
      message: "Nama, kategori, harga, dan stok wajib diisi",
    });
  }

  const id = await service.create(req.body);

  res.status(201).json({
    success: true,
    message: "Alat berhasil ditambahkan",
    data: { id },
  });
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID wajib diisi",
    });
  }

  const result = await service.update(parseInt(id), req.body);

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Alat tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Alat berhasil diperbarui",
    data: result,
  });
});

export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID wajib diisi",
    });
  }

  const result = await service.remove(parseInt(id));

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Alat tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Alat berhasil dihapus",
  });
});

