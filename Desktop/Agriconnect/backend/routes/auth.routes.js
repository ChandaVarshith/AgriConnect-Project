const express = require('express')
const router = express.Router()
const authCtrl = require('../controllers/auth.controller')

router.post('/register/farmer', authCtrl.registerFarmer)
router.post('/register/expert', authCtrl.registerExpert)
router.post('/login/farmer', authCtrl.loginFarmer)
router.post('/login/expert', authCtrl.loginExpert)
router.post('/login/admin', authCtrl.loginAdmin)
router.post('/login/financier', authCtrl.loginFinancier)
router.post('/send-otp', authCtrl.sendOTP)
router.post('/verify-otp', authCtrl.verifyOTP)
router.post('/reset-password', authCtrl.resetPassword)

module.exports = router
