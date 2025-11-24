import Project from "../models/Project.js";

// ----------------------------
// CREATE PROJECT
// ----------------------------
export const createProject = async (req, res) => {
    try {
        const projectData = {
            ...req.body,
            createdBy: req.user.id
        };

        const project = await Project.create(projectData);

        res.status(201).json({
            message: "Project Created Successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating project",
            error: error.message,
        });
    }
};



// ----------------------------
// GET ALL PROJECTS
// ----------------------------
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("managerId", "name email phone role")
            .populate("projectIncharge", "name email phone role")
            .populate("createdBy", "name email");

        res.status(200).json({
            message: "Projects fetched successfully",
            projects,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching projects", error });
    }
};



// ----------------------------
// GET SINGLE PROJECT BY ID
// ----------------------------
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("managerId", "name email phone role")
            .populate("projectIncharge", "name email phone role")
            .populate("createdBy", "name email");

        if (!project) {
            return res.status(404).json({ message: "Project Not Found" });
        }

        res.status(200).json({
            message: "Project fetched successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching project", error });
    }
};


export const getSupervisorProjects = async (req, res) => {
    try {
        const supervisorId = req.user.id;

        const projects = await Project.find({ supervisors: supervisorId })
            .populate("managerId", "name email phone")
            .populate("supervisors", "name email phone");

        res.status(200).json({
            message: "Assigned supervisor projects fetched successfully",
            projects
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching supervisor projects",
            error: error.message
        });
    }
};

export const getMyProjects = async (req, res) => {

    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let projects;

        if (userRole === "manager") {
            projects = await Project.find({ managerId: userId });
        }

        else if (userRole === "supervisor") {
            projects = await Project.find({ supervisorId: userId });
        }

        else if (userRole === "admin") {
            projects = await Project.find(); // admin can see all
        }

        else {
            return res.status(403).json({
                message: "Access denied for this role"
            });
        }

        return res.status(200).json(
            projects
        );

    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch projects",
            error: error.message
        });
    }
};



// ----------------------------
// ASSIGN MANAGER TO PROJECT
// ----------------------------
export const assignManager = async (req, res) => {
    try {
        const { projectId, managerId } = req.body;

        const project = await Project.findByIdAndUpdate(
            projectId,
            { managerId },
            { new: true }
        ).populate("managerId", "name email phone");

        if (!project) {
            return res.status(404).json({ message: "Project Not Found" });
        }

        res.status(200).json({
            message: "Manager Assigned Successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Error assigning manager", error });
    }
};



export const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const updateData = req.body;

        // Check project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error updating project",
            error: error.message,
        });
    }
};






// ----------------------------
// DELETE PROJECT
// ----------------------------
export const deleteProject = async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: "Project Not Found" });
        }

        res.status(200).json({
            message: "Project deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting project", error });
    }
};

export const getManagerProjects = async (req, res) => {
    // console.log('if')
    try {
        const managerId = req.user.id; // token se manager ka id
        // console.log(managerId)

        const projects = await Project.find({ managerId })
            .populate("managerId", "name email phone role")
            .populate("createdBy", "name email");

        if (projects.length === 0) {
            return res.status(200).json({
                message: "No projects assigned yet",
                projects: []
            });
        }

        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching manager projects",
            error: error.message,
        });
    }
};

export const assignSupervisor = async (req, res) => {
    try {
        const { projectId, supervisorId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Add supervisor only if not already added
        if (project.supervisors.includes(supervisorId)) {
            return res.status(400).json({ message: "Supervisor already assigned" });
        }

        project.supervisors.push(supervisorId);
        await project.save();

        res.status(200).json({
            message: "Supervisor assigned successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to assign supervisor",
            error: error.message
        });
    }
};


export const assignLabour = async (req, res) => {
    try {
        const { projectId, labourId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.labours.includes(labourId)) {
            return res.status(400).json({ message: "Labour already assigned" });
        }

        project.labours.push(labourId);
        await project.save();

        res.status(200).json({
            message: "Labour assigned successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to assign labour",
            error: error.message
        });
    }
};




