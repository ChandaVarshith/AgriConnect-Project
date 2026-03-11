const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const session = require('express-session')

// Load env vars FIRST before any module that reads process.env
dotenv.config()

const passport = require('./config/passport')

const app = express()
const PORT = process.env.PORT || 5000

// Log key startup info
console.log(`
Starting AgriConnect backend
NODE_ENV=${process.env.NODE_ENV || 'development'}
PORT=${PORT}
CLIENT_URL=${process.env.CLIENT_URL || 'not-set'}
MONGO_URI_SET=${process.env.MONGO_URI ? 'yes' : 'no'}
`)

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.options('*', cors())  // pre-flight for all routes

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Session required for Passport (minimal, stateless JWT issued post-OAuth)
app.use(session({ secret: process.env.JWT_SECRET || 'agriconnect-session-secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())

// ── Database Connection ───────────────────────────────────────────────────────
require('./config/db')()

// Global handlers for uncaught errors to aid debugging
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err && err.stack ? err.stack : err)
    // In production you might want to exit; for development keep process alive for inspection
    if (process.env.NODE_ENV === 'production') process.exit(1)
})

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason)
    if (process.env.NODE_ENV === 'production') process.exit(1)
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/auth', require('./routes/google.routes'))
app.use('/api/admin', require('./routes/admin.routes'))
app.use('/api/farmer', require('./routes/farmer.routes'))
app.use('/api/expert', require('./routes/expert.routes'))
app.use('/api/financier', require('./routes/financier.routes'))
app.use('/api/queries', require('./routes/query.routes'))
app.use('/api/articles', require('./routes/article.routes'))
app.use('/api/loans', require('./routes/loan.routes'))
app.use('/api/marketplace', require('./routes/marketplace.routes'))
app.use('/api/community', require('./routes/community.routes'))
app.use('/api/farmvisit', require('./routes/farmvisit.routes'))
app.use('/api/ai', require('./routes/ai.routes'))
app.use('/api/weather', require('./routes/weather.routes'))
app.use('/api/ml', require('./routes/ml.routes'))

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'AgriConnect API is running ✅' }))

// ── Root route (silences browser 404 on /) ───────────────────────────────────
app.get('/', (req, res) => res.json({ name: 'AgriConnect API', status: 'running', version: '1.0.0' }))

// ── Chrome DevTools well-known handler (silences CSP console noise) ───────────
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => res.json({}))


// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(require('./middleware/error.middleware'))

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 AgriConnect server running on http://localhost:${PORT}`)
})
