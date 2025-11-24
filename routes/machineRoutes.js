import express from "express";
import {
  addMachine,
  getMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
} from "../controllers/machineController.js";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/role.js";

const router = express.Router();

// Add machine (admin/manager)
router.post(
  "/add",
  auth,
  roleCheck("admin", "manager"),
  addMachine
);

// Get machines
router.get(
  "/all",
  auth,
  roleCheck("admin", "manager", "supervisor"),
  getMachines
);

// Get single
router.get(
  "/:id",
  auth,
  roleCheck("admin", "manager", "supervisor"),
  getMachineById
);

// Update
router.put(
  "/:id",
  auth,
  roleCheck("admin", "manager"),
  updateMachine
);

// Delete
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteMachine
);

export default router;
