// src/Connect.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.js'; // Assurez-vous que ce fichier existe et contient vos styles

function Connect() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici votre logique de validation ou d'authentification
    navigate('/'); // Navigue vers la page d'accueil après la soumission du formulaire
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Connect;