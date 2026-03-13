const nodemailer = require('nodemailer')

const submitContactForm = async (req, res) => {
    try {
        const { name, email, mobile, issueType, description } = req.body

        if (!name || !mobile || !issueType || !description) {
            return res.status(400).json({ success: false, message: 'Name, Mobile, Issue Type, and Description are required' })
        }

        // Configure nodemailer transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER || 'lifefrombtech@gmail.com',
                pass: process.env.MAIL_PASS
            }
        })

        const mailOptions = {
            from: process.env.MAIL_USER || 'lifefrombtech@gmail.com',
            to: 'lifefrombtech@gmail.com', // Target email provided by user
            subject: `[AgriConnect Help Center] New Query from ${name} - ${issueType}`,
            html: `
                <h3>New Help Center Request</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                <p><strong>Issue Type:</strong> ${issueType}</p>
                <br/>
                <p><strong>Description:</strong><br/>${description.replace(/\n/g, '<br/>')}</p>
            `
        }

        // Send the email
        await transporter.sendMail(mailOptions)

        res.status(200).json({ success: true, message: 'Message sent successfully' })
    } catch (error) {
        console.error('Error submitting contact form:', error)
        res.status(500).json({ success: false, message: 'Failed to send message', error: error.message })
    }
}

module.exports = { submitContactForm }
