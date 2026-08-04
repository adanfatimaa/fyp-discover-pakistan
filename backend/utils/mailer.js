const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendVerificationEmail(toEmail, name, token) {
    const verifyLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

    await transporter.sendMail({
        from: '"Discover Pakistan" <' + process.env.EMAIL_USER + '>',
        to: toEmail,
        subject: 'Verify your Discover Pakistan account',
        html: `
            <h2>Welcome to Discover Pakistan, ${name}!</h2>
            <p>Please click the button below to verify your email and activate your account:</p>
            <a href="${verifyLink}" style="background-color:#6b8f3e; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; display:inline-block;">Verify My Email</a>
            <p>Or copy this link: ${verifyLink}</p>
        `
    });
}

async function sendResetEmail(toEmail, name, token) {
    const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;

    await transporter.sendMail({
        from: '"Discover Pakistan" <' + process.env.EMAIL_USER + '>',
        to: toEmail,
        subject: 'Reset your Discover Pakistan password',
        html: `
            <h2>Hi ${name},</h2>
            <p>We got a request to reset your password. Click below to set a new one:</p>
            <a href="${resetLink}" style="background-color:#6b8f3e; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; display:inline-block;">Reset My Password</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>This link will expire in 10 minutes.</p>
        `
    });
}

module.exports = { sendVerificationEmail, sendResetEmail };