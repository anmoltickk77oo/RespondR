require('dotenv').config();
const { sendSMSAlert } = require('./services/smsService');

async function testTextBee() {
    console.log('Testing TextBee SMS Service...');
    console.log('API Key:', process.env.TEXTBEE_API_KEY ? 'Present' : 'Missing');
    console.log('Device ID:', process.env.TEXTBEE_DEVICE_ID ? 'Present' : 'Missing');
    console.log('Emergency Contact:', process.env.EMERGENCY_CONTACT_NUMBER);

    const testIncident = {
        incident_type: 'TEST_ALERT',
        location: 'DEVELOPMENT_LAB'
    };

    const result = await sendSMSAlert(testIncident);
    console.log('Result:', JSON.stringify(result, null, 2));
}

testTextBee();
