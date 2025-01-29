import ThreeScene from '../components/ThreeScene';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.js';
import Starpunk from '../components/cards/starpunk.jsx';
import Menu from '../components/menu/menu.jsx';
import Haut from '../pages/Haut.jsx';
import NewsTicker from '../components/NewsTicker.jsx';



function Planet() {

    return ( 
        <>
        <Haut />
        {/* <Menu /> */}
        <ThreeScene />
        <NewsTicker />

        </>
    );
    }

export default Planet;