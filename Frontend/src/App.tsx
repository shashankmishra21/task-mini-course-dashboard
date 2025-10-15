import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      {isLoggedIn ? (
        <Dashboard />
      ) : showRegister ? (
        <Register onSwitch={() => setShowRegister(false)} />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} onSwitch={() => setShowRegister(true)} />
      )}
    </div>
  );
}

export default App;
