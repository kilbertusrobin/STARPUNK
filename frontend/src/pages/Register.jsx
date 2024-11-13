import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Importation du hook useNavigate
import '../styles.js';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const navigate = useNavigate();  // Initialisation du hook useNavigate

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
        
        // Redirection vers la page de login après succès
        navigate('/login');
      } else {
        console.error('Erreur lors de la création de l\'utilisateur', response);
      }
    } catch (error) {
      console.error('Erreur réseau', error);
    }
  };

  return (
    <div>
      <p>Register</p>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
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
          placeholder="Confirmation du mot de passe"
          name="psw"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
