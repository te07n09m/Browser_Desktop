const mongoose = require('mongoose')

const ShortcutSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: false },
    url: { type: String, required: true, unique: false },
    faviconUrl: { type: String, required: true, unique: false },
})

module.exports = mongoose.model('Shortcut', ShortcutSchema)
