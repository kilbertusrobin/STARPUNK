import React from 'react';
import '../../styles.js';

const PopupAlert = ({ title, text, onClose }) => {
  return (
    <>
    <div className="imgfond">
        <div className="close-popup">
            <img src="./images-post/croixpopup.svg" alt="" />
        </div>
        <div className="left-popup">
            <img src="./images-post/warning.svg" alt="" />
        </div>
        <div className="right-popup">
            <h2>Titre popup</h2>
            <p>Ceci est le texte de la popup, attention une pluie de météore est en cours sur la planete !</p>
        </div>
    </div>

    </>
  );
};

export default PopupAlert;