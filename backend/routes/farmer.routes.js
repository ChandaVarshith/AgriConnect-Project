const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

// Farmer-specific routes (not in query.routes) can be added here
router.use(auth, role('farmer'))

module.exports = router
