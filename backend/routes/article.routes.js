const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/article.controller')
const auth = require('../middleware/auth.middleware')
const upload = require('../middleware/upload.middleware')

router.get('/', ctrl.getArticles)
router.get('/:id', ctrl.getArticleById)

router.post('/', auth, upload.single('image'), ctrl.createArticle)
router.put('/:id', auth, ctrl.updateArticle)
router.patch('/:id/publish', auth, ctrl.publishArticle)
router.delete('/:id', auth, ctrl.deleteArticle)

module.exports = router
