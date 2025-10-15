import React, { useState } from 'react';
import API from '../api';

const Login = ({ onLogin, onSwitch }: { onLogin: () => void; onSwitch: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      onLogin();
    } catch {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p onClick={onSwitch} style={{ cursor: 'pointer', color: 'blue' }}>Need account? Register</p>
    </div>
  );
};

export default Login;
