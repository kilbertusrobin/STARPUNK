import ThreeScene from '../components/ThreeScene';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.js';
import Starpunk from '../components/cards/starpunk.jsx';
import Menu from '../components/menu/menu.jsx';
import Haut from '../pages/Haut.jsx';
import NewsTicker from '../components/NewsTicker.jsx';
import PopupAlert from '../components/popups/PopupAlert.jsx';



function Planet() {

    return ( 
        <>
        <Haut />
        {/* <Menu /> */}
        <ThreeScene />
        <NewsTicker />
        {/* <PopupAlert
  title="Votre titre"
  text="Votre texte"
  onClose={() => setIsOpen(false)}
/> */}
        </>
    );
    }

export default Planet;