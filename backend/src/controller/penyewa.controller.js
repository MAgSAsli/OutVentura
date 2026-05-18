import * as service from "../services/penyewa.service.js";

export const register = async (req, res) => {
  try {
    const id = await service.register(req.body);
    res.status(201).json({ message: "Registrasi berhasil", id });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await service.login(req.body.email, req.body.password);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
