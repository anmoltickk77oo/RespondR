require('dotenv').config();
const { sendEmailAlert } = require('./services/emailService');

async function testEmail() {
    console.log('Testing Email Alert Service...');
    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Emergency Contact Email:', process.env.EMERGENCY_CONTACT_EMAIL);

    const testIncident = {
        incident_type: 'TEST_EMAIL_ALERT',
        location: 'VIRTUAL_TEST_SITE'
    };

    const result = await sendEmailAlert(testIncident);
    console.log('Result:', JSON.stringify(result, null, 2));
}

testEmail();
