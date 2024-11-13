import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 4) {
            setError("Password must be at least 4 characters.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/auth/reset-password`, { token: token, newPassword: password });
            setMessage(response.data.message);
            setError('');
            setTimeout(2000);
            navigate('/signin')
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-content bg-selective-yellow-color">
            <div className="card-sign shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body-sign">
                    <h2 className="card-title-sign text-center mb-4">Reset Password</h2>
                    <form onSubmit={handleSubmit}>
                    <label htmlFor="password" className="form-label">New Password</label>
                        <div className="input-group mb-3">
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
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                id="confirmPassword" 
                                placeholder="Confirm new password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required 
                            />
                        </div>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-50 bg-orange-peel" disabled={loading}>
                                {loading ? 'Loading ...' : 'Reset'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;