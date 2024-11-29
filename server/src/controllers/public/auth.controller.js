// src/controllers/authController.js
const Auth = require('../../models/auth.model');
const axios = require('axios');
const { OAuth2Client } = require('google-auth-library');

//utils
const { sendEmail } = require('../../utils/performance/mailer.utils');
const ApiResponse = require('../../utils/maintainability/response.utils');
const {authLogger, logger} = require('../../utils/maintainability/logger.utils');
const { generateToken, verifyToken } = require('../../utils/security/jwt.utils');
const { hashPassword, comparePassword } = require('../../utils/security/password.utils');
const { convertBase64ToBuffer, convertBufferToBase64 } = require('../../utils/security/image.utils');

class AuthController {
    static async #sendOTP (email, type, token = null) {
        try {
            if (type === 'otp'){
                const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
                const token = generateToken({ otp: otp }, '5m');

                const info = await sendEmail(email, type, { otp: otp });

                return { success: true, token, message: 'OTP has been sent successfully', response: info.response };
            } else if (type === 'forget-password') {
                const info = await sendEmail(email, type, { token: token });
                
                return { success: true, message: 'Email sent successfully', response: info.response };    
            }
        } catch (error) {
            authLogger.error('Error sending email:', {
                email: email,
                type: type,
                error: error.message
            });
            return { success: false, error: error.message };
        }
    }

    static async signin (req, res, next) {
        const start = Date.now();
        const { username, password } = req.body;
        try {
            const user = await Auth.getUserByUsernameOrEmail(username);
    
            if (!user) {
                authLogger.error('User not found', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'User not found', 404);
            }

            if (!user.status){
                authLogger.error('User has been blacklisted', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'User has been blacklisted', 403);
            }
    
            const isPasswordMatch = await comparePassword(password, user.password);

            if (!isPasswordMatch) {
                authLogger.error('Invalid Password', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'Invalid Password', 400);
            }

            const token = generateToken({id: user.id_user, username: user.username, role: user.role}, '3h');
            const isEmail = username.includes('@');
            authLogger.info('Success sign-in', {
                [isEmail ? 'email' : 'username']: username,
                duration: Date.now() - start
            });

            return ApiResponse.success(res, { token: token, id_user: user.id_user, username: user.username, role: user.role, picture: convertBufferToBase64(user.picture)}, 'Sign-in successful', 200);
        } catch (error) {
            authLogger.error('Error during sign-in:', {
                username: username,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async logout (req, res) {
        const start = Date.now();
        const { username } = req.user;
        const isEmail = username.includes('@');
        authLogger.info('Success logout', {
            [isEmail ? 'email' : 'username']: username,
            duration: Date.now() - start
        });
        return ApiResponse.success(res, null, 'Logout successful', 200);
    }

    static async signup (req, res, next) {
        const start = Date.now();
        const { username, email, password, picture } = req.body;
        try {
            const checkUsername = await Auth.checkUsername(username);

            if (checkUsername){
                logger.error('Username already registered', {
                    duration: Date.now() - start
                });
                return ApiResponse.error(res, 'Username already registered', 422);
            }

            const checkEmail = await Auth.checkEmail(email);
            if (checkEmail){
                if (!checkEmail.is_verified){
                    await Auth.deleteUnverifiedUser(email);
                } else {
                    logger.error('Email already registered', {
                        duration: Date.now() - start
                    });
                    return ApiResponse.error(res, 'Email already registered', 422);
                }
            }

            const pictureBuffer = convertBase64ToBuffer(picture);
            const hashedPassword = await hashPassword(password);
            const result = await AuthController.#sendOTP(email, 'otp');

            if (!result.success) {
                logger.error('Error sending OTP', {
                    duration: Date.now() - start
                });
                return ApiResponse.serverError(res, `Error sending OTP`, 500);
            }

            const user = await Auth.createUser(username, email, hashedPassword, pictureBuffer);

            logger.info('Success sign-up OTP', {
                username: username,
                email: email,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, {token: result.token, idVerified: user.id_user }, 'OTP sent successfully', 200);
        } catch (error) {
            logger.error('Error sign-up OTP:', {
                username: username,
                email: email,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async verifyOTP (req, res, next) {
        const start = Date.now();
        const { id, token, otpJoin } = req.body;
        try {
            let decoded;
            try {
                decoded = verifyToken(token);
            } catch (err) {
                if (err.name === 'TokenExpiredError') {
                    return ApiResponse.error(res, 'OTP has expired. Please request a new one.', 401)
                }
                return ApiResponse.error(res, 'Invalid token. Please request a new OTP.', 401)
            }

            if (!(decoded.otp === otpJoin)) {
                return ApiResponse.error(res, 'Invalid OTP code. Please try again.', 400);
            }

            await Auth.userVerified(id);
            logger.info('Success verify OTP', {
                id: id,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'OTP verified successfully!', 200);
        } catch (error) {
            logger.error('Error verifying OTP:', {
                id: id,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async resendOTP (req, res, next) {
        const start = Date.now();
        const { email } = req.body;
        try {
            const result = await AuthController.#sendOTP(email, 'otp');

            if (!result.success) {
                return ApiResponse.serverError(res, `Error sending OTP`, 500);
            }

            logger.info('Success resend OTP', {
                email: email,
                duration: Date.now() - start
            });

            return ApiResponse.success(res, {token: result.token}, 'OTP resent successfully', 200);
        } catch (error) {
            logger.error('Error resending OTP:', {
                email: email,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async signGoogle (req, res, next) {
        const start = Date.now();
        const googleToken = req.body.token_google;
        try {
            if (!googleToken) {
                return ApiResponse.error(res, 'Google token is missing', 400);
            }
    
            const googleUser = await AuthController.verifyGoogleToken(googleToken); 

            if (!googleUser.success) {
                return ApiResponse.error(res, 'Invalid Google token', 400);
            }
            
            let user = await Auth.getUserIdGoogle(googleUser.sub);
    
            if (user.length === 0) {
                const pictureUrl = googleUser.picture;
                const pictureResponse = await axios.get(pictureUrl, { responseType: 'arraybuffer' });
                const pictureBuffer = Buffer.from(pictureResponse.data, 'binary');
                console.log(googleUser.name, googleUser.email, googleUser.sub, pictureBuffer);
                await Auth.createGoogleAuth(googleUser.name, googleUser.email, googleUser.sub, pictureBuffer);
                user = await Auth.getUserIdGoogle(googleUser.sub);
            }
            const token = generateToken({ id_user: user.id_user, username: user.username }, '1h' );
    
            logger.info('Success sign-in Google', {
                username: user.username,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, {
                token: token, 
                id_user: user.id_user, 
                username: user.username, 
                role: user.role, 
                picture: convertBufferToBase64(user.picture)
            }, 'Google login successful', 200);
    
        } catch (error) {
            logger.error("Error during sign-in Google:", {
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
    
    static async verifyGoogleToken (token) {
        try {
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            return ticket.getPayload();
        } catch (error) {
            logger.error("Error verifying Google token:", {
                error: error.message,
            });
            return { success: false, error: error.message };
        }
    }

    static async forgetPassword (req, res, next) {
        const start = Date.now();
        const { email } = req.body;
        try {
            const checkEmail = await Auth.checkEmail(email);
            if (!checkEmail) {
                return ApiResponse.error(res, 'Email Not Registered', 404);
            }
            
            const token = generateToken({ email: email }, '5m');

            const result = await AuthController.#sendOTP(email, 'forget-password', token);
            
            if (!result.success) {
                return ApiResponse.serverError(res, `Error sending email`, 500);
            }

            logger.info('Success request forget password', {
                email: email,
                duration: Date.now() - start
            });

            return ApiResponse.success(res, token , 'Email sent successfully', 200);
        } catch (error) {
            logger.error('Error Requesting Forget Password:', {
                email: email,
                error: error.message,
                duration: Date.now() - start
            });
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }

    static async resetPassword (req, res, next) {
        const start = Date.now();
        const { token, newPassword } = req.body;
        const decoded = verifyToken(token);
        const { email } = decoded;
        try {
    
            const hashedPassword = await hashPassword(newPassword);
    
            const result = await Auth.changePassword(email, hashedPassword);
    
            if (result) {
                return ApiResponse.error(res, 'User not found', 404);
            }
    
            logger.info('Success reset password', {
                email: email,
                duration: Date.now() - start
            });
            return ApiResponse.success(res, null, 'Password updated successfully', 201);
        } catch (error) {
            logger.error('Error during password reset:', {
                email: email,
                error: error.message,
                duration: Date.now() - start
            });
            if (error.name === 'TokenExpiredError') {
                return ApiResponse.error(res, 'Token has expired', 400);
            }
            return ApiResponse.serverError(res, 'Server error', error);
        }
    }
};

module.exports = AuthController;
