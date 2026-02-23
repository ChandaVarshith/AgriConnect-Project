const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/marketplace.controller')
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')

// IMPORTANT: Specific routes MUST come BEFORE parameterized routes (/:id)
// Otherwise Express matches 'mine' and 'expert' as an :id parameter

// Farmer routes (auth required)
router.get('/mine/listings', auth, ctrl.getMyListings)
router.get('/farmer/all', auth, ctrl.getAllForFarmer)
router.post('/', auth, ctrl.createListing)

// Expert routes (auth + role required)
router.get('/expert/pending', auth, role('expert'), ctrl.getPendingListings)

// Public routes
router.get('/', ctrl.getListings)
router.get('/:id', ctrl.getListingById)
router.post('/:id/purchase', ctrl.purchase)

// Farmer update/delete (must come after specific routes)
router.put('/:id', auth, ctrl.updateListing)
router.delete('/:id', auth, ctrl.deleteListing)

// Expert approve/reject/remove
router.put('/:id/approve', auth, role('expert'), ctrl.approveListing)
router.put('/:id/reject', auth, role('expert'), ctrl.rejectListing)
router.delete('/:id/expert-remove', auth, role('expert'), ctrl.expertRemoveListing)

module.exports = router
