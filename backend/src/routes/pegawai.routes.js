import express from "express";
import * as ctrl from "../controller/pegawai.controller.js";
import { validate, loginSchema, registerSchema } from "../validations/schemas.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.post("/login", validate(loginSchema), ctrl.login);
router.post("/register", validate(registerSchema), ctrl.register);

// Protected Routes (require authentication)
router.get("/", verifyToken, verifyRole(["admin", "pegawai"]), ctrl.getAll);
router.get("/:id", verifyToken, ctrl.getById);
router.put("/:id", verifyToken, ctrl.update);
router.delete("/:id", verifyToken, verifyRole(["admin"]), ctrl.remove);

export default router;
