// src/OtpVerification.js
import React, { useState, useEffect } from 'react';
import { apiServicePublic } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const OtpVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // Array untuk menyimpan setiap digit OTP
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(0); // Timer untuk resend code
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Jika input terisi, pindah ke input berikutnya
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }

        // Jika input kosong, kembali ke input sebelumnya
        if (!value && index > 0) {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            document.getElementById(`otp-input-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpJoin = otp.join('');
        const token = sessionStorage.getItem('otpToken');
        const id = sessionStorage.getItem('idVerified');

        try {
            const response = await apiServicePublic.verifyOTP({ 
                id: id, 
                token: token, 
                otpJoin: otpJoin 
            });

            if (response.status === 200) {
                setMessage(response.data.message);
                setTimeout(() => {
                navigate('/signin');
                }, 2000);
            } else {
                setMessage(response.data.message);
            }
        } catch (error) {
            setMessage(error.response.data.message);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleResendCode = async () => {
        const email = sessionStorage.getItem('emailVerified');
        try {
            const response = await apiServicePublic.resendOTP({ email: email });
            if (response.data.data.token){
                sessionStorage.setItem('otpToken', response.data.data.token);
            }
            setResendTimer(60);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    // Format timer menjadi MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="login-content bg-selective-yellow-color d-flex justify-content-center align-items-center min-vh-100">
            <div className="card-sign shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <button onClick={handleBack} className="back-button-otp p-0">
                        <i className="fa fa-arrow-left"></i>
                    </button>
                    <h2 className="flex-grow-1 text-center">Verify OTP</h2>
                </div>
                <div className="otp-container">
                    <form onSubmit={handleSubmit}>
                        <div className="otp-inputs d-flex justify-content-between mb-3">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    maxLength="1"
                                    className="otp-input form-control text-center"
                                />
                            ))}
                        </div>
                        {error && <p className="text-danger">{error}</p>}
                        {message && <p className={message === 'OTP verified successfully!' ? 'text-success' : 'text-danger'}>{message}</p>}
                        <Button color='yellow' fluid type="submit">Verify</Button>
                    </form>
                    <div className="text-center mt-3">
                        {resendTimer > 0 ? (
                            <span>Resend code in {formatTime(resendTimer)}</span>
                        ) : (
                            <span onClick={handleResendCode} className="resend-link" style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                                Resend Code
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
