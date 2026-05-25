import * as repo from "../repo/repo.penyewa.js";
import bcrypt from "bcrypt";

export const getAll = async () => repo.findAll();

export const register = async (data) => {
  const exist = await repo.findByEmail(data.email);
  if (exist) throw new Error("Email sudah terdaftar");

  const hashed = await bcrypt.hash(data.password, 10);

  return repo.create({
    ...data,
    password: hashed
  });
};

export const login = async (email, password) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("Email tidak ditemukan");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Password salah");

  return user;
};
