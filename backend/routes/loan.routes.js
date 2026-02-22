const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/loan.controller')
const appCtrl = require('../controllers/loanApplication.controller')
const auth = require('../middleware/auth.middleware')
const upload = require('../middleware/upload.middleware')

router.get('/', ctrl.getLoans)
router.get('/:id', ctrl.getLoanById)

router.post('/', auth, ctrl.addLoan)
router.put('/:id', auth, ctrl.updateLoan)
router.delete('/:id', auth, ctrl.deleteLoan)

router.post('/apply', auth, upload.array('documents', 5), appCtrl.apply)
router.get('/applications', auth, appCtrl.getApplications)
router.get('/applications/mine', auth, appCtrl.getMyApplications)
router.patch('/applications/:id', auth, appCtrl.updateStatus)

module.exports = router
