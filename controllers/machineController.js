import Machine from "../models/Machine.js";

// ADD MACHINE
export const addMachine = async (req, res) => {
  try {
    const {
      name,
      code,
      machineType,
      ownership,
      vendorId,
      modelNo,
      registrationNo,
      capacity,
      fuelType,
      rateType,
      rentRate,
      internalRate,
    } = req.body;

    if (!name || !machineType || !ownership) {
      return res.status(400).json({ message: "name, machineType & ownership are required" });
    }

    // If rented machine, vendorId should exist
    if (ownership === "Rented" && !vendorId) {
      return res.status(400).json({ message: "vendorId required for rented machine" });
    }

    const machine = await Machine.create({
      name,
      code,
      machineType,
      ownership,
      vendorId: vendorId || null,
      modelNo,
      registrationNo,
      capacity,
      fuelType,
      rateType,
      rentRate,
      internalRate,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({ message: "Machine added successfully", data: machine });
  } catch (error) {
    console.error("Add Machine Error:", error);
    res.status(500).json({ message: "Error adding machine", error: error.message });
  }
};

// GET ALL MACHINES (with optional filters)
export const getMachines = async (req, res) => {
  try {
    const { ownership, status } = req.query;

    const filter = {};
    if (ownership) filter.ownership = ownership;
    if (status) filter.status = status;

    const machines = await Machine.find(filter)
      .populate("vendorId", "companyName phone")
      .populate("currentProjectId", "projectName projectCode")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Machines list", data: machines });
  } catch (error) {
    res.status(500).json({ message: "Error fetching machines", error: error.message });
  }
};

// GET SINGLE MACHINE
export const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id)
      .populate("vendorId", "companyName phone")
      .populate("currentProjectId", "projectName projectCode");

    if (!machine) return res.status(404).json({ message: "Machine not found" });

    res.status(200).json({ data: machine });
  } catch (error) {
    res.status(500).json({ message: "Error fetching machine", error: error.message });
  }
};

// UPDATE MACHINE
export const updateMachine = async (req, res) => {
  try {
    const updated = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Machine not found" });

    res.status(200).json({ message: "Machine updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating machine", error: error.message });
  }
};

// DELETE MACHINE
export const deleteMachine = async (req, res) => {
  try {
    const deleted = await Machine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Machine not found" });

    res.status(200).json({ message: "Machine deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting machine", error: error.message });
  }
};
