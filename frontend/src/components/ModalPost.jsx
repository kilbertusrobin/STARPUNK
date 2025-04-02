import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ModalPost = () => {
  const images = [
    "/images-post/mobile-burger.svg",
    "/api/placeholder/800/800",
    "/api/placeholder/800/800",
    "/api/placeholder/800/800"
  ];

  const styles = {
    container: {
      maxWidth: '470px',
      border: '1px solid #dbdbdb',
      borderRadius: '12px',
      backgroundColor: 'white',
      marginBottom: '20px',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px 16px',
      borderBottom: '1px solid #efefef'
    },
    profileImage: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      marginRight: '10px'
    },
    username: {
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#262626'
    },
    imageContainer: {
      width: '100%',
      height: '470px',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    swiperNavigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px'
    },
    swiperPagination: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4px',
      position: 'static',
      marginTop: '10px'
    }
  };

  const swiperCustomStyles = {
    '--swiper-navigation-color': '#262626',
    '--swiper-pagination-color': '#0095f6',
    '--swiper-pagination-bullet-inactive-color': '#dbdbdb',
    '--swiper-pagination-bullet-size': '6px',
    '--swiper-navigation-size': '20px', 
    '--swiper-navigation-sides-offset': '10px', 
    };

  return (
    <div style={styles.container}>
      {/* Header avec photo de profil et pseudo */}
      <div style={styles.header}>
        <img 
          src="/api/placeholder/32/32" 
          alt="Photo de profil" 
          style={styles.profileImage} 
        />
        <span style={styles.username}>Loane</span>
      </div>
      
      {/* Utilisation de Swiper pour le carrousel d'images */}
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ 
          clickable: true,
          el: '.swiper-pagination'
        }}
        style={{...styles.imageContainer, ...swiperCustomStyles}}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img 
              src={image} 
              alt={`Photo ${index + 1}`} 
              style={styles.image} 
            />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Conteneur de pagination personnalisé */}
      <div style={styles.swiperNavigation}>
        <div className="swiper-pagination" style={styles.swiperPagination}></div>
      </div>
    </div>
  );
};

export default ModalPost;