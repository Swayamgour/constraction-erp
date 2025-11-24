import Project from "../models/Project.js";
import Labour from "../models/Labour.js";

export const assignLabour = async (req, res) => {
    try {
        const { projectId, labourIds } = req.body;

        // Check Project Exists
        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // 📌 Convert to string for accurate matching
        const alreadyAssigned = project.labours.map(id => id.toString());

        // 📌 Filter new labours (avoid duplicate assign)
        const newLabours = labourIds.filter(id => !alreadyAssigned.includes(id));

        // 📌 If all are already assigned
        if (newLabours.length === 0) {
            return res.status(400).json({
                message: "All selected labours are already assigned to this project",
                alreadyAssigned: labourIds,
            });
        }

        // 📌 Push new unique labours into project
        project.labours.push(...newLabours);
        await project.save();

        // 📌 Update labour document -> assign project
        await Labour.updateMany(
            { _id: { $in: newLabours } },
            { $addToSet: { assignedProjects: projectId } }  // Prevent duplicates
        );

        return res.status(200).json({
            message: "Labour assigned successfully",
            assigned: newLabours,
            project,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error assigning labour",
            error: error.message
        });
    }
};

export const getLaboursByProject = async (req, res) => {
    try {
        const { projectId } = req.query;

        if (!projectId) return res.status(400).json({ message: "projectId required" });

        const project = await Project.findById(projectId)
            .populate("labours", "name phone skillType");

        if (!project) return res.status(404).json({ message: "Project not found" });

        res.status(200).json({
            message: "Assigned Labour List",
            data: project.labours,
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching assigned labours",
            error: error.message,
        });
    }
};
