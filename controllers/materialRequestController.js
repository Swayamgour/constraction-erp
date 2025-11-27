import MaterialRequest from "../models/MaterialRequest.js";

// ADD MATERIAL REQUEST
export const addMaterialRequest = async (req, res) => {
    try {
        const { projectId, itemId, requestedQty, unit, requiredDate, priority, purpose, vendorId } = req.body;

        if (!projectId || !itemId || !requestedQty) {
            return res.status(400).json({ message: "projectId, itemId & requestedQty are required" });
        }

        const materialRequest = await MaterialRequest.create({
            projectId,
            itemId,
            requestedQty,
            unit,
            requiredDate,
            priority,
            purpose,
            vendorId: vendorId || null,
            requestedBy: req.user.id
        });

        return res.status(201).json({
            message: "Material Request submitted successfully",
            data: materialRequest
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating Material Request",
            error: error.message
        });
    }
};

// GET MATERIAL REQUESTS
export const getMaterialRequests = async (req, res) => {
    try {
        const userRole = req.user.role; // admin, manager, supervisor
        const userId = req.user.id;     // logged in user id

        let query = {};

        // Supervisor: only own requests
        if (userRole === "supervisor") {
            query = { requestedBy: userId };
        }

        // Admin + Manager: see all, so query remains {}

        const requests = await MaterialRequest.find(query)
            .populate("projectId", "projectName projectCode")
            .populate("itemId", "name type unit")
            .populate("requestedBy", "name role");

        res.status(200).json(requests);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching Material Requests",
            error: error.message
        });
    }
};


export const getPendingRequests = async (req, res) => {
    try {
        const pending = await MaterialRequest.find({ status: "pending" })
            .populate("projectId", "projectName")
            .populate("itemId", "name unit")
            .populate("requestedBy", "name role");

        res.status(200).json({ message: "Pending MRs", data: pending });
    } catch (error) {
        res.status(500).json({ message: "Error fetching pending requests", error: error.message });
    }
};



export const approveMaterialRequest = async (req, res) => {
    try {
        const mrId = req.params.id;

        const updated = await MaterialRequest.findByIdAndUpdate(
            mrId,
            {
                status: "approved",
                approvedBy: req.user.id,
                approvalDate: new Date()
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "MR not found" });

        res.status(200).json({ message: "MR Approved", data: updated });

    } catch (error) {
        res.status(500).json({ message: "Error approving MR", error: error.message });
    }
};


export const rejectMaterialRequest = async (req, res) => {
    try {
        const mrId = req.params.id;

        const updated = await MaterialRequest.findByIdAndUpdate(
            mrId,
            {
                status: "rejected",
                approvedBy: req.user.id,
                approvalDate: new Date()
            },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "MR not found" });

        res.status(200).json({ message: "MR Rejected", data: updated });

    } catch (error) {
        res.status(500).json({ message: "Error rejecting MR", error: error.message });
    }
};

