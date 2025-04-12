const express = require('express')
const passport = require('passport')

const User = require('../models/User')

const router = express.Router()

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async(req, res) => {
    const { username, password } = req.body
    try {
        await User.create({
            username: username,
            password: password,
            shortcuts: []
        })
        req.flash('success_msg', 'アカウント登録しました')
        res.redirect('/auth/login')
    }
    catch(error) {
        req.flash('error_msg', 'このユーザーネームはすでに使われています')
        res.redirect('/auth/register')
    }
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            return next(err)
        }
        if(!user) {
            req.flash('error_msg', info.message || 'ユーザーネームまたはパスワードが違います')
            return res.redirect('/auth/login')
        }
        req.logIn(user, (err) => {
            if(err) {
                return next(err)
            }
            req.flash('success_msg', 'ログインしました')
            res.redirect('/desktop')
        })
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logOut(() => {
        req.flash('success_msg', 'ログアウトしました')
        res.redirect('/auth/login')
    })
})

module.exports = router
