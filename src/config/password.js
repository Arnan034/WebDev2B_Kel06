// src/config/passport.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},

async (accessToken, refreshToken, profile, done) => {
    try {
        // Cari pengguna di database berdasarkan email
        let user = await UserModel.findByEmail(profile.emails[0].value);
        if (!user) {
            // Jika tidak ada, buat pengguna baru
            user = await UserModel.createUser({
                username: profile.displayName,
                email: profile.emails[0].value,
                password: null, // Tidak diperlukan untuk Google
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.getUserById(id);
    done(null, user);
});
