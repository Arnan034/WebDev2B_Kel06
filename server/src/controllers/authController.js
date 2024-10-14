// src/controllers/authController.js
const Auth = require('../models/authModel'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

// Ambil client ID dari environment variable
const SECRET_KEY = process.env.SECRET_KEY;
const CLIENT_ID = process.env.CLIENT_ID;

// Inisialisasi Google OAuth2Client di luar authController
const client = new OAuth2Client(CLIENT_ID);

const authController = {
    signin: async (req, res) => {
        const { username, password } = req.body;
    
        try {
            const user = await Auth.getUserByUsernameOrEmail(username);
    
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
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

    signup: async (req, res) => {
        const { username, email, password, picture } = req.body;
    
        try {
            if (!picture || !picture.includes('base64')) {
                return res.status(400).json({ error: 'Invalid image format. Please provide a valid base64 image.' });
            }
            
            const pictureBuffer = Buffer.from(picture.split(',')[1], 'base64');
    
            const hashedPassword = await bcrypt.hash(password, 10);

            await Auth.createUser(username, email, hashedPassword, pictureBuffer);
            
            res.status(200).json({ message: 'Sign up successfully' });
        } catch (error) {
            console.error('Error during signup:', error.message);
            res.status(500).json({ error: 'Server Error' });
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
            // Verifikasi token dengan Google OAuth2Client
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID, // Pastikan CLIENT_ID sesuai dengan di Google Developer Console
            });
            return ticket.getPayload(); // Return payload setelah verifikasi sukses
        } catch (error) {
            console.error("Error verifying Google token:", error); // Tambahkan log untuk error verifikasi
            throw new Error("Invalid Google token");
        }
    }    
};

module.exports = authController;
