const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/community.controller')

router.get('/', ctrl.getPosts)
router.post('/', ctrl.createPost)
router.patch('/:id', ctrl.moderatePost)

module.exports = router
