const jwt = require('jsonwebtoken')

/**
 * Generate a JWT token for a given userId and role
 * @param {string} id   - MongoDB user _id
 * @param {string} role - admin | farmer | expert | financier
 * @returns JWT token string (expires in 7 days)
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

module.exports = { generateToken }
