const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/query.controller')
const respCtrl = require('../controllers/response.controller')
const auth = require('../middleware/auth.middleware')

router.use(auth)

router.post('/', ctrl.createQuery)
router.get('/farmer', ctrl.getMyQueries)
router.get('/all', ctrl.getAllQueries)
router.get('/expert/responses', respCtrl.getExpertResponses)
router.get('/:id', ctrl.getQueryById)
router.patch('/:id/resolve', ctrl.markResolved)
router.post('/:id/respond', respCtrl.submitResponse)
router.get('/:id/responses', respCtrl.getQueryResponses)

module.exports = router
