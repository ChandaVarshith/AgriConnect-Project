const express = require('express');
const router = express.Router();
const multer = require('multer');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PREDICT_SERVER_PORT = process.env.PREDICT_SERVER_PORT || 5050;

// Configure multer for temp file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads/ml');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'crop-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

/**
 * Call the persistent Python prediction server via HTTP
 */
function callPredictServer(imagePath) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({ image_path: imagePath });

        const options = {
            hostname: '127.0.0.1',
            port: PREDICT_SERVER_PORT,
            path: '/predict',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
            },
            timeout: 120000, // 2 min max
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Failed to parse prediction response'));
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error(`Prediction server unavailable: ${err.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Prediction server timed out'));
        });

        req.write(payload);
        req.end();
    });
}

router.post('/predict-disease', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const imagePath = req.file.path;

        try {
            const result = await callPredictServer(imagePath);
            // Cleanup temp file
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            return res.json(result);
        } catch (err) {
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            console.error('Prediction error:', err.message);
            return res.status(500).json({ success: false, message: err.message });
        }

    } catch (error) {
        console.error('Error in predict-disease route:', error);
        res.status(500).json({ success: false, message: 'Server error during prediction' });
    }
});

router.post('/predict-from-url', async (req, res) => {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ success: false, message: 'No image URL provided' });

        const https = require('https');
        const uploadDir = path.join(__dirname, '../uploads/ml');
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        
        const tempPath = path.join(uploadDir, 'url-img-' + Date.now() + '.jpg');

        // Download the image
        const file = fs.createWriteStream(tempPath);
        https.get(imageUrl, (response) => {
            response.pipe(file);
            file.on('finish', async () => {
                file.close();
                try {
                    const result = await callPredictServer(tempPath);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                    return res.json(result);
                } catch (err) {
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                    return res.status(500).json({ success: false, message: err.message });
                }
            });
        }).on('error', (err) => {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            return res.status(500).json({ success: false, message: 'Failed to download image', error: err.message });
        });

    } catch (error) {
        console.error('Error in predict-from-url:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
