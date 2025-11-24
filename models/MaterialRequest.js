import mongoose from "mongoose";

const materialRequestSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },

  requestedQty: { type: Number, required: true },
  unit: { type: String },

  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "ordered", "completed"],
    default: "pending"
  },

  requiredDate: { type: Date, default: null },
  priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
  purpose: { type: String },

  // 👇 ADD THIS
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    default: null
  },

  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  approvalDate: { type: Date, default: null }

}, { timestamps: true });

// export default mongoose.model("MaterialRequest", materialRequestSchema);


export default mongoose.model("MaterialRequest", materialRequestSchema);
