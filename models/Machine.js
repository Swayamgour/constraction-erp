import mongoose from "mongoose";

const machineSchema = new mongoose.Schema(
  {
    // Basic Info
    name: { type: String, required: true, trim: true }, // JCB-01, Roller-02
    code: { type: String, trim: true },                 // optional unique code
    machineType: { type: String, required: true },      // JCB, Mixer, Roller etc.

    // Ownership
    ownership: {
      type: String,
      enum: ["Owned", "Rented"],
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null, // required when ownership = "Rented"
    },

    // Technical Details
    modelNo: { type: String, default: null },
    registrationNo: { type: String, default: null },
    capacity: { type: String, default: null }, // 10T, 5m3 etc.
    fuelType: { type: String, enum: ["Diesel", "Petrol", "Electric", "NA"], default: "Diesel" },

    // Rates
    rateType: { type: String, enum: ["Hour", "Day", "Month"], default: "Hour" },
    rentRate: { type: Number, default: 0 },      // For rented machines (Vendor ko dena)
    internalRate: { type: Number, default: 0 },  // For owned machines (cost calculation)

    // Status & Current Location
    status: {
      type: String,
      enum: ["Active", "InMaintenance", "Inactive"],
      default: "Active",
    },
    currentProjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Machine", machineSchema);
