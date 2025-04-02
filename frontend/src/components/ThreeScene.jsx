import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ModalPost from './ModalPost';

const modalStyles = {
  modal: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    textAlign: 'center'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'none',
    fontSize: '20px',
    cursor: 'pointer'
  },
  image: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'contain',
    marginBottom: '15px',
    borderRadius: '4px'
  },
  text: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#000000'
  },
  postContainer: {
    position: 'fixed',
    right: '30px',
    top: '50%',
    transform: 'translateY(-50%) scale(0.8)',
    zIndex: 900,
    maxWidth: '470px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    borderRadius: '12px'
  }
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={modalStyles.modal} onClick={handleBackdropClick}>
      <div style={modalStyles.modalContent}>
        <button style={modalStyles.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};

const ThreeScene = () => {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const pointsRef = useRef([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [pointId, setPointId] = useState(null);
  const [originalCameraPosition, setOriginalCameraPosition] = useState(null);
  const [originalControlsTarget, setOriginalControlsTarget] = useState(null);

  // Fonction pour contrôler la rotation
  const setRotation = (shouldRotate) => {
    console.log("setRotation called with:", shouldRotate);
    if (window.shouldRotatePlanet) {
      window.shouldRotatePlanet.current = shouldRotate;
    }
  };

  // Fonction pour déplacer la caméra vers le point
  const moveCameraToPoint = (point) => {
    if (!point || !cameraRef.current || !controlsRef.current) return;
    
    // Sauvegarder la position actuelle de la caméra et la cible des contrôles
    const currentCameraPosition = cameraRef.current.position.clone();
    const currentControlsTarget = controlsRef.current.target.clone();
    
    setOriginalCameraPosition(currentCameraPosition);
    setOriginalControlsTarget(currentControlsTarget);
    
    // Obtenir la position mondiale du point
    const pointWorldPosition = new THREE.Vector3();
    point.getWorldPosition(pointWorldPosition);
    
    // Définir une nouvelle position pour la caméra à côté du point
    // Distance légèrement en retrait du point pour voir la planète
    const distanceFromPoint = 1.5; 
    
    // Vecteur du centre de la planète vers le point
    const direction = pointWorldPosition.clone().normalize();
    
    // Positionner la caméra à une distance du point, dans la même direction
    const newCameraPosition = pointWorldPosition.clone().add(
      direction.multiplyScalar(distanceFromPoint)
    );
    
    // Animer le déplacement de la caméra
    const duration = 1; // durée en secondes
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const t = Math.min(elapsed / duration, 1);
      
      // Interpolation linéaire de la position de la caméra
      cameraRef.current.position.lerpVectors(currentCameraPosition, newCameraPosition, t);
      
      // Faire pointer la caméra vers le point d'intérêt
      controlsRef.current.target.lerpVectors(currentControlsTarget, pointWorldPosition, t);
      controlsRef.current.update();
      
      if (t < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    animateCamera();
  };

  // Fonction pour restaurer la position de la caméra
  const restoreCamera = () => {
    if (!cameraRef.current || !originalCameraPosition || !originalControlsTarget) return;
    
    const currentCameraPosition = cameraRef.current.position.clone();
    const currentControlsTarget = controlsRef.current.target.clone();
    
    const duration = 1; // durée en secondes
    const startTime = Date.now();
    
    const animateCamera = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const t = Math.min(elapsed / duration, 1);
      
      // Interpolation linéaire de la position de la caméra
      cameraRef.current.position.lerpVectors(currentCameraPosition, originalCameraPosition, t);
      
      // Faire pointer la caméra vers la cible originale
      controlsRef.current.target.lerpVectors(currentControlsTarget, originalControlsTarget, t);
      controlsRef.current.update();
      
      if (t < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    animateCamera();
  };

  // Initialisation de la scène Three.js
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scène, caméra et renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(
      45, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Éclairage
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

    // Contrôles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controlsRef.current = controls;

    // Chargement du modèle
    const loader = new GLTFLoader();
    loader.load(
      './Solarpunk_planet.gltf',
      (gltf) => {
        const model = gltf.scene;
        
        // Centrer le modèle
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.set(-center.x, -center.y, -center.z);
        
        scene.add(model);
        modelRef.current = model;

        // Points d'intérêt (sphères colorées)
        const pointData = [
          { id: 1, position: [0.9, -0.40, -0.4], color: 0xff0000 },
          { id: 2, position: [0.6, -0.4, 0.8], color: 0x00ff00 },
          { id: 4, position: [-1.05, 0.3, 0.2], color: 0xffff00 },
          { id: 5, position: [2, 0.53, 1.15], color: 0x0000ff, invisible: true },
        ];

        // Créer des points cliquables
        pointData.forEach(data => {
          // Points visibles - taille réduite
          const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(data.invisible ? 0.15 : 0.08),
            new THREE.MeshBasicMaterial({
              color: data.color,
              transparent: true,
              opacity: data.invisible ? 0 : 0.8,
            })
          );

          sphere.position.set(...data.position);
          sphere.userData.id = data.id;
          sphere.userData.isPoint = true;

          model.add(sphere);
          pointsRef.current.push(sphere);

          // Ajouter un glow pour les points visibles - taille réduite
          if (!data.invisible) {
            const glow = new THREE.Mesh(
              new THREE.SphereGeometry(0.12),
              new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.3
              })
            );
            sphere.add(glow);
          }
        });

        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    // Référence pour le statut de rotation (accessible globalement)
    window.shouldRotatePlanet = { current: true };

    // Boucle d'animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (modelRef.current && window.shouldRotatePlanet && window.shouldRotatePlanet.current) {
        modelRef.current.rotation.y += 0.001;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Gestionnaire de redimensionnement
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      delete window.shouldRotatePlanet;
    };
  }, []);

  // Gestionnaire de clic pour les points d'intérêt
  useEffect(() => {
    const handleClick = (event) => {
      if (!cameraRef.current || !modelRef.current || !rendererRef.current) return;
      
      // Convertir les coordonnées de clic en coordonnées normalisées
      const mouse = new THREE.Vector2();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Raycasting pour détecter les clics sur les points
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      
      // Vérifier l'intersection avec les points
      const intersects = raycaster.intersectObjects(pointsRef.current, true);
      
      if (intersects.length > 0) {
        // Trouver le point cliqué ou son parent
        let clickedObject = intersects[0].object;
        let pointObject = null;
        
        // Remonter dans la hiérarchie pour trouver l'objet parent qui est un point
        while (clickedObject && !pointObject) {
          if (clickedObject.userData && clickedObject.userData.isPoint) {
            pointObject = clickedObject;
          } else {
            clickedObject = clickedObject.parent;
          }
        }
        
        if (pointObject) {
          const id = pointObject.userData.id;
          console.log("Point cliqué:", id);
          
          // Déplacer la caméra vers le point
          moveCameraToPoint(pointObject);
          
          if (id === 5) {
            // Arrêter la rotation et afficher la modale pour le point 5
            setRotation(false);
            setShowModal(true);
          } else {
            // Ouvrir ModalPost pour les autres points
            handleOpenPost(id);
          }
        }
      }
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);
  
  // Fonction pour ouvrir le post
  const handleOpenPost = (id) => {
    if (showPost) return;
    
    console.log("Ouverture du post, arrêt de la rotation");
    // Arrêter la rotation
    setRotation(false);
    
    // Afficher le post
    setPointId(id);
    setShowPost(true);
  };
  
  // Fonction pour fermer le post
  const handleClosePost = () => {
    console.log("Fermeture du post, reprise de la rotation");
    // Reprendre la rotation
    setRotation(true);
    
    // Restaurer la position de la caméra
    restoreCamera();
    
    // Masquer le post
    setShowPost(false);
    setPointId(null);
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100vh' }}>
      {/* Écran de chargement */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          zIndex: 1000
        }}>
          <p>Chargement du modèle...</p>
        </div>
      )}
      
      {/* Modal pour le point 5 */}
      <Modal 
        isOpen={showModal} 
        onClose={() => {
          // Reprendre la rotation lors de la fermeture de la modale
          setRotation(true);
          
          // Restaurer la position de la caméra
          restoreCamera();
          
          setShowModal(false);
        }}
      >
        <img 
          src="/images-post/spationaute.jpeg"
          alt="Rob & Masti"
          style={modalStyles.image}
        />
        <p style={modalStyles.text}>Rob & Masti se préparant avant le décollage vers l'univers Starpunk</p>
      </Modal>
      
      {/* ModalPost pour les autres points */}
      {showPost && (
        <div style={{
          ...modalStyles.postContainer,
          opacity: showPost ? 1 : 0,
          transform: showPost 
            ? 'translateY(-50%) scale(0.8)' 
            : 'translateY(-50%) scale(0.8) translateX(100px)'
        }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={handleClosePost}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1100,
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              ×
            </button>
            <ModalPost />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeScene;