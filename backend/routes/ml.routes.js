const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// On Render (Linux): use Miniconda Python 3.11 which has TensorFlow installed
// On Windows (local dev): use system python
const PYTHON = process.platform === 'win32'
    ? 'python'
    : '/opt/render/project/src/.conda/bin/python3';


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

function runPythonScript(scriptPath, imagePath) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(PYTHON, [scriptPath, imagePath]);
        
        let pythonData = '';
        let pythonError = '';

        // 30 second timeout - TFLite cold start is very fast (2-3s)
        const timeout = setTimeout(() => {
            pythonProcess.kill();
            reject(new Error('Prediction timed out after 30 seconds'));
        }, 30000);

        pythonProcess.stdout.on('data', (data) => {
            pythonData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
            console.error(`Python stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            clearTimeout(timeout);
            try {
                if (!pythonData) {
                    return reject(new Error(pythonError || 'No output from prediction script'));
                }

                // Extract json from python stdout (in case TF logged other stuff)
                const jsonMatch = pythonData.match(/\{.*\}/s);
                if (jsonMatch) {
                    resolve(JSON.parse(jsonMatch[0]));
                } else {
                    reject(new Error('Failed to parse prediction result: ' + pythonData));
                }
            } catch (err) {
                reject(err);
            }
        });
        
        pythonProcess.on('error', (err) => {
            clearTimeout(timeout);
            reject(err);
        });
    });
}

router.post('/predict-disease', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const imagePath = req.file.path;
        const scriptPath = path.join(__dirname, '../predict.py');
        
        try {
            const result = await runPythonScript(scriptPath, imagePath);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            return res.json(result);
        } catch (err) {
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            console.error("Error parsing python output:", err);
            return res.status(500).json({ success: false, message: 'Prediction failed', error: err.message });
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
                
                const scriptPath = path.join(__dirname, '../predict.py');
                try {
                    const result = await runPythonScript(scriptPath, tempPath);
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                    return res.json(result);
                } catch (err) {
                    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                    return res.status(500).json({ success: false, message: 'Prediction failed', error: err.message });
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
