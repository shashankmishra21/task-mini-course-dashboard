import React, { useState } from 'react';
import API from '../api';

const Register = ({ onSwitch }: { onSwitch: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    
    try {
      await API.post('/auth/register', { email, password });
      alert('Registration successful! Please login.');
      onSwitch();
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p onClick={onSwitch} style={{ cursor: 'pointer', color: 'blue' }}>Already have account? Login</p>
    </div>
  );
};

export default Register;
