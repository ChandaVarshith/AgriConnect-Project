const express = require('express')
const router = express.Router()
const adminCtrl = require('../controllers/admin.controller')
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

router.use(auth, role('admin'))

router.get('/stats', adminCtrl.getStats)
router.get('/query-stats', adminCtrl.getQueryStats)

// Farmer management
router.get('/farmers', adminCtrl.getFarmers)
router.post('/farmers', adminCtrl.addFarmer)

// Expert management
router.get('/experts', adminCtrl.getExperts)
router.post('/experts', adminCtrl.addExpert)
router.patch('/experts/:id', adminCtrl.updateExpertStatus)
router.put('/experts/:id/approve', adminCtrl.approveExpert)
router.put('/experts/:id/reject', adminCtrl.rejectExpert)
router.delete('/experts/:id', adminCtrl.deleteExpert)

// Financier management
router.get('/financiers', adminCtrl.getFinanciers)
router.post('/financiers', adminCtrl.addFinancier)

module.exports = router
