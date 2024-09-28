import React from "react";
import { Link } from 'react-router-dom';

class Sign extends React.Component { 
    render() {
        return (
            <div className="login-content bg-selective-yellow-color">
                <div className="card-sign shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                    <div className="card-body-sign">
                        <h2 className="card-title-sign text-center mb-4">Registrasi</h2>
                        <form>
                            <div className="mb-2">
                                <label htmlFor="username" className="form-label">Username</label>
                                <input type="text" className="form-control" id="username" placeholder="Enter your username or email" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Enter your email" required />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <input type="password" className="form-control" id="password" placeholder="Enter your password" required />
                                </div>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                                <div className="input-group">
                                    <input type="password" className="form-control" id="confirm-password" placeholder="Confirm Your Password" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="photo-profile" className="form-label">Photo-Profile</label>
                                <div className="input-group">
                                    <input 
                                        type="file" 
                                        className="form-control" 
                                        id="picture" 
                                        name="picture" 
                                        accept="image/*" 
                                        required 
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Registrasi</button>
                        </form>
                        
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <Link to="#" className="text-decoration-none">Lupa Password?</Link>
                            <Link to="/signin" className="text-decoration-none">Sudah Punya Akun?</Link>
                        </div>
                        
                        <hr className="my-2" />

                        <div className="d-grid">
                            <button type="button" className="btn btn-outline-danger">
                                <i className="bi bi-google me-2"></i> Registrasi menggunakan Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sign;
