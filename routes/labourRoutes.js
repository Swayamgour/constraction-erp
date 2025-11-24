import express from "express";
import {
    assignLabour,
    getLaboursByProject
} from "../controllers/labourController.js";

import { auth } from "../middleware/auth.js";
import { roleCheck } from "../middleware/role.js";

const router = express.Router();

router.post(
    "/assign-labour",
    auth,
    roleCheck("admin", "manager", "supervisor"),
    assignLabour
);

router.get(
    "/labour-by-project",
    auth,
    roleCheck("admin", "manager", "supervisor"),
    getLaboursByProject
);


export default router;