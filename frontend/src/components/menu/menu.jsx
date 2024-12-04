import React, { useState } from 'react';
import '../../styles.js';


const Menu = () => {
 

  return (
    <>
      <div className="container-menu">
        <img src="/images-post/MENU.svg" alt="Interface"/>
            <div className="inside-menu">
            <div className="wrapper-p">
            <div className="title-connect-div">
          <img src="./images-post/TITRE.svg" className='title-connect' alt="" />
          </div>
          <a href="#nos-artistes"><p>Nos Artistes</p></a>
            <a href="#poster-online"><p>Poster Online</p></a>
            <a href="#actus"><p>Actus</p></a>
            <a href="#contacts"><p>Contacts</p></a>
            {/* <a href="#boutique"><p>Boutique</p></a> */}
            <a href="#en-savoir-plus"><p>En savoir plus</p></a>
            <a href="#mentions-legales"><p>Mentions Légales</p></a>
          </div>
            </div>
        </div>
    </>
  );
};

export default Menu;
