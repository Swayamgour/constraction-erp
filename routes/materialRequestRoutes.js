import express from "express";
import {
    addMaterialRequest,
    getMaterialRequests,
    getPendingRequests,
    approveMaterialRequest,
    rejectMaterialRequest,
    // rejectMaterialRequest

} from "../controllers/materialRequestController.js";
import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/role.js";

const router = express.Router();

// Supervisor, manager, admin can request material
router.post("/add", auth, roleCheck("supervisor", "manager", "admin"), addMaterialRequest);

// Admin + manager can view all requests
router.get("/all", auth, roleCheck("manager", "admin"), getMaterialRequests);

router.get(
    "/pending",
    auth,
    roleCheck("manager", "admin"),
    getPendingRequests
);

router.put(
    "/approve/:id",
    auth,
    roleCheck("manager", "admin"),
    approveMaterialRequest
);


router.put(
    "/reject/:id",
    auth,
    roleCheck("manager", "admin"),
    rejectMaterialRequest
);





export default router;
