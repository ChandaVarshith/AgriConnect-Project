const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/ai.controller')

router.post('/voice-query', ctrl.processVoiceQuery)
router.post('/gemini-assist', ctrl.geminiAssist)

module.exports = router
