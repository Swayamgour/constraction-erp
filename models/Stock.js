import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  qty: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
  },
}, { timestamps: true });

export default mongoose.model("Stock", stockSchema);
