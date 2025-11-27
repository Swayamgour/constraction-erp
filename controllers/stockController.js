import Stock from "../models/Stock.js";
import StockTransaction from "../models/StockTransaction.js";
import { adjustStock } from "./stockHelpers.js";

// 1. Project ka current stock
export const getProjectStock = async (req, res) => {
  try {
    const { projectId } = req.params;

    const stock = await Stock.find({ projectId })
      .populate("itemId", "name unit");

    return res.status(200).json(stock);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching stock",
      error: error.message,
    });
  }
};

// 2. Material Receive (IN) – mostly after PO / vendor delivery
export const receiveMaterial = async (req, res) => {
  try {
    const { projectId, itemId, qty, unit, reason, materialRequestId, purchaseOrderId } = req.body;

    if (!projectId || !itemId || !qty) {
      return res.status(400).json({ message: "projectId, itemId, qty required" });
    }

    // Stock +qty
    const stock = await adjustStock({
      projectId,
      itemId,
      unit,
      qtyChange: +qty,
    });

    // Transaction create
    const txn = await StockTransaction.create({
      projectId,
      itemId,
      type: "IN",
      qty,
      unit,
      reason: reason || "Material received",
      materialRequestId: materialRequestId || null,
      purchaseOrderId: purchaseOrderId || null,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Material received & stock updated",
      stock,
      transaction: txn,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error receiving material",
      error: error.message,
    });
  }
};

// 3. Consumption / Use (OUT)
export const useMaterial = async (req, res) => {
  try {
    const { projectId, itemId, qty, unit, reason } = req.body;

    if (!projectId || !itemId || !qty) {
      return res.status(400).json({ message: "projectId, itemId, qty required" });
    }

    const stock = await adjustStock({
      projectId,
      itemId,
      unit,
      qtyChange: -qty,
    });

    const txn = await StockTransaction.create({
      projectId,
      itemId,
      type: "OUT",
      qty,
      unit,
      reason: reason || "Material used",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Material used & stock updated",
      stock,
      transaction: txn,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error using material",
      error: error.message,
    });
  }
};

// 4. Transfer Project A → Project B
export const transferMaterial = async (req, res) => {
  try {
    const { fromProjectId, toProjectId, itemId, qty, unit, reason } = req.body;

    if (!fromProjectId || !toProjectId || !itemId || !qty) {
      return res.status(400).json({ message: "fromProjectId, toProjectId, itemId, qty required" });
    }

    // 4.1 From project stock decrease
    const fromStock = await adjustStock({
      projectId: fromProjectId,
      itemId,
      unit,
      qtyChange: -qty,
    });

    // 4.2 To project stock increase
    const toStock = await adjustStock({
      projectId: toProjectId,
      itemId,
      unit,
      qtyChange: +qty,
    });

    // 4.3 Transaction entry (type TRANSFER)
    const txn = await StockTransaction.create({
      projectId: null, // optional
      itemId,
      type: "TRANSFER",
      qty,
      unit,
      fromProject: fromProjectId,
      toProject: toProjectId,
      reason: reason || "Material transferred between projects",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Material transferred successfully",
      fromStock,
      toStock,
      transaction: txn,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error transferring material",
      error: error.message,
    });
  }
};

// 5. Return Material (e.g., site se godown / vendor)
export const returnMaterial = async (req, res) => {
  try {
    const { projectId, itemId, qty, unit, reason } = req.body;

    if (!projectId || !itemId || !qty) {
      return res.status(400).json({ message: "projectId, itemId, qty required" });
    }

    const stock = await adjustStock({
      projectId,
      itemId,
      unit,
      qtyChange: -qty, // site se ja raha hai
    });

    const txn = await StockTransaction.create({
      projectId,
      itemId,
      type: "RETURN",
      qty,
      unit,
      reason: reason || "Material returned from site",
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Material returned & stock updated",
      stock,
      transaction: txn,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error returning material",
      error: error.message,
    });
  }
};

// 6. Transaction history
export const getProjectTransactions = async (req, res) => {
  try {
    const { projectId } = req.params;

    const txns = await StockTransaction.find({
      $or: [
        { projectId },
        { fromProject: projectId },
        { toProject: projectId },
      ]
    })
      .populate("itemId", "name unit")
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    return res.status(200).json(txns);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};
