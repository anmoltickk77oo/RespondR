const twilio = require('twilio');

// These will be loaded from your .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const emergencyContact = process.env.EMERGENCY_CONTACT_NUMBER;

let client;

// Initialize Twilio only if credentials exist
if (accountSid && authToken) {
    client = twilio(accountSid, authToken);
}

/**
 * Sends an emergency SMS alert
 * @param {Object} incident - The incident details
 */
const sendSMSAlert = async (incident) => {
    try {
        if (!client) {
            console.warn('⚠️ Twilio credentials missing. SMS skipped.');
            return { success: false, message: 'Twilio not configured' };
        }

        const messageBody = `🚨 EMERGENCY ALERT: ${incident.incident_type} reported at ${incident.location}. Status: PENDING. Respond immediately!`;

        const message = await client.messages.create({
            body: messageBody,
            from: twilioNumber,
            to: emergencyContact
        });

        console.log(`✅ SMS Sent: ${message.sid}`);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error('❌ Failed to send SMS:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendSMSAlert };
