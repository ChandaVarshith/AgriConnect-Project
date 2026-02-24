const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/loan.controller')
const appCtrl = require('../controllers/loanApplication.controller')
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')
const upload = require('../middleware/upload.middleware')

// ── Specific static GET routes MUST come before /:id wildcard ──

// Farmer: apply for loan (POST)
router.post('/apply', auth, upload.array('documents', 5), appCtrl.apply)

// Farmer: my applications
router.get('/applications/mine', auth, appCtrl.getMyApplications)

// Financier: all applications
router.get('/applications', auth, role('financier'), appCtrl.getApplications)

// Financier: farmer portfolio grouped
router.get('/farmer-loans', auth, role('financier'), appCtrl.getFarmerLoans)

// Financier: manage individual applications
router.patch('/applications/:id', auth, role('financier'), appCtrl.updateStatus)
router.put('/applications/:id/accept', auth, role('financier'), appCtrl.acceptApplication)
router.put('/applications/:id/reject', auth, role('financier'), appCtrl.rejectApplication)

// ── Public / farmer loan browsing ──
router.get('/', ctrl.getLoans)
router.get('/:id', ctrl.getLoanById)   // wildcard LAST

// ── Financier: add / update / delete loans ──
router.post('/', auth, role('financier'), ctrl.addLoan)
router.put('/:id', auth, role('financier'), ctrl.updateLoan)
router.delete('/:id/remove', auth, role('financier'), ctrl.removeLoan)
router.delete('/:id', auth, role('financier'), ctrl.deleteLoan)

module.exports = router
