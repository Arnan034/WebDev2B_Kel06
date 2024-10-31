import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Sign = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pictureFile, setPictureFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setPictureFile(reader.result); // Set data URL
        };

        if (file) {
            reader.readAsDataURL(file); // Read file as Data URL
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
    
        setLoading(true);
        setError("");
    
        const formData = {
            username,
            email,
            password,
            picture: pictureFile,
        };
    
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', formData, {
                headers: {
                    'Content-Type': 'application/json', // Mengirim sebagai JSON
                },
            });
            console.log(response.data);
            navigate('/signin'); // Redirect setelah pendaftaran berhasil
        } catch (error) {
            // Menangani error dengan lebih detail
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error); // Menampilkan pesan error dari server
            } else {
                setError('Registration failed. Please try again.'); // Pesan umum
            }
            console.error('Error during registration:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-content bg-selective-yellow-color">
            <div className="card-sign shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body-sign">
                    <h2 className="card-title-sign text-center mb-4">Registrasi</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input 
                            type="text" 
                            className="form-control" 
                            id="username" 
                            placeholder="Enter your username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            id="confirm-password" 
                            placeholder="Confirm Your Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="photo-profile" className="form-label">Photo-Profile</label>
                            <input 
                            type="file" 
                            className="form-control" 
                            id="picture" 
                            name="picture" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? 'Loading...' : 'Registrasi'}
                        </button>
                    </form>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <Link to="#" className="text-decoration-none">Lupa Password?</Link>
                        <Link to="/signin" className="text-decoration-none">Sudah Punya Akun?</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sign;
