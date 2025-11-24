import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    labourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Labour",
        required: true
    },
    date: {
        type: Date,
        default: () => new Date().setHours(0,0,0,0) // midnight normalized
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "Half-Day"],
        required: true
    },
    timeIn: { type: String, default: null },
    timeOut: { type: String, default: null },
    overtimeHours: { type: Number, default: 0 },

    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
