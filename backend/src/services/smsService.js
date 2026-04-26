/**
 * TextBee SMS Service
 * Uses TextBee gateway to send SMS via Android device
 */

const API_KEY = process.env.TEXTBEE_API_KEY;
const DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;
const EMERGENCY_CONTACT = process.env.EMERGENCY_CONTACT_NUMBER;

/**
 * Sends an emergency SMS alert
 * @param {Object} incident - The incident details
 */
const sendSMSAlert = async (incident) => {
    try {
        if (!API_KEY || !DEVICE_ID) {
            console.warn('⚠️ TextBee credentials missing. SMS skipped.');
            return { success: false, message: 'TextBee not configured' };
        }

        if (!EMERGENCY_CONTACT) {
            console.warn('⚠️ Emergency contact number missing. SMS skipped.');
            return { success: false, message: 'Emergency contact not configured' };
        }

        const messageBody = `🚨 EMERGENCY ALERT: ${incident.incident_type} reported at ${incident.location}. Status: PENDING. Respond immediately!`;

        const response = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${DEVICE_ID}/send-sms`, {
            method: 'POST',
            headers: {
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipients: [EMERGENCY_CONTACT],
                message: messageBody
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        console.log(`✅ TextBee SMS Sent Successfully`);
        return { success: true, data };
    } catch (error) {
        console.error('❌ Failed to send TextBee SMS:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = { sendSMSAlert };
