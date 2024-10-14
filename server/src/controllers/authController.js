// src/controllers/authController.js
const Auth = require('../models/authModel'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

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
            const googleToken = req.body.token; // Ubah nama variabel agar tidak ada konflik
        
            const googleUser = await verifyGoogleToken(googleToken);
        
            let user = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleUser.sub]);
        
            if (user.rows.length === 0) {
              await pool.query(
                "INSERT INTO users (username, email, google_id, role_id) VALUES ($1, $2, $3, 'Writer')",
                [googleUser.name, googleUser.email, googleUser.sub]
              );
        
              user = await pool.query("SELECT * FROM users WHERE google_id = $1", [googleUser.sub]);
            }
        
            const jwtToken = jwt.sign(
              { username: user.rows[0].username, role: user.rows[0].role_id },
              "your_jwt_secret",
              { expiresIn: "1h" }
            );
        
            res.json({ token: jwtToken, role: user.rows[0].role_id });
          } catch (error) {
            console.error("Error during Google login:", error);
            res.status(500).send("Server error during Google login");
        }
    }

    // Fungsi untuk verifikasi token Google
// async function verifyGoogleToken(token) {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: "193966095713-ooq3r03aaanmf67tudroa67ccctfqvk6.apps.googleusercontent.com", // Ganti dengan client ID milikmu
//     });
//     return ticket.getPayload(); // Payload akan berisi informasi pengguna
//   }
};

module.exports = authController;
