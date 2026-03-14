/**
 * downloadModel.js
 * Downloads the plant disease recognition model from Google Drive
 * if it is not already present locally (e.g. on Render at deploy time).
 *
 * Set the env var MODEL_GDRIVE_FILE_ID to your Google Drive file ID.
 * The file must be shared as "Anyone with the link – Viewer".
 */

const https = require('https')
const http  = require('http')
const fs    = require('fs')
const path  = require('path')

const MODEL_FILENAME = 'plant_disease_recog_model_pwp.keras'
const MODEL_PATH     = path.join(__dirname, '..', MODEL_FILENAME)

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)

    const request = protocol.get(url, (response) => {
      // Follow redirects (Google Drive sends 302 → actual download)
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 303) {
        file.close()
        fs.unlinkSync(dest) // remove empty file before retry
        console.log(`[downloadModel] Following redirect to: ${response.headers.location}`)
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject)
      }

      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(dest)
        return reject(new Error(`Failed to download model – HTTP ${response.statusCode}`))
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    })

    request.on('error', (err) => {
      fs.unlink(dest, () => {}) // clean up partial file
      reject(err)
    })

    file.on('error', (err) => {
      fs.unlink(dest, () => {})
      reject(err)
    })
  })
}

async function ensureModelExists() {
  if (fs.existsSync(MODEL_PATH)) {
    console.log(`[downloadModel] Model already exists at ${MODEL_PATH} ✅`)
    return
  }

  const fileId = process.env.MODEL_GDRIVE_FILE_ID
  if (!fileId) {
    console.warn('[downloadModel] ⚠ MODEL_GDRIVE_FILE_ID env var is not set. Skipping model download.')
    return
  }

  console.log(`[downloadModel] Model not found locally. Downloading from Google Drive (file ID: ${fileId})...`)

  // Google Drive direct download URL
  const url = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`

  try {
    await downloadFile(url, MODEL_PATH)
    const stats = fs.statSync(MODEL_PATH)
    console.log(`[downloadModel] ✅ Model downloaded successfully (${(stats.size / 1024 / 1024).toFixed(1)} MB)`)
  } catch (err) {
    console.error('[downloadModel] ❌ Failed to download model:', err.message)
    // Don't crash the server — predict.py will return a friendly error
  }
}

module.exports = ensureModelExists
