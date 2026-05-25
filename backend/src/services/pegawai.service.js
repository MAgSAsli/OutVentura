import * as repo from "../repo/repo.pegawai.js";
import bcrypt from "bcrypt";

export const getAll = async () => repo.findAll();

export const login = async (email, password) => {
  const user = await repo.findByEmail(email);
  if (!user) throw new Error("Pegawai tidak ditemukan");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Password salah");

  return user;
};
