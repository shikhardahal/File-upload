const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileSchema = new Schema({
    filename: String,
    path: String,
    mimeType: String,
    // Add more fields as needed
});
const File = mongoose.model('File', fileSchema);
module.exports = File;

