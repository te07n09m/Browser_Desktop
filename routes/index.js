const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')

const Shortcut = require('../models/Shortcut')
const Folder = require('../models/Folder')

const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/desktop')
})

router.get('/desktop', authMiddleware, async(req, res) => {
    const shortcuts = await Shortcut.find({ user: req.user._id }).lean()
    const shortcutsAZ = await Array.from(shortcuts).sort((a, b) => a.title[0].localeCompare(b.title[0], ['en', 'ja']))
    const folders = await Folder.find({ user: req.user._id }).lean()
    res.render('desktop', { user: req.user, shortcuts: shortcuts, shortcutsAZ: shortcutsAZ, folders: folders })
})

router.post('/shortcut/add', authMiddleware, async(req, res) => {
    const { title, url, folder } = req.body
    try {
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(url)}`
        await Shortcut.create({
            title: title || url.split('/')[2] || 'Shortcut',
            url: url,
            faviconUrl: faviconUrl,
            folder: folder,
            user: req.user._id
        })
        req.flash('success_msg', 'ショートカットを作成しました')
        res.redirect('/desktop')
    }
    catch(error) {
        req.flash('error_msg', 'ショートカットの作成に失敗しました')
        console.log('Error in create shortcut')
        res.redirect('/desktop')
    }
})

router.post('/shortcut/edit/:id', authMiddleware, async(req, res) => {
    const { title, url, folder } = req.body
    try {
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(url)}`
        await Shortcut.findOneAndUpdate({ _id: req.params.id }, {
            title: title || url.split('/')[2] || 'Shortcut',
            url: url,
            faviconUrl: faviconUrl,
            folder: folder,
        })
        req.flash('success_msg', 'ショートカットを更新しました')
        res.redirect('/desktop')
    }
    catch(error) {
        req.flash('error_msg', 'ショートカットの更新に失敗しました')
        console.log('Error in edit shortcut')
        res.redirect('/desktop')
    }
})

router.post('/shortcut/delete/:id', authMiddleware, async(req, res) => {
    try {
        await Shortcut.findOneAndDelete({ _id: req.params.id })
        req.flash('success_msg', 'ショートカットを削除しました')
        res.redirect('/desktop')
    }
    catch(error) {
        req.flash('error_msg', 'ショートカットの削除に失敗しました')
        console.log('Error in delete shortcut')
        res.redirect('/desktop')
    }
})

router.post('/folder/add', authMiddleware, async(req, res) => {
    const { title } = req.body
    try {
        await Folder.create({
            title: title,
            user: req.user._id
        })
        req.flash('success_msg', 'フォルダを作成しました')
        res.redirect('/desktop')
    }
    catch(error) {
        req.flash('error_msg', 'フォルダの作成に失敗しました')
        console.log('Error in create folder')
        res.redirect('/desktop')
    }
})

router.post('/folder/edit/:id', authMiddleware, async(req, res) => {
    const { title } = req.body
    try {
        await Folder.findOneAndUpdate({ _id: req.params.id }, {
            title: title
        })
        req.flash('success_msg', 'フォルダを更新しました')
        res.redirect('/desktop')
    }
    catch(error) {
        req.flash('error_msg', 'フォルダの更新に失敗しました')
        console.log('Error in edit folder')
        res.redirect('/desktop')
    }
})

router.post('/folder/delete/:id', authMiddleware, async(req, res) => {
    try {
        await Shortcut.findOneAndDelete({ _id: req.params.id })
        req.flash('success_msg', 'フォルダを削除しました')
        res.redirect('/desktop')
    }
    catch(error) {
        req.flash('error_msg', 'フォルダの削除に失敗しました')
        console.log('Error in delete folder')
        res.redirect('/desktop')
    }
})

module.exports = router
