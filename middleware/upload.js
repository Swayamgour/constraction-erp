import multer from "multer";

// Cloudinary upload ke liye ALWAYS memory storage
const storage = multer.memoryStorage();

export const upload = multer({ storage });
