import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEmailDisabled, setIsEmailDisabled] = useState(false); // New state to disable email input

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forget-password', { email });
            setMessage(response.data.message);
            setError('');
            setIsEmailDisabled(true); // Disable email input on success
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'Something went wrong');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-content bg-selective-yellow-color">
            <div className="card-sign shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body-sign">
                    <h2 className="card-title-sign text-center mb-4">Forgot Password</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <h5>Masukkan Email Anda untuk Reset Password!</h5>
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="email" 
                                placeholder="Enter your email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isEmailDisabled} // Disable input if email has been sent successfully
                                required 
                            />
                        </div>
                        {message && <p style={{ color: 'green' }}>{message}</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-50 bg-orange-peel" disabled={loading || isEmailDisabled}>
                                {loading ? 'Loading ...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;