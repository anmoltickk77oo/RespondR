const http = require('http');

const loginData = JSON.stringify({
    email: 'test_user@example.com',
    password: 'password123'
});

const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const req = http.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        const result = JSON.parse(data);
        const token = result.token;
        if (!token) {
            console.error('Login failed:', result);
            return;
        }

        const sosData = JSON.stringify({
            location: 'Main Lobby',
            incidentType: 'Medical'
        });

        const sosOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/sos',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': sosData.length,
                'Authorization': `Bearer ${token}`
            }
        };

        const sosReq = http.request(sosOptions, (sosRes) => {
            let sosDataRes = '';
            sosRes.on('data', (chunk) => sosDataRes += chunk);
            sosRes.on('end', () => {
                console.log('SOS Response:', JSON.parse(sosDataRes));
            });
        });

        sosReq.on('error', (e) => console.error('SOS Request Error:', e));
        sosReq.write(sosData);
        sosReq.end();
    });
});

req.on('error', (e) => console.error('Login Request Error:', e));
req.write(loginData);
req.end();
