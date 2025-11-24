import User from "../models/User.js";
import Labour from "../models/Labour.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { name, phone, email, password, role } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            phone,
            email,
            password: hashPass,
            role
        });

        res.status(201).json({ message: "User Registered", user });
    } catch (error) {
        res.status(500).json({ message: "Register Error", error });
    }
};

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User Not Found" });

        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) return res.status(401).json({ message: "Invalid Password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login Successful",
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ message: "Login Error", error });
    }
};

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            message: "All users fetched successfully",
            users,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
};



// export const getManagersAndSupervisors = async (req, res) => {
//     try {
//         const users = await User.find({
//             role: { $in: ["manager", "supervisor"] }
//         });

//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong",
//             error: error.message
//         });
//     }
// };

export const getManagersAndSupervisors = async (req, res) => {
    try {
        const users = await User.find({
            role: { $in: ["manager", "supervisor"] }
        }).sort({ createdAt: -1 }); // latest first

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};



export const getManagerDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({
            _id: id,
            role: { $in: ["manager", "supervisor"] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Manager or Supervisor not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};


// import Labour from "../models/Labour.js";

export const addLabour = async (req, res) => {
    try {
        const {
            name,
            phone,
            gender,
            age,
            labourType,
            category,
            wageType,
            dailyWage,
            monthlySalary,
            skillLevel,
            aadhaarNumber,
            address,
            status,
            projectAssigned
        } = req.body;

        // Required fields
        if (!name || !phone || !labourType || !category || !skillLevel || !wageType || !address) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        // Validate wage based on wageType
        if (wageType === "Daily" && !dailyWage) {
            return res.status(400).json({ message: "Daily wage is required" });
        }

        if (wageType === "Monthly" && !monthlySalary) {
            return res.status(400).json({ message: "Monthly salary is required" });
        }

        // Check duplicate phone
        const exists = await Labour.findOne({ phone });
        if (exists) {
            return res.status(400).json({ message: "Labour already exists" });
        }

        // Create labour
        const labour = await Labour.create({
            name,
            phone,
            gender,
            age,
            labourType,
            category,
            skillLevel,
            wageType,
            dailyWage: wageType === "Daily" ? dailyWage : null,
            monthlySalary: wageType === "Monthly" ? monthlySalary : null,
            aadhaarNumber,
            address,
            status: status || "Active",
            assignedProjects: projectAssigned ? [projectAssigned] : [],
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Labour added successfully",
            labour
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding labour",
            error: error.message
        });
    }
};



// import User from "../models/User.js";

export const getLabours = async (req, res) => {
    try {
        const labours = await Labour.find()
            .populate("assignedProjects", "projectName location startDate")
            .select("name phone skillLevel wageType dailyWage monthlySalary labourType category status assignedProjects createdAt")
            .sort({ createdAt: -1 });

        // Add isAssigned key
        const updatedLabours = labours.map(l => ({
            ...l.toObject(),
            isAssigned: l.assignedProjects.length > 0,          // 👈 true/false
            assignedProjectNames: l.assignedProjects.map(p => p.projectName) // 👈 optional
        }));

        res.status(200).json(updatedLabours);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching labours",
            error: error.message
        });
    }
};





export const getLaboursById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch labour + populate assigned project name
        const labour = await Labour.findById(id)
            .populate("assignedProjects", "projectName");

        if (!labour) {
            return res.status(404).json({ message: "Labour not found" });
        }

        // Success
        res.status(200).json(labour);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching labour",
            error: error.message
        });
    }
};



// export const checkLogin = async (req, res) => {
//     try {
//         const userId = req.user._id; // auth middleware se aaya

//         // fresh complete user data from database
//         const user = await User.findById(userId).select("-password");

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Token is valid",
//             user: user
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong",
//             error: error.message
//         });
//     }
// };


