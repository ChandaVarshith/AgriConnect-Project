const express = require('express')
const router = express.Router()
const adminCtrl = require('../controllers/admin.controller')
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

router.use(auth, role('admin'))

router.get('/stats', adminCtrl.getStats)
router.get('/farmers', adminCtrl.getFarmers)
router.get('/experts', adminCtrl.getExperts)
router.patch('/experts/:id', adminCtrl.updateExpertStatus)
router.get('/financiers', adminCtrl.getFinanciers)

module.exports = router
