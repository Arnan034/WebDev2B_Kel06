// server/src/utils/performance/mailer.utils.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    try {
        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const transporter = nodemailer.createTransport({
            pool: true,
            maxConnections: 10,
            maxMessages: 100,
            rateDelta: 1000,
            rateLimit: 5,
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GOOGLE_EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: process.env.GOOGLE_ACCESS_TOKEN
                // accessToken: accessToken
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        return transporter;
    } catch (error) {
        console.error('Error creating transporter:', error);
        throw error;
    }
};

let transporter = null;
const getTransporter = async () => {
    if (!transporter) {
        transporter = await createTransporter();
    }
    return transporter;
};

const sendEmail = async (email, type, data) => {
    try {
        const emailTransporter = await getTransporter();
        let mailOptions = {
            from: 'CINELUX <naia.siti.tif422@polban.ac.id>',
            to: email,
            priority: 'high'
        };

        // Template email yang sudah di-cache
        switch(type) {
            case 'otp':
                mailOptions.subject = 'Your OTP Code';
                mailOptions.html = `<p>Your OTP code is: <strong>${data.otp}</strong><br>Valid for 5 minutes.</p>`;
                break;
            case 'forget-password':
                mailOptions.subject = 'Reset Your Password';
                mailOptions.html = `<p>You requested a password reset</p><p>Click this <a href="http://localhost:3000/resetPassword?token=${data.token}">link</a> to reset your password</p>`;
                break;
            default:
                throw new Error('Invalid email type');
        }

        const start = Date.now();
        const info = await emailTransporter.sendMail(mailOptions);
        console.log(`Email sent in ${Date.now() - start}ms`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Reset transporter jika terjadi error autentikasi
        if (error.code === 'EAUTH') {
            transporter = null;
        }
        throw error;
    }
};

// Inisialisasi transporter saat startup
getTransporter();

module.exports = { sendEmail };