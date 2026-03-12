const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const auth = require('../middleware/auth.middleware');
const streamifier = require('streamifier');

// ── Cloudinary Config ─────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — we stream directly to Cloudinary
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/upload/image  — returns { url }
router.post('/image', auth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No image provided.' });

    const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'agriconnect/queries', resource_type: 'image' },
        (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                return res.status(500).json({ message: 'Image upload failed.', error: error.message });
            }
            res.json({ url: result.secure_url });
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

module.exports = router;
