import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { client } from './../prismic/prismicClient';
import { PrismicRichText } from '@prismicio/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const Artiste = () => {
    const { uid } = useParams();
    const [artist, setArtist] = useState(null);
    const SWIPER_HEIGHT = 220;

    useEffect(() => {
        const getArtist = async () => {
            try {
                const response = await client.getByUID('artiste', uid);
                setArtist(response);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'artiste:', error);
            }
        };
        getArtist();
    }, [uid]);

    if (!artist) {
        return <div>Chargement...</div>;
    }

    return (
        <div style={{
            backgroundImage: `url("/images-post/background.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100vh',
        }}>
            <div style={{
                height: `calc(100vh - ${SWIPER_HEIGHT}px)`,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
            }}>
                
                <div style={{width: '50%', height:'100%', padding: '0 60px 0 60px', display:'flex', flexDirection:'column', justifyContent:'center', gap:'20px'}} >
                    <div className="artistname" style={{width:'fit-content', cursor: 'pointer'}}>
                        <PrismicRichText field={artist.data.artistename} />
                    </div>
                    <PrismicRichText field={artist.data.artistedescription} />
                </div>
                <img src={artist.data.profilepic.url} style={{width:'auto', height:'65%', borderRadius:'10px'}}/>
            </div>

            <div>
                <Swiper 
                    spaceBetween={0} 
                    slidesPerView={3}
                    slidesPerGroup={1}
                    navigation
                    loop={true}
                    modules={[Navigation, Pagination]}
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                    }}
                >
                    {artist.data.illustrations.map((illu, index) => (
                        <SwiperSlide key={index} style={{ marginLeft: '0' }}>
                            <div className="parallelogram">
                                <img 
                                    src={illu.illu.url} 
                                    alt={illu.title[0]?.text || 'Illustration'} 
                                />
                                <div className="illuTitle">
                                    <PrismicRichText field={illu.title} />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style>{`
                .parallelogram {
                    position: relative;
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                    clip-path: polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%);
                }

                .parallelogram img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                p {
                    all: unset;
                }

                .artistname {
                    position: relative;
                    padding: 2px;
                    cursor: initial;
                }

                .artistname::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 1px;
                    bottom: 0;
                    left: 0;
                    background-color: white;
                    transition: width 0.3s ease;
                }

                .artistname:hover::after {
                    width: 100%;
                }

                p:hover {
                    all: unset;
                }

                .illuTitle {
                    color: black;
                    position: absolute;
                    background-color: rgba(255, 255, 255, 0.5);
                    bottom: 0;
                    left: 50%;
                    width: 100%;
                    transform: translateX(-50%);
                    padding: 2px;
                    text-align: center;
                }

                .swiper-button-next, .swiper-button-prev {
                    color: white;
                    padding: 30px;
                    border-radius: 10%;
                    transition: all 0.3s ease;
                }

                .swiper-button-next:hover, .swiper-button-prev:hover {
                    color: black;
                    background-color: white;
                }
            `}</style>
        </div>
    );
};

export default Artiste;