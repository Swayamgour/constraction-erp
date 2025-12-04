import multer from "multer";
import path from "path";
import fs from "fs";

// =====================
// Create Upload Folder
// =====================
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// =====================
// 1️⃣ Disk Storage (file saved on server)
// =====================
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

// =====================
// 2️⃣ Memory Storage (file saved in req.file.buffer)
// =====================
const memoryStorage = multer.memoryStorage();

// =====================
// BUILD TWO UPLOADERS
// =====================
const uploadDisk = multer({
    storage: diskStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

const uploadMemory = multer({
    storage: memoryStorage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// =====================
// EXPORT BOTH OPTIONS
// =====================
export const upload = {
    disk: uploadDisk,
    memory: uploadMemory
};
