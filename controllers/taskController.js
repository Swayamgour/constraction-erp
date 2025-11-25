import Task from "../models/Task.js";

// 🆕 ASSIGN TASK
export const assignTask = async (req, res) => {
    try {
        const { title, description, projectId, assignedTo, priority, deadline } = req.body;
        if (!title || !projectId || !assignedTo || !deadline) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const task = await Task.create({
            title,
            description,
            projectId,
            assignedTo,
            priority,
            deadline,
            assignedBy: req.user.id, // automatically logged-in user
        });

        res.status(201).json({ message: "Task Assigned Successfully", data: task });
    } catch (error) {
        res.status(500).json({ message: "Task Error", error: error.message });
    }
};

// 📋 GET TASKS (ROLE-BASED LOGIC)
export const getTasks = async (req, res) => {
    try {
        const { projectId, assignedTo, status } = req.query;
        let filter = {};

        // =========== ROLE RESTRICTION ============
        if (
            req.user.role === "supervisor" ||
            req.user.role === "engineer" ||
            req.user.role === "storekeeper"
        ) {
            filter.assignedTo = req.user.id; // only his tasks
        }

        // Admin/Manager can filter any user's task
        if (
            assignedTo &&
            (req.user.role === "admin" || req.user.role === "manager")
        ) {
            filter.assignedTo = assignedTo;
        }

        if (projectId) filter.projectId = projectId;
        if (status) filter.status = status;

        const tasks = await Task.find(filter)
            .populate("projectId", "projectName projectCode")
            .populate("assignedTo", "name role")
            .populate("assignedBy", "name role")
            .sort({ createdAt: -1 });

        res.status(200).json({ message: "Tasks fetched", data: tasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

// 🔄 UPDATE TASK STATUS
export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // ❌ Supervisor cannot update someone else task
        if (
            req.user.role !== "admin" &&
            req.user.role !== "manager" &&
            task.assignedTo.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "You cannot update this task" });
        }

        task.status = req.body.status;
        task.remarks = req.body.remarks || task.remarks;

        await task.save();

        res.status(200).json({ message: "Status Updated", data: task });
    } catch (error) {
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};


// 🗑️ DELETE TASK
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ message: "Task not found" });

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};
