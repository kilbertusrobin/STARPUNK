import React, { useState } from 'react';
import '../styles.js';
import { Color } from 'three';
import { Link } from 'react-router-dom';

const Header = () => {
  // Ajout de l'état pour gérer l'ouverture/fermeture du menu
  const [isOpen, setIsOpen] = useState(false);

  // Ajout de la fonction pour basculer l'état du menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="container-header">
        <img src="/images-post/haut.svg" alt="" />
        <div className="inside-header">
          <div className="wrapper">
            <Link to="/artistes">
              <h3>Nos artistes</h3>
            </Link>
            <h3>Poster online</h3>
            <h3>Actus</h3>
          </div>
          <div className="logo">
            <img src="/images-post/TITRE.svg" alt="" />
          </div>
          <div className="wrapper2">
            <h3>Contacts</h3>
            <h3>En savoir plus</h3>
            <Link to="/mentions-legales">
              <h3>Mentions légales</h3>
            </Link>
          </div>
        </div>
      </div>
      <div className="container-burger" onClick={toggleMenu}>
        <img src="/images-post/mobile-burger.svg" alt="" />
      </div>
      <div className="burger-menu" style={{ top: isOpen ? '0vh' : '-100vh' }}>
      <div className="container-burger-inside">
        <img src="/images-post/mobile-burger.svg" alt="" />
      </div>
      <div className="close-burger" onClick={toggleMenu}>
        <img src="/images-post/close-burger.svg" alt="" />
      </div>
        <div className="wrapper">
          <Link to="/planetes">
            <h3>Nos Planetes</h3>
          </Link>
          <Link to="/artistes">
            <h3>Nos artistes</h3>
          </Link>
          <Link to="/poster">
            <h3>Poster Online</h3>
          </Link>
          <Link to="/actus">
            <h3>Nos actus</h3>
          </Link>
          <Link to="/contact">
            <h3>Nous contacter</h3>
          </Link>
          <Link to="/en-savoir-plus">
            <h3>En savoir plus</h3>
          </Link>
          <Link to="/mentions-legales">
            <h3>Mentions Légales</h3>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Header;