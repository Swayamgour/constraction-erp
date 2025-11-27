import Attendance from "../models/Attendance.js";
import Labour from "../models/Labour.js";
import MachineUsage from "../models/MachineUsage.js";
import Project from "../models/Project.js";

/* =======================================================================
  ⭐ 1) LABOUR COST REPORT (Project-wise labour cost calculation)
======================================================================= */
export const labourReport = async (req, res) => {
    try {
        const report = await Attendance.find()
            .populate("labourId", "name labourType ratePerDay")
            .populate("projectId", "projectName");

        // Calculate each labour total cost
        const data = report.map((item) => {
            const totalCost = (item.days || 0) * (item.labourId?.ratePerDay || 0);
            return {
                labourName: item.labourId?.name,
                labourType: item.labourId?.labourType,
                ratePerDay: item.labourId?.ratePerDay,
                workedDays: item.days,
                totalCost,
                projectName: item.projectId?.projectName,
            };
        });

        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =======================================================================
  ⭐ 2) MACHINE USAGE REPORT (Project-wise machine usage cost calculation)
======================================================================= */
export const machineReport = async (req, res) => {
    try {
        const usage = await MachineUsage.find()
            .populate("machineId", "machineName hourlyRate")
            .populate("projectId", "projectName");

        // Calculate usage cost
        const data = usage.map((item) => {
            const totalCost = (item.workingHours || 0) * (item.machineId?.hourlyRate || 0);
            return {
                machineName: item.machineId?.machineName,
                hourlyRate: item.machineId?.hourlyRate,
                projectName: item.projectId?.projectName,
                workingHours: item.workingHours,
                idleHours: item.idleHours,
                breakdownHours: item.breakdownHours,
                usageDate: item.usageDate,
                totalCost,
            };
        });

        res.json({ success: true, data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* =======================================================================
  ⭐ 3) PROJECT SUMMARY REPORT (Project + Labour Cost + Machine Cost)
======================================================================= */
export const projectReport = async (req, res) => {
    try {
        const projects = await Project.find();

        const reportData = [];

        for (let project of projects) {
            const projectId = project._id;

            // Labour Cost Calculation
            const attendance = await Attendance.find({ projectId })
                .populate("labourId", "ratePerDay");

            const labourCost = attendance.reduce((sum, a) =>
                sum + ((a.days || 0) * (a.labourId?.ratePerDay || 0))
                , 0);

            // Machine Usage Cost Calculation
            const machineUsage = await MachineUsage.find({ projectId })
                .populate("machineId", "hourlyRate");

            const machineCost = machineUsage.reduce((sum, m) =>
                sum + ((m.workingHours || 0) * (m.machineId?.hourlyRate || 0))
                , 0);

            reportData.push({
                projectId,
                projectName: project.projectName,
                labourCost,
                machineCost,
                totalCost: labourCost + machineCost,
            });
        }

        res.json({ success: true, data: reportData });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
