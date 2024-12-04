// src/Connect.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles.js';

function Connect() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login_check', {
        email,
        password,
      });

      const { token } = response.data;

      Cookies.set('token', token, { expires: 1 });

      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="login-container">
      <img src="./images-post/interface169.svg" alt="" className="interface169" />
      
          <form onSubmit={handleSubmit}>
          <div className="title-connect-div">
          <img src="./images-post/TITRE.svg" className='title-connect' alt="" />
          </div>
        <div className="form-group">
          <label className="form-content-h3" htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-content-h3" htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-connect">
        <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Connect;
