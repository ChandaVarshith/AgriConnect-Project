/**
 * Custom password encryption — Shift cipher for demo purposes
 * Replace with bcrypt for production: require('bcryptjs').hash(password, 10)
 */
const SHIFT = 7

const encryptPassword = (password) =>
    password.split('').map(c => String.fromCharCode(c.charCodeAt(0) + SHIFT)).join('')

const verifyPassword = (plain, encrypted) =>
    encryptPassword(plain) === encrypted

module.exports = { encryptPassword, verifyPassword }
