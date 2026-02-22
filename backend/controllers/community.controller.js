const CommunityPost = require('../models/CommunityPost.model')

exports.getPosts = async (req, res) => {
    try {
        const posts = await CommunityPost.find({ status: 'approved' }).sort({ createdAt: -1 })
        res.json(posts)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.createPost = async (req, res) => {
    try {
        const post = await CommunityPost.create({ ...req.body, userId: req.body.userId || 'anonymous' })
        res.status(201).json(post)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.moderatePost = async (req, res) => {
    try {
        const post = await CommunityPost.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
        res.json(post)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
