import * as repo from "../repo/repo.penyewa.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAll = async () => repo.findAll();

export const getById = async (id) => repo.findById(id);

export const register = async (nama, email, password, telepon = null, alamat = null) => {
  const exist = await repo.findByEmail(email);
  if (exist) throw new Error("Email sudah terdaftar");

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await repo.create({
    nama,
    email,
    password: hashedPassword,
    telepon,
    alamat,
  });

  // Generate JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: "penyewa",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );

  return {
    success: true,
    message: "Registrasi berhasil",
    token,
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      telepon: user.telepon,
      alamat: user.alamat,
    },
  };
};

export const login = async (email, password) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("Email tidak ditemukan");

  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) throw new Error("Password salah");

  // Generate JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: "penyewa",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );

  return {
    success: true,
    message: "Login berhasil",
    token,
    user: {
      id: user.id,
      nama: user.nama,
      email: user.email,
      telepon: user.telepon,
      alamat: user.alamat,
    },
  };
};

export const update = async (id, data) => {
  return await repo.update(id, data);
};

export const remove = async (id) => {
  return await repo.remove(id);
};
