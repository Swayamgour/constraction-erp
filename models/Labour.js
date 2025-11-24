import mongoose from "mongoose";

const labourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },

    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    age: { type: Number, default: null },

    // Labour Type (Permanent/Contract + Labour/Mistri)
    labourType: {
        type: String,
        enum: [
            "Permanent Labour",
            "Permanent Mistri",
            "Contract Labour",
            "Contract Mistri"
        ],
        required: true
    },

    category: {
        type: String,
        enum: ["Labour", "Mistri"],
        required: true
    },

    skillLevel: {
        type: String,
        enum: ["Unskilled", "Semi-skilled", "Skilled"],
        required: true
    },

    // Wage Type
    wageType: { type: String, enum: ["Daily", "Monthly"], required: true },

    dailyWage: { type: Number, default: null },
    monthlySalary: { type: Number, default: null },

    aadhaarNumber: { type: String, default: null },
    address: { type: String, required: true },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },

    // If labour working on projects
    assignedProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true });

export default mongoose.model("Labour", labourSchema);
