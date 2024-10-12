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
    
                return res.json({ token, id_user: user.id_user, role: user.role });
            }
    
            res.status(401).json({ message: 'Invalid Username / Password' });
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },
};

module.exports = authController;
