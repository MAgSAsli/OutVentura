import * as service from "../services/alat.service.js";

export const getAll = async (req, res) => {
  try {
    const data = await service.getAll();
    res.status(200).json(data);
  } catch (err) {
    console.error("GET ALL ALAT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await service.getById(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "Alat not found" });
    }
    res.json(data);
  } catch (err) {
    console.error("GET ALAT BY ID ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const create = async (req, res) => {
  try {
    const id = await service.create(req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error("CREATE ALAT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req, res) => {
  try {
    await service.update(req.params.id, req.body);
    res.json({ message: "Updated" });
  } catch (err) {
    console.error("UPDATE ALAT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const remove = async (req, res) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE ALAT ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

