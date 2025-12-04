import Machine from "../models/Machine.js";
import MachineMaintenance from "../models/MachineMaintenance.js";
import MachineAssignment from "../models/MachineAssignment.js";
import DailyUsage from "../models/DailyUsage.js";
import mongoose from "mongoose";

/* add machine with files */
export const addMachine = async (req, res) => {
  try {
    const { machineNumber, engineNumber, chassisNumber, machineType, ownedOrRented, rcExpiry, insuranceExpiry, notes } = req.body;

    const doc = {
      machineNumber, engineNumber, chassisNumber, machineType, ownedOrRented, notes
    };

    if (req.files) {
      if (req.files.photo) doc.photo = req.files.photo[0].path;
      if (req.files.rcFile) doc.rcFile = req.files.rcFile[0].path;
      if (req.files.insuranceFile) doc.insuranceFile = req.files.insuranceFile[0].path;
    }

    if (rcExpiry) doc.rcExpiry = new Date(rcExpiry);
    if (insuranceExpiry) doc.insuranceExpiry = new Date(insuranceExpiry);

    const machine = await Machine.create(doc);
    res.status(201).json({ message: "Machine added", machine });
  } catch (err) {
    res.status(500).json({ message: "Error adding machine", error: err.message });
  }
};

/* get all machines */
export const getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    res.json({ message: "Machines fetched", machines });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

/* get single machine + history summary */
export const getMachineDetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const machine = await Machine.findById(id);
    if (!machine) return res.status(404).json({ message: "Not found" });

    const maintenance = await MachineMaintenance.find({ machineId: id }).sort({ serviceDate: -1 });
    const assignments = await MachineAssignment.find({ machineId: id }).sort({ assignDate: -1 });
    const usage = await DailyUsage.find({ machineId: id }).sort({ date: -1 }).limit(30);

    // total maintenance cost (example)
    const totalCost = maintenance.reduce((s, m) => s + (m.cost || 0), 0);

    res.json({ message: "Machine details", machine, maintenance, assignments, usage, totalMaintenanceCost: totalCost });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
