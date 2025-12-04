import mongoose from "mongoose";

const employeeAttendanceSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },

    date: {
        type: Date,
        default: () => new Date().setHours(0, 0, 0, 0)
    },

    status: {
        type: String,
        enum: ["Present", "Absent", "Half-Day", "Leave"],
        required: true
    },

    timeIn: { type: String, default: null },
    timeOut: { type: String, default: null },
    workHours: { type: Number, default: 0 },

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

export default mongoose.model("EmployeeAttendance", employeeAttendanceSchema);
