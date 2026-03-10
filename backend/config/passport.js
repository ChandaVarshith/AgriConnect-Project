const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const PublicUser = require('../models/PublicUser.model')
const { generateToken } = require('../utils/generateToken')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails[0].value
            const name = profile.displayName

            // Find existing user or create new one
            let user = await PublicUser.findOne({ email })
            if (!user) {
                user = await PublicUser.create({
                    name,
                    email,
                    password: 'google-oauth-user', // placeholder — can't login with password
                    googleId: profile.id,
                })
            }

            // Attach token to user object for use in callback
            user._token = generateToken(user._id, 'public')
            done(null, user)
        } catch (err) {
            done(err, null)
        }
    }))

module.exports = passport
