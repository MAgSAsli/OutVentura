import express from "express";
import * as ctrl from "../controller/pegawai.controller.js";

const router = express.Router();
router.post("/login", ctrl.login);

export default router;
