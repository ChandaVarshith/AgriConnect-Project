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
router.delete('/farmers/:id', adminCtrl.deleteFarmer)

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
router.put('/financiers/:id/approve', adminCtrl.approveFinancier)
router.put('/financiers/:id/reject', adminCtrl.rejectFinancier)
router.delete('/financiers/:id', adminCtrl.deleteFinancier)

// Sector management
router.get('/sectors', adminCtrl.getSectors)
router.post('/sectors', adminCtrl.addSector)
router.delete('/sectors/:id', adminCtrl.deleteSector)

module.exports = router
