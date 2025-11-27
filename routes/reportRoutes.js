import express from "express";
import { labourReport, machineReport, projectReport } from "../controllers/reportController.js";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/role.js";

const router = express.Router();

router.get("/labour", auth, roleCheck("admin", "manager"), labourReport);
router.get("/machine", auth, roleCheck("admin", "manager"), machineReport);
router.get("/project", auth, roleCheck("admin", "manager"), projectReport);




export default router;
