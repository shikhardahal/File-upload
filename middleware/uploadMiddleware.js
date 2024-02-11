const multer = require('multer');
const path = require('path');
const File = require('../models/File');
// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Define the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Define how filenames should be stored
    }
});
// Create multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB file size limit
    }
});
// Middleware to handle file uploads and save file metadata to database
const uploadAndSaveMetadata = async (req, res, next) => {
    try {
        upload.array('file', 10)(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: "error", message: "Failed to upload files" });
            }
            // Check if files were uploaded
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ status: "error", message: "No files were uploaded" });
            }
            // Save file metadata to database
            await Promise.all(req.files.map(async file => {
                const newFile = new File({
                    filename: file.originalname,
                    path: file.path,
                    mimeType: file.mimetype,
                    // Add more fields as needed
                });
                await newFile.save();
            }));
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", message: "Failed to save file metadata" });
    }
};
module.exports = uploadAndSaveMetadata;

