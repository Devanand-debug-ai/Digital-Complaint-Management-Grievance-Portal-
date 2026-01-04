const axios = require('axios');

async function testRegister() {
    try {
        console.log('Sending registration request...');
        const response = await axios.post('http://localhost:3005/api/auth/register', {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            contact_info: '1234567890'
        });
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error Status:', error.response ? error.response.status : 'Unknown');
        console.error('Error Data:', error.response ? error.response.data : error.message);
    }
}

testRegister();
