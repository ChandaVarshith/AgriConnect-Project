const Article = require('../models/Article.model')

exports.getArticles = async (req, res) => {
    try {
        const articles = await Article.find({ isPublished: true })
            .populate('expertId', 'name').sort({ publishedAt: -1 })
        res.json(articles)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('expertId', 'name specialization')
        if (!article) return res.status(404).json({ message: 'Article not found.' })
        res.json(article)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.createArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body
        const imageUrl = req.file ? `/uploads/article-images/${req.file.filename}` : null
        const article = await Article.create({ expertId: req.user.id, title, content, tags: tags?.split(','), imageUrl })
        res.status(201).json(article)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(article)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.publishArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id,
            { isPublished: true, publishedAt: new Date() }, { new: true })
        res.json(article)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.deleteArticle = async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id)
        res.json({ message: 'Article deleted.' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
