const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// ── Database Connection ───────────────────────────────────────────────────────
require('./config/db')()

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth.routes'))
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

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'AgriConnect API is running ✅' }))

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use(require('./middleware/error.middleware'))

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 AgriConnect server running on http://localhost:${PORT}`)
})
