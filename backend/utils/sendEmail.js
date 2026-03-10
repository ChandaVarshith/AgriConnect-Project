const transporter = require('../config/mailer')

/**
 * Send a plain-text email
 * @param {string} to      - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text    - Email body
 */
const sendEmail = async (to, subject, text) => {
    // Graceful fallback for local development without configured mailers
    if (!process.env.MAIL_PASS || process.env.MAIL_PASS === 'your_app_password_here') {
        console.log('\n======================================================')
        console.log(`[LOCAL DEV EMAIL MOCK] To: ${to}`)
        console.log(`Subject: ${subject}`)
        console.log(`Body: ${text}`)
        console.log('======================================================\n')
        return
    }

    try {
        await transporter.sendMail({
            from: `"AgriConnect" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
        })
        console.log(`[EMAIL] Sent to ${to}: ${subject}`)
    } catch (err) {
        // If SMTP fails, fall back to console so flow is not blocked
        console.error(`[EMAIL ERROR] Failed to send to ${to}:`, err.message)
        console.log('\n======================================================')
        console.log(`[FALLBACK OTP] To: ${to}`)
        console.log(`Body: ${text}`)
        console.log('======================================================\n')
        throw err  // re-throw so the controller can return a proper 500
    }
}

module.exports = { sendEmail }
