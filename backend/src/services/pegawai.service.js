import * as repo from "../repo/repo.pegawai.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const getAll = async () => repo.findAll();

export const getById = async (id) => repo.findById(id);

export const login = async (email, password) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("Pegawai tidak ditemukan");

  const valid = await bcryptjs.compare(password, user.password);
  if (!valid) throw new Error("Password salah");

  // Generate JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: user.role || "pegawai",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    message: "Login berhasil",
    token,
    user: userWithoutPassword,
  };
};

export const register = async (nama, email, password, phone = null) => {
  // Check if user already exists
  const existing = await repo.findByEmail(email);
  if (existing) throw new Error("Email sudah terdaftar");

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10);

  // Create new user
  const user = await repo.create({
    nama,
    email,
    password: hashedPassword,
    nomor_telepon: phone,
  });

  // Generate JWT Token
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      nama: user.nama,
      role: user.role || "pegawai",
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
  );

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    message: "Registrasi berhasil",
    token,
    user: userWithoutPassword,
  };
};

export const update = async (id, data) => {
  return await repo.update(id, data);
};

export const remove = async (id) => {
  return await repo.remove(id);
};
