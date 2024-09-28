import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Dummy login check (bisa diganti dengan validasi dari backend)
    if (username === 'admin' && password === 'password') {
      onLogin(); // Panggil fungsi dari App.js untuk update login status
      navigate('/cms'); // Arahkan ke halaman CMS
    } else {
      setError('Username atau password salah');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Signin;
