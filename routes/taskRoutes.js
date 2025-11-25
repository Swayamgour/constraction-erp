import express from "express";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/role.js";

import {
  assignTask,
  getTasks,
  updateTaskStatus,
  deleteTask
} from "../controllers/taskController.js";

const router = express.Router();

// 🆕 Assign new task (Only Admin & Manager)
router.post(
  "/assign",
  auth,
  roleCheck("admin", "manager"),
  assignTask
);

// 📋 Get tasks (everyone, but filtered)
router.get(
  "/all",
  auth,
  getTasks
);

// 🔄 Change task status
router.put(
  "/status/:id",
  auth,
  updateTaskStatus
);

// 🗑️ Delete Task (Only Admin & Manager)
router.delete(
  "/:id",
  auth,
  roleCheck("admin", "manager"),
  deleteTask
);

export default router;
