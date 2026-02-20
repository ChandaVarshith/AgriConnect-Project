/**
 * encrypt.js — Custom Shift-based password encryption (for demonstration)
 * NOTE: Use bcryptjs in production for secure hashing
 */
const SHIFT = 7

export const encryptPassword = (password) => {
    return password.split('').map(c => String.fromCharCode(c.charCodeAt(0) + SHIFT)).join('')
}

export const verifyPassword = (plain, encrypted) => {
    return encryptPassword(plain) === encrypted
}
