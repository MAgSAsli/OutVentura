import express from "express";
import * as ctrl from "../controller/penyewa.controller.js";
import { validate, loginSchema, registerSchema, penyewaSchema } from "../validations/schemas.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);

// Protected Routes
router.get("/", verifyToken, ctrl.getAll);
router.get("/:id", verifyToken, ctrl.getById);
router.put("/:id", verifyToken, validate(penyewaSchema), ctrl.update);
router.delete("/:id", verifyToken, ctrl.remove);

export default router;
