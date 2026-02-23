const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

// Financier-specific guarded routes
// (loan operations are handled in loan.routes.js)
router.use(auth, role('financier'))

// Placeholder for any future financier-specific endpoints
router.get('/me', async (req, res) => {
    res.json({ message: 'Financier authenticated.', id: req.user.id })
})

module.exports = router
