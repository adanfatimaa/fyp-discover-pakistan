require('dotenv').config();
const { sendVerificationEmail } = require('./backend/utils/mailer');

sendVerificationEmail('adannaqvi786@gmail.com', 'Test User', 'test123')
    .then(() => console.log('Email sent successfully'))
    .catch((e) => console.log('Failed:', e.message));