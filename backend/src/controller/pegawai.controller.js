import * as service from "../services/pegawai.service.js";
import { asyncHandler, logger } from "../middleware/errorHandler.js";

export const getAll = asyncHandler(async (req, res) => {
  const data = await service.getAll();

  res.status(200).json({
    success: true,
    message: "Data pegawai berhasil diambil",
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
      message: "Pegawai tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Data pegawai berhasil diambil",
    data,
  });
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

export const register = asyncHandler(async (req, res) => {
  const { nama, email, password, nomor_telepon } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, dan password wajib diisi",
    });
  }

  const result = await service.register(nama, email, password, nomor_telepon);

  res.status(201).json(result);
});

export const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nama, email, nomor_telepon } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID wajib diisi",
    });
  }

  const result = await service.update(parseInt(id), {
    nama,
    email,
    nomor_telepon,
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Pegawai tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Data pegawai berhasil diperbarui",
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
      message: "Pegawai tidak ditemukan",
    });
  }

  res.status(200).json({
    success: true,
    message: "Pegawai berhasil dihapus",
  });
});
