const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const User = require('../models/User')

passport.use(new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    try {
        const user = await User.findOne({ username })
        if(!user) {
            return done(null, false, { message: 'ユーザーネームまたはパスワードが違います' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return done(null, false, { message: 'ユーザーネームまたはパスワードが違います' })
        }

        return done(null, user)
    }
    catch(err) {
        return done(err)
    }
}))

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    }
    catch(err) {
        done(err)
    }
})
