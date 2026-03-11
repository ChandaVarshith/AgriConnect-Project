const express = require('express');
const router = express.Router();
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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

router.post('/predict-disease', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const imagePath = req.file.path;
        const scriptPath = path.join(__dirname, '../predict.py');
        
        // Spawn Python process
        const pythonProcess = spawn('python', [scriptPath, imagePath]);
        
        let pythonData = '';
        let pythonError = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonData += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
            console.error(`Python stderr: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            // Delete the temp uploaded file
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            try {
                if (!pythonData) {
                    return res.status(500).json({ success: false, message: 'No output from prediction script', error: pythonError });
                }

                // Extract json from python stdout (in case TF logged other stuff)
                const jsonMatch = pythonData.match(/\{.*\}/s);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    return res.json(result);
                } else {
                    return res.status(500).json({ success: false, message: 'Failed to parse prediction result', rawOutput: pythonData });
                }

            } catch (err) {
                console.error("Error parsing python output:", err);
                return res.status(500).json({ success: false, message: 'Prediction failed', error: err.message });
            }
        });

    } catch (error) {
        console.error('Error in predict-disease route:', error);
        res.status(500).json({ success: false, message: 'Server error during prediction' });
    }
});

module.exports = router;
