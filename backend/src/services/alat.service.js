import * as repo from "../repo/repo.alat.js";

export const getAll = async () => repo.findAll();
export const getById = async (id) => repo.findById(id);
export const create = async (data) => repo.create(data);
export const update = async (id, data) => repo.update(id, data);
export const remove = async (id) => repo.remove(id);
