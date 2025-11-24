import express from "express";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/role.js";
import { markAttendance, approveAttendance, getPendingAttendanceForManager, markBulkAttendance, getLaboursByProject } from "../controllers/attendanceController.js";

const router = express.Router();

// Supervisor only can mark
// router.post("/mark", auth, roleCheck("supervisor"), markAttendance);
// router.post("/mark-bulk", auth, roleCheck("supervisor"), markAttendance);

router.post("/mark", auth, roleCheck("supervisor", "manager"), markAttendance);
router.post("/mark-bulk", auth, roleCheck("supervisor", "manager"), markBulkAttendance);

router.post("/approve", auth, roleCheck("manager"), approveAttendance);


router.get(
    "/pending",
    auth,
    roleCheck("manager", "admin"),
    getPendingAttendanceForManager
);


router.get(
    "/list",
    auth,
    roleCheck("admin", "manager", "supervisor"),
    getLaboursByProject
);


export default router;
