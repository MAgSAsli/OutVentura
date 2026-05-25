import express from "express";
import * as ctrl from "../controller/penyewa.controller.js";

const router = express.Router();

router.get("/", ctrl.getAll);
router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

export default router;
