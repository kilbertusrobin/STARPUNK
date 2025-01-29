import React, { useState, useEffect } from 'react';
import { client } from './../prismic/prismicClient';
import '../styles/newsticker.css';

const NewsTicker = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  return (
    <div className="news-ticker">
      <div className="news-ticker-wrapper">
        <div className="news-ticker-container">
          {/* N'ajoute la classe d'animation que s'il y a plus d'un item */}
          <div className={`news-ticker-content ${newsItems.length > 1 && isAnimating ? 'slide-out' : ''}`}>
            <span className="label">ALERTE INFO</span>
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