import Maintenance from "../models/maintenanceSchema.js";
import Machine from "../models/Machine.js";

export const getMaintenanceMachines = async (req, res) => {
    try {
        const today = new Date();

        // Fetch machines with maintenance record
        const dueMaintenance = await Maintenance.find({
            nextServiceDate: { $lte: today }, // Past or Today
        }).populate("machineId", "machineName machineType model hourlyRate");

        const upcomingMaintenance = await Maintenance.find({
            nextServiceDate: { $gt: today }, // Coming dates
        }).populate("machineId", "machineName machineType model hourlyRate");

        return res.json({
            success: true,
            due: dueMaintenance,
            upcoming: upcomingMaintenance,
            total: dueMaintenance.length + upcomingMaintenance.length,
        });

    } catch (error) {
        console.log("Error fetching maintenance", error);
        res.status(500).json({ success: false, message: "Error fetching maintenance", error: error.message });
    }
};
