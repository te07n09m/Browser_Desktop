const express = require('express')

const authMiddleware = require('../middleware/authMiddleware')

const Shortcut = require('../models/Shortcut')

const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/desktop')
})

router.get('/desktop', authMiddleware, async(req, res) => {
    const shortcutObjects = await Shortcut.find().lean()
    const shortcuts = await Array.from(req.user.shortcuts).map(shortcutId => shortcutObjects.find(shortcut => shortcut._id == shortcutId))
    const shortcutsAZ = await Array.from(shortcuts).sort((a, b) => a.title[0].localeCompare(b.title[0], ['en', 'ja']))
    res.render('desktop', { user: req.user, shortcuts: shortcuts, shortcutsAZ: shortcutsAZ })
})

router.post('/shortcut/add', authMiddleware, async(req, res) => {
    const { title, url } = req.body
    try {
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(url)}`
        const newShortcut = await Shortcut.create({
            title: title || url.split('/')[2] || 'Shortcut',
            url: url,
            faviconUrl: faviconUrl
        })
        await req.user.shortcuts.push(newShortcut._id)
        await req.user.save()
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
    const { title, url } = req.body
    try {
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(url)}`
        await Shortcut.findOneAndUpdate({ _id: req.params.id }, {
            title: title || url.split('/')[2] || 'Shortcut',
            url: url,
            faviconUrl: faviconUrl
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
        await req.user.shortcuts.splice(req.user.shortcuts.indexOf(req.params.id), 1)
        await req.user.save()
        req.flash('success_msg', 'ショートカットを削除しました')
        res.redirect('/desktop')
    }
    catch(error) {
        req.flash('error_msg', 'ショートカットの削除に失敗しました')
        console.log('Error in delete shortcut')
        res.redirect('/desktop')
    }
})

module.exports = router
