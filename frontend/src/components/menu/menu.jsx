import React, { useState } from 'react';
import '../../styles.js';


const Menu = () => {
 

  return (
    <>
      <div className="container-menu">
        <img src="/images-post/MENU.svg" alt="Interface"/>
            <div className="inside-menu">
                <div className="wrapper-p">
                    <p>StarPunk</p>
                    <p>Nos Artistes</p>
                    <p>Poster Online</p>
                    <p>Actus</p>
                    <p>Contacts</p>
                    <p>Boutique</p>
                    <p>En savoir plus</p>
                    <p>Mentions Légales</p>
                </div>
                <div className="wrapper-icon">
                    <div className="reseaux">

                        <a href="#"><img src="/images-post/x.svg" alt="X" className="img-reseaux" /></a>
                        <a href="#"><img src="/images-post/tiktok.svg" alt="tiktok" className="img-reseaux" /></a>
                        <a href="#"><img src="/images-post/instagram.svg" alt="instagram" className="img-reseaux" /></a>
                        <a href="#"><img src="/images-post/youtube.svg" alt="youtube" className="img-reseaux" /></a>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Menu;
