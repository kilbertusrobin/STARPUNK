import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useNavigate } from 'react-router-dom';

const navigationStyles = {
  container: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    boxSizing: 'border-box',
    zIndex: 10
  },
  arrowButton: {
    width: '60px',
    height: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    cursor: 'pointer',
    pointerEvents: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, background-color 0.2s',
    backdropFilter: 'blur(5px)'
  },
  arrowIcon: {
    width: '30px',
    height: '30px',
    stroke: 'white',
    strokeWidth: 2
  },
  planetInfo: {
    position: 'fixed',
    top: '120px', // Position plus basse pour tenir compte du header
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    textAlign: 'center',
    width: '80%',
    maxWidth: '600px',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    zIndex: 20
  },
  planetName: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '10px 0 0px 0',
    textTransform: 'uppercase'
  },
  planetDescription: {
    fontSize: '16px',
    margin: '0 0 5px 0',
    lineHeight: '1.4',
  },
  exploreButton: {
    backgroundColor: 'orange',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.2s, background-color 0.2s',
    pointerEvents: 'auto',
    margin: '0 auto',
    marginBottom: '10px',
    display: 'block'
  },
  loadingContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    color: 'white',
    flexDirection: 'column',
    zIndex: 1001
  },
  loadingText: {
    fontSize: '20px',
    marginTop: '20px'
  },
  loadingBar: {
    width: '60%',
    maxWidth: '400px',
    height: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    marginTop: '10px',
    overflow: 'hidden'
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    transition: 'width 0.2s'
  }
};

const LeftArrow = () => (
  <svg viewBox="0 0 24 24" style={navigationStyles.arrowIcon}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
  </svg>
);

const RightArrow = () => (
  <svg viewBox="0 0 24 24" style={navigationStyles.arrowIcon}>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
  </svg>
);

