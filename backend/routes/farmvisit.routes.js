const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/farmvisit.controller')

router.get('/', ctrl.getVisits)
router.post('/', ctrl.createVisit)
router.patch('/:id', ctrl.updateStatus)

module.exports = router
