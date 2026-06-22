import * as service from "../services/penyewa.service.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  res.status(200).json({
    success: true,
    message: "Data penyewa berhasil diambil",
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
      message: "Penyewa tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Data penyewa berhasil diambil",
    data,
  });
});

export const register = asyncHandler(async (req, res) => {
  const { nama, email, password, telepon, alamat } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, dan password wajib diisi",
    });
  }

  const result = await service.register(nama, email, password, telepon, alamat);

  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi",
    });
  }

  const result = await service.login(email, password);

  res.status(200).json(result);
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
      message: "Penyewa tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Data penyewa berhasil diperbarui",
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
      message: "Penyewa tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Penyewa berhasil dihapus",
  });
});