const PlanetSelector = () => {
  const navigate = useNavigate();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const animationRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Chargement des planètes...');
  
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const planetsRef = useRef([]);
  
  // Définition des planètes - utilisation du même modèle mais avec différentes informations/couleurs
  const planets = [
    {
      name: "Médée",
      model: './Solarpunk_planet.gltf',
      route: '/planete',
      description: "Un monde écologique où technologie et nature coexistent en harmonie. Explorez ses villes verdoyantes et ses communautés durables.",
      backgroundColor: '#1a472a'
    },
    {
      name: "Cyberpunk",
      model: './Solarpunk_planet.gltf', // Même modèle
      route: '/planete',
      description: "Une dystopie néon où haute technologie et bas-fonds se côtoient. Découvrez ses mégalopoles surpeuplées et ses réalités virtuelles.",
      backgroundColor: '#2d0e31'
    },
    {
      name: "Steampunk",
      model: './Solarpunk_planet.gltf', // Même modèle
      route: '/planete',
      description: "Un univers rétrofuturiste alimenté à la vapeur. Explorez ses machines extraordinaires et son esthétique victorienne.",
      backgroundColor: '#3d2b1f'
    }
  ];

  const navigateToPlanet = (direction) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentPlanetIndex + 1) % planets.length;
    } else {
      newIndex = (currentPlanetIndex - 1 + planets.length) % planets.length;
    }

    // Animation de transition avec effet de fondu
    // Planète actuelle qui s'éloigne vers la gauche ou la droite
    const currentPlanet = planetsRef.current[currentPlanetIndex];
    const newPlanet = planetsRef.current[newIndex];
    
    if (currentPlanet && newPlanet) {
      // Direction du mouvement
      const moveDirection = direction === 'next' ? -15 : 15;
      
      // Position initiale de la nouvelle planète (hors écran dans le sens opposé)
      newPlanet.position.x = -moveDirection;
      newPlanet.visible = true;
      
      // Couleur de fond
      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(planets[newIndex].backgroundColor);
      }
      
      // Animation de glissement
      const startTime = Date.now();
      const duration = 800;
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function pour une animation plus naturelle
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        // Déplacer la planète actuelle hors écran
        currentPlanet.position.x = easeProgress * moveDirection;
        
        // Amener la nouvelle planète au centre
        newPlanet.position.x = -moveDirection + easeProgress * moveDirection;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation terminée
          currentPlanet.visible = false;
          currentPlanet.position.x = 0; // Réinitialiser la position
          newPlanet.position.x = 0;
          
          // Mettre à jour l'index
          setCurrentPlanetIndex(newIndex);
          setIsTransitioning(false);
        }
      };
      
      animate();
    } else {
      // Fallback simple si les planètes ne sont pas trouvées
      if (currentPlanet) currentPlanet.visible = false;
      if (newPlanet) newPlanet.visible = true;
      
      if (sceneRef.current) {
        sceneRef.current.background = new THREE.Color(planets[newIndex].backgroundColor);
      }
      
      setCurrentPlanetIndex(newIndex);
      setIsTransitioning(false);
    }
  };

  // Cette fonction n'est plus utilisée, mais conservée au cas où
  const animateCamera = (from, to, duration, callback) => {
    const startTime = Date.now();
    
    const updateCamera = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      cameraRef.current.position.x = from.x + (to.x - from.x) * progress;
      cameraRef.current.position.y = from.y + (to.y - from.y) * progress;
      cameraRef.current.position.z = from.z + (to.z - from.z) * progress;
      
      if (progress < 1) {
        requestAnimationFrame(updateCamera);
      } else if (callback) {
        callback();
      }
    };
    
    updateCamera();
  };

  const handleExplorePlanet = () => {
    navigate(planets[currentPlanetIndex].route);
  };

  useEffect(() => {
    // Créer la scène
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(planets[currentPlanetIndex].backgroundColor);
    sceneRef.current = scene;
    
    // Créer la caméra avec position fixe
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8); // Position fixe
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Créer le renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      logarithmicDepthBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ajouter les lumières
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    const frontLight = new THREE.DirectionalLight(0xffffff, 2);
    frontLight.position.set(0, 0, 5);
    const backLight = new THREE.DirectionalLight(0xffffff, 2);
    backLight.position.set(0, 0, -5);
    const leftLight = new THREE.DirectionalLight(0xffffff, 2);
    leftLight.position.set(-5, 0, 0);
    const rightLight = new THREE.DirectionalLight(0xffffff, 2);
    rightLight.position.set(5, 0, 0);
    const topLight = new THREE.DirectionalLight(0xffffff, 2);
    topLight.position.set(0, 5, 0);

    scene.add(
      ambientLight, 
      frontLight, 
      backLight, 
      leftLight, 
      rightLight, 
      topLight
    );

    // Référence pour stocker les planètes chargées
    planetsRef.current = new Array(planets.length).fill(null);
    
    // Charger le modèle de planète une seule fois puis créer des instances
    const loader = new GLTFLoader();
    loader.load(
      planets[0].model, // Utiliser le premier modèle pour tous
      (gltf) => {
        const originalModel = gltf.scene;
        
        // Pour chaque planète, cloner le modèle original
        planets.forEach((planetData, planetIndex) => {
          // Cloner le modèle pour chaque planète
          const model = originalModel.clone();
          model.scale.set(0.8, 0.8, 0.8); // Taille réduite à 80%
          
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          model.position.set(-center.x, -center.y, -center.z);
          
          // Rendre invisible sauf la première planète
          model.visible = planetIndex === currentPlanetIndex;
          
          // Appliquer une légère variation de couleur pour différencier visuellement les planètes
          model.traverse((child) => {
            if (child.isMesh && child.material) {
              // Créer une copie du matériau pour ne pas affecter les autres instances
              if (Array.isArray(child.material)) {
                child.material = child.material.map(mat => mat.clone());
              } else {
                child.material = child.material.clone();
              }
              
              // Ajuster légèrement la teinte des matériaux selon le type de planète
              if (planetIndex === 1) { // Cyberpunk
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    if (mat.color) {
                      // Ajouter une teinte bleutée/violette pour cyberpunk
                      mat.color.offsetHSL(0.7, 0, 0);
                    }
                  });
                } else if (child.material.color) {
                  child.material.color.offsetHSL(0.7, 0, 0);
                }
              } else if (planetIndex === 2) { // Steampunk
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    if (mat.color) {
                      // Ajouter une teinte cuivrée/dorée pour steampunk
                      mat.color.offsetHSL(0.1, 0.2, 0);
                    }
                  });
                } else if (child.material.color) {
                  child.material.color.offsetHSL(0.1, 0.2, 0);
                }
              }
            }
          });
          
          scene.add(model);
          planetsRef.current[planetIndex] = model;
        });
        
        // Tout est chargé
        setIsLoading(false);
      },
      (xhr) => {
        // Progression du chargement individuel
        const individualProgress = (xhr.loaded / xhr.total) * 100;
        setLoadingProgress(individualProgress);
        setLoadingText(`Chargement du modèle 3D... (${Math.round(individualProgress)}%)`);
      },
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
        setLoadingText('Erreur de chargement. Veuillez réessayer.');
      }
    );

    // Animation de rendu
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Faire tourner doucement chaque planète visible
      planetsRef.current.forEach((planet, index) => {
        if (planet && planet.visible) {
          // Rotation sur plusieurs axes pour un effet plus dynamique
          planet.rotation.y += 0.005;
          planet.rotation.x += 0.0005; // Très léger mouvement en x
        }
      });
      
      renderer.render(scene, camera);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    // Effet d'ondulation pour la planète
    const addPlanetPulsation = () => {
      const minScale = 0.78; // Ajusté pour la taille réduite
      const maxScale = 0.82; // Ajusté pour la taille réduite
      const duration = 3000; // ms
      
      const pulsate = () => {
        const currentPlanet = planetsRef.current[currentPlanetIndex];
        if (currentPlanet) {
          const time = Date.now() % duration;
          const progress = time / duration;
          const scale = minScale + (Math.sin(progress * Math.PI * 2) + 1) / 2 * (maxScale - minScale);
          
          currentPlanet.scale.set(scale, scale, scale);
        }
        requestAnimationFrame(pulsate);
      };
      
      pulsate();
    };
    
    addPlanetPulsation();

    // Nettoyage
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement && document.body.contains(rendererRef.current.domElement)) {
        document.body.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <>
      {isLoading && (
        <div style={navigationStyles.loadingContainer}>
          <div style={navigationStyles.loadingText}>{loadingText}</div>
          <div style={navigationStyles.loadingBar}>
            <div 
              style={{
                ...navigationStyles.loadingProgress,
                width: `${loadingProgress}%`
              }}
            />
          </div>
        </div>
      )}
      
      {!isLoading && (
        <>
          <div style={navigationStyles.container}>
            <div 
              style={navigationStyles.arrowButton} 
              onClick={() => navigateToPlanet('prev')}
            >
              <LeftArrow />
            </div>
            <div 
              style={navigationStyles.arrowButton} 
              onClick={() => navigateToPlanet('next')}
            >
              <RightArrow />
            </div>
          </div>
          
          <div style={navigationStyles.planetInfo}>
            <h1 style={navigationStyles.planetName}>
              {planets[currentPlanetIndex].name}
            </h1>
          </div>
          
          <div style={{
            position: 'fixed',
            bottom: '100px', // Position plus haute pour tenir compte du NewsTicker
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            textAlign: 'center',
            width: '80%',
            maxWidth: '600px',
            zIndex: 20
          }}>
            <p style={navigationStyles.planetDescription}>
              {planets[currentPlanetIndex].description}
            </p>
            <button 
              style={navigationStyles.exploreButton}
              onClick={handleExplorePlanet}
            >
              Explorer cette planète
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PlanetSelector;