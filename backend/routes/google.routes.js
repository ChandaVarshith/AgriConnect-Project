const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { generateToken } = require('../utils/generateToken')

// Redirect to Google login
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

// Google callback
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:3000'}/login?error=google_failed` }),
    (req, res) => {
        const user = req.user
        const token = generateToken(user._id, 'public')
        // Redirect to frontend with token and user info in query params
        const payload = encodeURIComponent(JSON.stringify({
            user: { _id: user._id, name: user.name, email: user.email },
            token,
            role: 'public'
        }))
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/google-callback?data=${payload}`)
    }
)

module.exports = router
