import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles.js';

function Connect() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setEmail('');
    setPassword('');
    setUsername('');
    setConfirmPassword('');
  }, [isLogin]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      console.log('Réponse:', response.data);
      const { access_token, refresh_token } = response.data;
      Cookies.set('access_token', access_token);
      Cookies.set('refresh_token', refresh_token);
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      alert('Email ou mot de passe incorrect');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);

    try {
      const response = await fetch('http://localhost:8000/api/users/create', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Utilisateur créé avec succès', data);
        window.location.reload();
      } else {
        console.error('Erreur lors de la création de l\'utilisateur', response);
      }
    } catch (error) {
      console.error('Erreur réseau', error);
    }
  };

  return (
    <div className="login-page">
      <div className='login-container'>
        <div className='choice'>
          <button 
            className={`button-choice ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Se connecter
          </button>
          <div className='separator'></div>
          <button 
            className={`button-choice ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            S'inscrire
          </button>
        </div>

        {isLogin && (
          <form className='login-form' onSubmit={handleSubmit}>
            <input 
              type='email'
              placeholder='Email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input 
              type='password'
              placeholder='Mot de passe'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <input type='submit'
              value='Se connecter'
            />
            <a href='#' className='forgot'>Mot de passe oublié ?</a>
          </form>
        )} 
        {!isLogin && (
          <form className='register-form' onSubmit={handleRegister}>
            <input
              type="text"
              id="username"
              placeholder="Entrez votre username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              id="email"
              placeholder="Entrez votre email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              id="password"
              placeholder="Entrez votre mot de passe"
              name="psw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirmez mot de passe"
              name="psw"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <input type='submit'
              value="S'inscrire"
            />
          </form>
        )}
      </div>
      <div className="login-illu">
        <h1 className='titre'>Prêt(e) pour le grand départ ?</h1>
        <img src='./public/images-post/Satellite.png' className='satellite-img' alt='Satellite' />
      </div>
    </div>
  );
}

export default Connect;
