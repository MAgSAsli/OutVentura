import * as service from "../services/pegawai.service.js";

export const login = async (req, res) => {
  try {
    const user = await service.login(req.body.email, req.body.password);
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
