import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sign = ({handleLogin}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Gunakan useNavigate untuk redirect
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username,
                password
            });
    
            if (response.data.token && response.data.id_user) {
                // Simpan token dan id_user di localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('id_user', response.data.id_user);
    
                // Redirect ke halaman lain setelah login berhasil
                navigate('/cms'); // Redirect ke halaman CMS
                handleLogin()
            } else {
                setError('Login failed, please check your credentials.');
            }
        } catch (err) {
            setError('Login failed, please check your credentials.');
            console.error(err);
        }
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
                                    type="password" 
                                    className="form-control" 
                                    id="password" 
                                    placeholder="Enter your password"
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit" className="bg-orange-peel btn btn-light w-100">Login</button>
                    </form>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <a href="/" className="text-orange-peel text-decoration-none">Lupa Password?</a>
                        <Link to="/register" className="text-orange-peel text-decoration-none">Buat Akun?</Link>
                    </div>
                    
                    <hr className="my-4" />

                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-light">
                            <i className="bi bi-google me-2"></i> Login dengan Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sign;
