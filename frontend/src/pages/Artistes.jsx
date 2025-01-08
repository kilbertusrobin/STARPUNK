import React, { useState, useEffect } from 'react';
import { client } from './../prismic/prismicClient';
import { Link } from 'react-router-dom'; // Import du Link

const Artistes = () => {
    const [artists, setArtists] = useState([]);

    useEffect(() => {
      const getArtists = async () => {
        try {
          const response = await client.getAllByType('artiste');
          setArtists(response);
        } catch (error) {
          console.error('Erreur lors de la récupération des artistes:', error);
        }
      };
      getArtists();
    }, []);

    const getArtistName = (artistename) => {
        if (Array.isArray(artistename) && artistename.length > 0) {
            return artistename[0]?.text || 'Nom non disponible';
        }
        return 'Nom non disponible';
    };

    return (
        <div style={{
            width: '100vw',
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            padding: '20px',
            backgroundImage : `url("./images-post/background.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}>
            {artists.map((artiste, index) => (
                <Link
                    key={index}
                    to={`/artistes/${artiste.uid}`}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'end',
                        borderRadius: '8px',
                        backgroundImage: `url(${artiste.data.profilepic.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '190px',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                        textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.zIndex = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.zIndex = 'auto';
                    }}
                >
                    <p style={{ 
                        color: '#fff', 
                        fontWeight: 'bold', 
                        width:'100%', 
                        textAlign:'center', 
                        backgroundColor:'rgba(0,0,0,0.5)',
                        margin: 0,
                    }}>
                        {getArtistName(artiste.data.artistename)}
                    </p>
                </Link>
            ))}
                        {artists.map((artiste, index) => (
                <Link
                    key={index}
                    to={`/artistes/${artiste.uid}`}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'end',
                        borderRadius: '8px',
                        backgroundImage: `url(${artiste.data.profilepic.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '190px',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                        textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.zIndex = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.zIndex = 'auto';
                    }}
                >
                    <p style={{ 
                        color: '#fff', 
                        fontWeight: 'bold', 
                        width:'100%', 
                        textAlign:'center', 
                        backgroundColor:'rgba(0,0,0,0.5)',
                        margin: 0,
                    }}>
                        {getArtistName(artiste.data.artistename)}
                    </p>
                </Link>
            ))}
                        {artists.map((artiste, index) => (
                <Link
                    key={index}
                    to={`/artistes/${artiste.uid}`}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'end',
                        borderRadius: '8px',
                        backgroundImage: `url(${artiste.data.profilepic.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        height: '190px',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer',
                        textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.zIndex = '1';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.zIndex = 'auto';
                    }}
                >
                    <p style={{ 
                        color: '#fff', 
                        fontWeight: 'bold', 
                        width:'100%', 
                        textAlign:'center', 
                        backgroundColor:'rgba(0,0,0,0.5)',
                        margin: 0,
                    }}>
                        {getArtistName(artiste.data.artistename)}
                    </p>
                </Link>
            ))}
        </div>
    );
};

export default Artistes;
