const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const uploadMiddleware = require('./middleware/uploadMiddleware');
const PORT = process.env.PORT || 3500;
const app = express();
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/file_uploader', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to parse incoming requests with JSON payloads
app.use(express.json());
// Middleware to parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// Route to handle file uploads
app.post('/upload',
    uploadMiddleware,
    (req, res) => {
        return res.json({ status: 'success', message: 'Files uploaded successfully' });
    }
);
// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
