import React, { useState } from 'react';
import '../../styles/cards.css';

const Starpunk = () => {
  // État pour gérer l'affichage de la modale
  const [isOpen, setIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // Fonction pour ouvrir la modale et définir l'image à afficher
  const openModal = (imageSrc) => {
    setCurrentImage(imageSrc);
    setIsOpen(true);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="container-rs">
        <img src="/images-post/Interface.svg" alt="Interface" />
        <div className="inside-rs">
          {/* Wrapper de post avec une image cliquable */}
          {[...Array(3)].map((_, index) => (
            <div className="wrapper-post" key={index}>
              <img 
                src="/images-post/test2.jpg" 
                alt="Image du post" 
                onClick={() => openModal('/images-post/test2.jpg')} // Ouvre la modale sur clic
                style={{ cursor: 'pointer' }} // Curseur en main pour indiquer que c'est cliquable
              />
              <div className="wrapper-like">
                <h1 className="post-title">Image</h1>
                <div className="like-count">
                  <img src="/images-post/coeur.svg" className="like-button" alt="Bouton aimer" />
                  <p className="like-counter">370</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modale pour afficher l'image agrandie */}
      {isOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}><img class="close-orange-cross" src="/images-post/orange-cross.svg" alt="" /></span>
            <img src={currentImage} alt="Image agrandie" className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
};

export default Starpunk;
