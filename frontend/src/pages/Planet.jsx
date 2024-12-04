// src/Planet.jsx

import ThreeScene from '../components/ThreeScene';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.js';
import Starpunk from '../components/cards/starpunk.jsx';
import Menu from '../components/menu/menu.jsx';

function Planet() {
    
    return ( 
        <>
        <Menu />
        <ThreeScene />
        </>
    );
    }

export default Planet;
