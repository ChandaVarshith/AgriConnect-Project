const transporter = require('../config/mailer')

/**
 * Send a plain-text email
 * @param {string} to      - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text    - Email body
 */
const sendEmail = async (to, subject, text) => {
    await transporter.sendMail({
        from: `"AgriConnect" <${process.env.MAIL_USER}>`,
        to,
        subject,
        text,
    })
}

module.exports = { sendEmail }
