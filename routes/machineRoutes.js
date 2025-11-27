import express from "express";
import {
  addMachine,
  getMachines,
  getMachineById,
  updateMachine,
  deleteMachine,
} from "../controllers/machineController.js";

import { getMaintenanceMachines } from "../controllers/maintenanceController.js";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/role.js";

const router = express.Router();

// ⭐ Maintenance List (MUST be BEFORE /:id)
router.get(
  "/maintenance",
  auth,
  roleCheck("admin", "manager", "supervisor"),
  getMaintenanceMachines
);

// ➕ Add machine
router.post(
  "/add",
  auth,
  roleCheck("admin", "manager"),
  addMachine
);

// 📃 Get all machines
router.get(
  "/all",
  auth,
  roleCheck("admin", "manager", "supervisor"),
  getMachines
);

// ✨ Get single machine (ALWAYS LAST)
router.get(
  "/:id",
  auth,
  roleCheck("admin", "manager", "supervisor"),
  getMachineById
);

// ✏ Update machine
router.put(
  "/:id",
  auth,
  roleCheck("admin", "manager"),
  updateMachine
);

// 🗑 Delete machine
router.delete(
  "/:id",
  auth,
  roleCheck("admin"),
  deleteMachine
);

export default router;
