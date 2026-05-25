import * as service from "../services/pegawai.service.js";

export const getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.status(200).json(data);
  } catch (err) {
    console.error("GET ALL PEGAWAI ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
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
