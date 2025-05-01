const mongoose = require('mongoose')

const FolderSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: false },
    user: { type: String, required: true, unique: false },
})

module.exports = mongoose.model('Folder', FolderSchema)
