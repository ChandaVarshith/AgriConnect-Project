const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/loan.controller')
const appCtrl = require('../controllers/loanApplication.controller')
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')
const upload = require('../middleware/upload.middleware')

// Public / farmer loan browsing
router.get('/', ctrl.getLoans)
router.get('/:id', ctrl.getLoanById)

// Financier: add / update loans
router.post('/', auth, role('financier'), ctrl.addLoan)
router.put('/:id', auth, role('financier'), ctrl.updateLoan)
router.delete('/:id', auth, role('financier'), ctrl.deleteLoan)
router.delete('/:id/remove', auth, role('financier'), ctrl.removeLoan)

// Farmer: apply for loan
router.post('/apply', auth, upload.array('documents', 5), appCtrl.apply)
router.get('/applications/mine', auth, appCtrl.getMyApplications)

// Financier: view & manage applications
router.get('/applications', auth, role('financier'), appCtrl.getApplications)
router.patch('/applications/:id', auth, role('financier'), appCtrl.updateStatus)
router.put('/applications/:id/accept', auth, role('financier'), appCtrl.acceptApplication)
router.put('/applications/:id/reject', auth, role('financier'), appCtrl.rejectApplication)

// Financier: farmer loans portfolio view
router.get('/farmer-loans', auth, role('financier'), appCtrl.getFarmerLoans)

module.exports = router
