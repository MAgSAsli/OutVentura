import express from "express";
import * as controller from "../controller/alat.controller.js";
import { validate, alatSchema } from "../validations/schemas.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", controller.getAll);
router.get("/:id", controller.getById);

// Protected Routes (require authentication)
router.post("/", verifyToken, verifyRole(["admin"]), validate(alatSchema), controller.create);
router.put("/:id", verifyToken, verifyRole(["admin"]), validate(alatSchema), controller.update);
router.delete("/:id", verifyToken, verifyRole(["admin"]), controller.remove);

export default router;
