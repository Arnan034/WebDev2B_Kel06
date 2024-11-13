import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pictureFile, setPictureFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onloadend = () => {
            
            const img = new Image();
            img.src = reader.result;
    
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);

                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
    
                const xOffset = (img.width - size) / 2;
                const yOffset = (img.height - size) / 2;
    
                ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size);
    
                const resizedDataUrl = canvas.toDataURL();
                setPictureFile(resizedDataUrl);
            };
        };
    
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username.length < 4 || username.length > 25) {
            setMessage("Username must be at least 4 characters and password must be less than 25 characters.");
            return;
        }

        if (password.length < 4) {
            setMessage("Password must be at least 4 characters.");
            return;
        }
        
        const DEFAULT_IMAGE_URL = "https://tse2.mm.bing.net/th?id=OIP.1yoSL-WO0YU5mQKROudvswHaHa&pid=Api&P=0&h=180";

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);
        setMessage("");
    
        let finalPictureFile = pictureFile;

        if (!finalPictureFile) {
            finalPictureFile = await convertImageToDataUrl(DEFAULT_IMAGE_URL);
        }

        const formData = {
            username,
            email,
            password,
            picture: finalPictureFile ,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signupOTP', formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.data.token) {
                sessionStorage.setItem('otpToken', response.data.token);
                sessionStorage.setItem('idVerified', response.data.idVerified);
                sessionStorage.setItem('emailVerified', email);
                setMessage('OTP sent successfully! Please check your email.');
                setTimeout(() => {
                    navigate('/verifyOTP');
                }, 2000);
            } else {
                setMessage('Error sending OTP.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage(error.response.data.message);
            }
            console.error('Error during registration:', error);
        } finally {
            setLoading(false);
        }
    };

    const convertImageToDataUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="login-content bg-selective-yellow-color">
            <div className="card-sign shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body-sign">
                    <h2 className="card-title-sign text-center mb-4">Registrasi</h2>
                    {message === 'OTP sent successfully! Please check your email.' ? (<div className="alert alert-success">{message}</div>) : (message === '' ? (<div></div>) : (<div className="alert alert-danger">{message}</div>))}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-2">
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
                        <div className="mb-2">
                            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                            <input type="password" className="form-control" id="confirm-password" placeholder="Confirm Your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="photo-profile" className="form-label">Photo-Profile (Optional)</label>
                            <input type="file" className="form-control" id="picture" name="picture" accept="image/*" onChange={handleFileChange}/>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary w-50" disabled={loading}>
                                {loading ? 'Loading...' : 'Registrasi'}
                            </button>
                        </div>
                    </form>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Link to="/forgotPass" className="text-decoration-none">Lupa Password?</Link>
                        <Link to="/signin" className="text-decoration-none">Sudah Punya Akun?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
