import React, { useState, useEffect } from 'react';
import { client } from './../prismic/prismicClient';
import '../styles/newsticker.css';

const NewsTicker = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); 

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await client.getSingle('actusbaspage');
        console.log('Réponse Prismic complète:', response);

        if (response.data?.allactus) {
          const items = response.data.allactus
            .map(item => ({
              text: item.texte_actus?.[0]?.text,
              imageUrl: item.image_actu?.url || null
            }))
            .filter(item => item.text); // Garde uniquement les items avec du texte

          console.log('Articles et images extraits:', items);
          setNewsItems(items);
        } else {
          console.error('Structure de données invalide:', response.data);
          setNewsItems([]);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des actualités:', error);
        setNewsItems([]);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    // Ne pas démarrer l'intervalle s'il n'y a pas d'items ou s'il n'y en a qu'un seul
    if (newsItems.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsItems.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [newsItems.length]);

  // Ne rien rendre s'il n'y a pas d'items
  if (newsItems.length === 0) return null;

  const currentItem = newsItems[currentIndex];

  // Fonction pour formater "ALERTE INFO" avec un br après 6 caractères
  const formatLabel = (text) => {
    if (!text) return '';
    
    const result = [];
    for (let i = 0; i < text.length; i += 6) {
      const chunk = text.slice(i, i + 6);
      result.push(
        <React.Fragment key={i}>
          {chunk}
          {i + 6 < text.length && <br />}
        </React.Fragment>
      );
    }
    
    return result;
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div className={`news-ticker ${isDrawerOpen ? 'open' : 'closed'}`}>
      {/* Flèche élégante pour ouvrir/fermer le tiroir */}
      <div className="toggle-arrow" onClick={toggleDrawer}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d={isDrawerOpen ? "M7 14l5-5 5 5" : "M7 10l5 5 5-5"} 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      {/* Contenu du news ticker */}
      <div className="news-ticker-wrapper">
        <div className="news-ticker-container">
          <div className={`news-ticker-content ${newsItems.length > 1 && isAnimating ? 'slide-out' : ''}`}>
            <span className="label">{formatLabel("ALERTE INFO")}</span>
            <span className="text">{currentItem.text}</span>
          </div>
        </div>
        
        <div className="ticker-image-right">
          {currentItem.imageUrl ? (
            <img 
              src={currentItem.imageUrl} 
              alt="Image actualité" 
              onError={(e) => {
                e.target.src = '/images-post/test-image.jpg';
                console.error('Erreur de chargement de l\'image:', currentItem.imageUrl);
              }}
            />
          ) : (
            <img src="/images-post/test-image.jpg" alt="Image par défaut" />
          )}
        </div>
      </div>
      <div className="test111"></div>
    </div>
  );
};

export default NewsTicker;