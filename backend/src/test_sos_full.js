const http = require('http');

async function runTest() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    // 1. Register
    const regData = JSON.stringify({
        name: 'Test User',
        email,
        password,
        role: 'user'
    });

    const regRes = await post('/api/auth/register', regData);
    console.log('Register Response:', regRes);

    // 2. Login
    const loginData = JSON.stringify({ email, password });
    const loginRes = await post('/api/auth/login', loginData);
    console.log('Login Response:', loginRes);
    const token = loginRes.token;

    if (!token) {
        console.error('No token received');
        return;
    }

    // 3. SOS
    const sosData = JSON.stringify({
        location: 'Test Location',
        incidentType: 'Test Type'
    });

    const sosRes = await post('/api/sos', sosData, token);
    console.log('SOS Response:', sosRes);
}

function post(path, data, token = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

runTest();
