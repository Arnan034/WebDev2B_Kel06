import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { apiServicePublic } from '../../services/api';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const Signin = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 4) {
            setError("Password must be at least 4 characters.");
            return;
        }
        setLoading(true);

        try {
            const response = await apiServicePublic.signIn({
                username: username,
                password: password
            });

            if (response.data.data.token && response.data.data.id_user) {   
                sessionStorage.setItem('token', response.data.data.token);
                sessionStorage.setItem('id_user', response.data.data.id_user);
                sessionStorage.setItem('role', response.data.data.role);
                sessionStorage.setItem('user', response.data.data.username);
                sessionStorage.setItem('picture', response.data.data.picture);
                setMessage(response.data.message);
                setError('');
                setTimeout(() => {
                    navigate('/');
                    handleLogin();
                }, 1000);
            } else {
                setError(response.data.message);
                setMessage('');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'An error occurred';
            setError(errorMessage);
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            const token_google = credentialResponse.credential;
            const response = await apiServicePublic.signGoogle({ token_google: token_google });
            
            sessionStorage.setItem('token', response.data.data.token);
            sessionStorage.setItem('id_user', response.data.data.id_user);
            sessionStorage.setItem('role', response.data.data.role);
            sessionStorage.setItem('user', response.data.data.username);
            sessionStorage.setItem('picture', response.data.data.picture);
            setMessage(response.data.message);
            setError('');
            setTimeout(() => {
                navigate('/');
                handleLogin();
            }, 1000);
        } catch (error) {
            setError(`Google login failed: ${error.response?.data?.message || error.message}`);
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLoginError = () => {
        setError("Google login failed. Please try again.");
        setMessage('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-content bg-selective-yellow-color">
            <div className="card-sign shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body-sign">
                    <h2 className="card-title-sign text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="username" 
                                placeholder="Enter your username or email" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="form-control" 
                                    id="password" 
                                    placeholder="Enter your password"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary btn-faeye"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-50 bg-orange-peel" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <a href="/forgotPass" className="text-orange-peel text-decoration-none">Lupa Password?</a>
                        <Link to="/signup" className="text-orange-peel text-decoration-none">Buat Akun?</Link>
                    </div>
                    
                    <hr className="my-4" />

                    <div className="d-flex justify-content-center">
                    <GoogleOAuthProvider clientId={ClientId}>
                        <GoogleLogin
                            onSuccess={handleGoogleLoginSuccess}
                            onError={handleGoogleLoginError}
                            buttonText="Login with Google"
                            className="google-login-button"
                        />
                    </GoogleOAuthProvider>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;
