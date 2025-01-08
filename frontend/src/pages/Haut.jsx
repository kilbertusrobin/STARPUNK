import React, { useState } from 'react';
import '../styles.js';
import { Color } from 'three';
// import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <>
    <div className="container-header">
      <img src="/images-post/haut.svg" alt="" />
      <div className="inside-header">
        <div className="wrapper"> 
          <h3>Nos artistes</h3>
          <h3>Poster online</h3>
          <h3>Actus</h3>
        </div>
          <div className="logo">
            <img src="/images-post/TITRE.svg" alt="" />
          </div>
          <div className="wrapper2">
            <h3>Contacts</h3>
            <h3>En savoir plus</h3>
            <h3>Mentions légales</h3>
          </div>
       </div>
      </div>
    </>
  );
};

export default Header;