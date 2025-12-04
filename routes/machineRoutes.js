import express from "express";
import { upload } from "../middleware/upload.js";
import { addMachine, getAllMachines, getMachineDetails } from "../controllers/machineController.js";
import { addMaintenance, getMaintenanceHistory } from "../controllers/maintenanceController.js";
import { upsertDailyUsage, getDailyUsage } from "../controllers/usageController.js";

const router = express.Router();

router.post("/add",
  upload.disk.single([
    { name: "photo", maxCount: 1 },
    { name: "rcFile", maxCount: 1 },
    { name: "insuranceFile", maxCount: 1 }
  ]),
  addMachine
);

router.get("/all", getAllMachines);
router.get("/:id", getMachineDetails);

// maintenance
router.post("/maintenance/add", upload.disk.single("billFile"), addMaintenance);
router.get("/:machineId/maintenance", getMaintenanceHistory);

// daily usage
router.post("/usage", upsertDailyUsage);
router.get("/usage", getDailyUsage);

export default router;
