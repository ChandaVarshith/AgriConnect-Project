const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/weather.controller')

router.get('/', ctrl.getWeather)

module.exports = router
