const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

// Expert-specific guarded routes placeholder
router.use(auth, role('expert'))

module.exports = router
