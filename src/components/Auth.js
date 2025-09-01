import React, { useState } from 'react';

function Auth({ onAuth }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple password check - in production use Firebase Auth
    const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD || 'admin123';
    
    if (password === correctPassword) {
      localStorage.setItem('propertyAuth', 'true');
      onAuth(true);
    } else {
      setError('Nieprawidłowe hasło');
      setPassword('');
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        <h2>🏠 Katalog Nieruchomości</h2>
        <p>Wprowadź hasło administratora</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
          
          {error && <div className="auth-error">{error}</div>}
          
          <button type="submit" className="auth-btn">
            Zaloguj się
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;