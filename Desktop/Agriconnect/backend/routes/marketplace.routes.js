const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/marketplace.controller')
const auth = require('../middleware/auth.middleware')

router.get('/', ctrl.getListings)
router.get('/mine', auth, ctrl.getMyListings)
router.get('/:id', ctrl.getListingById)
router.post('/', auth, ctrl.createListing)
router.put('/:id', auth, ctrl.updateListing)
router.delete('/:id', auth, ctrl.deleteListing)
router.post('/:id/purchase', ctrl.purchase)

module.exports = router
