
const axios = require('axios');

const testLogin = async () => {
    try {
        console.log('--- LOGIN TEST START ---');
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: 'admin@example.com',
            password: 'admin123'
        });
        console.log('Login Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Login Failed Status:', error.response.status);
            console.error('Login Failed Data:', error.response.data);
        } else {
            console.error('Login Error:', error.message);
        }
    }
    console.log('--- LOGIN TEST END ---');
};

testLogin();
