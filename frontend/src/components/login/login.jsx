import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export const MyLogin = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/customers');
  };

  return (
    <div className='container login'>
      <div className="header">
        <div className="text">
          <h1>Little Boutik</h1>
        </div>
      </div>
      <div className="inputs">
        <input type="text" placeholder="Username" />
        <button onClick={handleLogin}>Enter</button>
      </div>
    </div>
  );
};

export default MyLogin;