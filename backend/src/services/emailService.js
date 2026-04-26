const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an emergency email alert
 * @param {Object} incident - The incident details
 */
const sendEmailAlert = async (incident) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ Email credentials missing. Email skipped.');
            return { success: false, message: 'Email not configured' };
        }

        const mailOptions = {
            from: `"RespondR Alert" <${process.env.EMAIL_USER}>`,
            to: process.env.EMERGENCY_CONTACT_EMAIL || process.env.EMAIL_USER, // Fallback to sender
            subject: `🚨 EMERGENCY: ${incident.incident_type} at ${incident.location}`,
            text: `An emergency has been reported through RespondR.\n\nType: ${incident.incident_type}\nLocation: ${incident.location}\nStatus: PENDING\n\nPlease respond immediately.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 12px;">
                    <h2 style="color: #ef4444; margin-top: 0;">🚨 EMERGENCY ALERT</h2>
                    <p><strong>Type:</strong> ${incident.incident_type}</p>
                    <p><strong>Location:</strong> ${incident.location}</p>
                    <p><strong>Status:</strong> PENDING</p>
                    <hr />
                    <p style="color: #666; font-size: 14px;">This alert was generated automatically by RespondR.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: ' + info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Sends an acknowledgement email to the user
 * @param {Object} incident - The incident details (must include user_email)
 */
const sendAcknowledgementEmail = async (incident) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return { success: false, message: 'Email not configured' };
        }

        const mailOptions = {
            from: `"RespondR Support" <${process.env.EMAIL_USER}>`,
            to: incident.user_email,
            subject: `✅ Update: Your SOS for ${incident.incident_type} has been acknowledged`,
            text: `Hello,\n\nYour emergency report for ${incident.incident_type} at ${incident.location} has been ACKNOWLEDGED by our responders. Help is on the way.\n\nStatus: ${incident.status.toUpperCase()}\n\nPlease stay calm and safe.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 2px solid #22c55e; border-radius: 12px;">
                    <h2 style="color: #22c55e; margin-top: 0;">✅ SOS ACKNOWLEDGED</h2>
                    <p>Your emergency report has been seen by our staff. Help is being coordinated right now.</p>
                    <p><strong>Type:</strong> ${incident.incident_type}</p>
                    <p><strong>Location:</strong> ${incident.location}</p>
                    <p><strong>Current Status:</strong> <span style="color: #22c55e; font-weight: bold;">${incident.status.toUpperCase()}</span></p>
                    <hr />
                    <p style="color: #666; font-size: 14px;">Stay where you are if safe. RespondR responders are on the move.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Failed to send acknowledgement email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmailAlert, sendAcknowledgementEmail };
