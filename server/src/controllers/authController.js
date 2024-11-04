// src/controllers/authController.js
const Auth = require('../models/authModel'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const nodemailer = require('nodemailer');


// Ambil client ID dari environment variable
const SECRET_KEY = process.env.SECRET_KEY;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const client = new OAuth2Client(CLIENT_ID);
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN})


const authController = {
    signin: async (req, res) => {
        const { username, password } = req.body;
    
        try {
            const user = await Auth.getUserByUsernameOrEmail(username);
    
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            if (!user.status){
                return res.status(403).json({ message: 'User has been blacklisted'})
            }
    
            const isPasswordMatch = await bcrypt.compare(password, user.password);
    
            if (isPasswordMatch) {
                const token = jwt.sign(
                    { id: user.id_user, username: user.username }, 
                    SECRET_KEY, 
                    { expiresIn: '1h' }
                );
    
                return res.json({ token, id_user: user.id_user, username: user.username, role: user.role, picture: user.picture.toString('base64')});
            }
    
            res.status(401).json({ message: 'Invalid Username / Password' });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    monitorUser: async (req, res) => {
        const { filter } = req.body;
        try {
            const users = await Auth.getMonitor(filter);
            return res.json(users);
        } catch (error) {
            console.error('Error during fetch:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    sendOTP: async (email) => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
        const otpExpiry = Date.now() + 5 * 60 * 1000; // Waktu kadaluarsa 5 menit
    
        const token = jwt.sign({ otp: otp, exp: Math.floor(otpExpiry / 1000) }, SECRET_KEY);

        try {
            // Mengambil access token untuk OAuth2
            const accessToken = await oAuth2Client.getAccessToken();

            // Konfigurasi transporter untuk Nodemailer
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.EMAIL_USER,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken.token,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            // Opsi email
            const mailOptions = {
                from: 'CINELUX <naia.siti.tif422@polban.ac.id>',
                to: email, // Gunakan email yang diterima dari parameter
                subject: 'Your OTP Code',
                text: `Your OTP code is: ${otp}. It is valid for 5 minutes. Your token is: ${token}`,
                html: `<p>Your OTP code is: <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
            };

            // Kirim email
            const info = await transporter.sendMail(mailOptions);
            return { success: true, token, response: info.response };
        } catch (error) {
            console.error('Error sending OTP:', error);
            return { success: false, error: error.message };
        }
    },

    signupOTP: async (req, res) => {
        const { username, email, password, picture } = req.body;
        try {
            const checkEmail = await Auth.checkEmail(email);
            if (checkEmail){
                return res.status(422).json({ message: 'Email already registered'});
            }

            if (!picture || !picture.includes('base64')) {
                return res.status(400).json({ error: 'Invalid image format. Please provide a valid base64 image.' });
            }
            
            const result = await authController.sendOTP(email);
            const pictureBuffer = Buffer.from(picture.split(',')[1], 'base64');
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await Auth.createUser(username, email, hashedPassword, pictureBuffer);

            if (result.success) {
                res.status(200).json({ message: 'OTP sent successfully', token: result.token, idVerified: user.id_user });
            } else {
                res.status(500).json({ message: 'Error sending OTP', error: result.error });
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ message: 'Error sending OTP', error: error.message });
        }
    },

    verifyOTP: async (req, res) => {
        const { id, token, otpJoin } = req.body;
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
    
            if (decoded.otp === otpJoin && Date.now() < decoded.exp * 1000) {
                res.status(200).json({ message: 'OTP verified successfully!' });
                await Auth.userVerified(id);
            } else {
                res.status(400).json({ message: 'Invalid or expired OTP' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error verifying OTP', error: error.message });
        }
    },

    resendOTP: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await authController.sendOTP(email);

            if (result.success) {
                res.status(200).json({ message: 'OTP resent successfully', token: result.token });
            } else {
                res.status(500).json({ message: 'Error resending OTP', error: result.error });
            }
        } catch (error) {
            console.error('Error resending OTP:', error);
            res.status(500).json({ message: 'Error resending OTP', error: error.message });
        }
    },

    signGoogle: async (req, res) => {
        try {
            const googleToken = req.body.token_google; // Pastikan token dari frontend diterima
            if (!googleToken) {
                return res.status(400).send("Google token is missing");
            }
    
            const googleUser = await authController.verifyGoogleToken(googleToken); 
            console.log("Google user data:", googleUser); // Tambahkan log untuk cek data Google user
            
            let user = await Auth.getUserIdGoogle(googleUser.sub);
    
            // Jika user tidak ditemukan, buat akun baru dari Google data
            if (user.rows.length === 0) {
                const pictureUrl = googleUser.picture;
                const pictureResponse = await axios.get(pictureUrl, { responseType: 'arraybuffer' }); // Ambil data gambar
                const pictureBuffer = Buffer.from(pictureResponse.data, 'binary');

                await Auth.createGoogleAuth(googleUser.name, googleUser.email, googleUser.sub, pictureBuffer);
                user = await Auth.getUserIdGoogle(googleUser.sub);
            }
    
            // Buat JWT token
            const jwtToken = jwt.sign(
                { id_user: user.rows[0].id_user, username: user.rows[0].username },
                SECRET_KEY,
                { expiresIn: "1h" }
            );
    
            // Return token dan data user
            res.json({
                token: jwtToken, 
                id_user: user.rows[0].id_user, 
                username: user.rows[0].username, 
                role: user.rows[0].role_id, 
                picture: user.rows[0].picture.toString('base64')
            });
    
        } catch (error) {
            console.error("Error during Google login:", error);
            res.status(500).send(`Server error during Google login: ${error.message}`);
        }
    },
    
    verifyGoogleToken: async (token) => {
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID, // Pastikan CLIENT_ID sesuai dengan di Google Developer Console
            });
            return ticket.getPayload(); // Return payload setelah verifikasi sukses
        } catch (error) {
            console.error("Error verifying Google token:", error); // Tambahkan log untuk error verifikasi
            throw new Error("Invalid Google token");
        }
    }, 

    forgetPassword: async (req, res) => {
        const { email } = req.body;
        console.log(email);
    
        try {
            // Ensure to await the checkEmail function
            const checkEmail = await Auth.checkEmail(email);
            if (!checkEmail) {
                return res.status(406).json({ message: 'Email Not Registered' });
            }
    
            const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '5m' });

            const accessToken = await oAuth2Client.getAccessToken();
    
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.EMAIL_USER,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken.token,
                },
                tls: {
                    rejectUnauthorized: false,
                }
            });
    
            const mailOptions = {
                from: 'CINELUX <naia.siti.tif422@polban.ac.id>',
                to: email,
                subject: 'Reset Your Password',
                text: 'You requested a password reset', 
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/resetPassword?token=${token}">link</a> to reset your password</p>
                `,
            };
    
            const info = await transporter.sendMail(mailOptions);
            console.log('Email sent:', info.response);
            return res.status(200).json({ success: true, message: 'Email sent successfully', token });
        } catch (error) {
            console.error('Error Requesting Forget Password:', error);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    updateStatus: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        try {
            await Auth.updateStatus(id, status);
            res.status(200).json({ message: 'Status di Edit' });
        } catch (err) {
            console.error('Error Update Status:', err.message);
            res.status(500).json({ message: 'Server error' });
        }
    },

    resetPassword: async (req, res) => {
        const { token, newPassword } = req.body;
    
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            const { email } = decoded;
    
            const hashedPassword = await bcrypt.hash(newPassword, 10);
    
            const result = await Auth.changePassword(email, hashedPassword);
    
            if (result) {
                return res.status(404).send({ message: 'User not found' });
            }
    
            res.status(200).send({ message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error during password reset:', error);
            if (error.name === 'TokenExpiredError') {
                return res.status(400).send({ message: 'Token has expired' });
            }
            res.status(500).send({ message: 'Failed to reset password', error: error.message });
        }
    }
};

module.exports = authController;
