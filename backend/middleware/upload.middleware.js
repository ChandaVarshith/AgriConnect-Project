const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storageFn = (folder) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, '..', 'uploads', folder)
            fs.mkdirSync(dir, { recursive: true })
            cb(null, dir)
        },
        filename: (req, file, cb) => {
            const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
            cb(null, `${unique}-${file.originalname}`)
        },
    })

const fileFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf', '.doc', '.docx']
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, allowed.includes(ext))
}

// Default upload instance (documents folder)
const upload = multer({
    storage: storageFn('documents'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})

// Article image upload — saves to uploads/article-images/
const articleUpload = multer({
    storage: storageFn('article-images'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})

// Produce image upload — saves to uploads/produce-images/
const produceUpload = multer({
    storage: storageFn('produce-images'),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
})

module.exports = upload
module.exports.articleUpload = articleUpload
module.exports.produceUpload = produceUpload
