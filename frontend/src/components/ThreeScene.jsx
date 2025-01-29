import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  const cameraRef = useRef();
  const modelRef = useRef();
  const controlsRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const pointsRef = useRef([]);
  const [showModal, setShowModal] = useState(false);
 
  useEffect(() => {
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      logarithmicDepthBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

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

    // Gestionnaire de clic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(pointsRef.current, true);

      if (intersects.length > 0) {
        const clickedPoint = intersects[0].object;
        if (clickedPoint.userData.id === 5) {
          setShowModal(true);
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    const loader = new GLTFLoader();
    loader.load(
      './Solarpunk_planet.gltf',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.set(-center.x, -center.y, -center.z);

        scene.add(model);
        modelRef.current = model;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI;
        controls.target.set(0, 0, 0);
        controls.update();
        controlsRef.current = controls;

        const pointData = [
          { 
            id: 1, 
            position: [0.9, -0.40, 0.45],  
            info: "Tour", 
            color: 0xff0000 
          },
          { 
            id: 2, 
            position: [0.4, 0.5, 1],  
            info: "Fleur", 
            color: 0x00ff00 
          },
          { 
            id: 4, 
            position: [-1.1, 0.2, -0.3],
            info: "Pyramide", 
            color: 0xffff00 
          },
          { 
            id: 5, 
            position: [2, 1.1, -0.5],  
            info: "Satellite", 
            color: 0x00000000,
            invisible: true
          },
        ];

        pointData.forEach((data) => {
          const geometry = new THREE.SphereGeometry(data.invisible ? 0.1 : 0.05, 32, 32);
          const material = new THREE.MeshBasicMaterial({ 
            color: data.color,
            transparent: true,
            opacity: data.invisible ? 0 : 0.8,
            visible: !data.invisible
          });
          const point = new THREE.Mesh(geometry, material);
          point.position.set(...data.position);
          point.userData = { id: data.id, info: data.info };

          if (!data.invisible) {
            const glowGeometry = new THREE.SphereGeometry(0.08, 32, 32);
            const glowMaterial = new THREE.MeshBasicMaterial({
              color: data.color,
              transparent: true,
              opacity: 0.3
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            point.add(glow);

            const animate = () => {
              glow.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.2;
              glow.scale.y = glow.scale.x;
              glow.scale.z = glow.scale.x;
              requestAnimationFrame(animate);
            };
            animate();
          }

          pointsRef.current.push(point);
          model.add(point);
        });

        setIsLoading(false);

        const handleResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };
        
        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('click', onMouseClick);
        };
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        setIsLoading(false);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.001;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
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
          backgroundColor: 'white'
        }}>
          <p>Chargement du modèle...</p>
        </div>
      )}
      
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <img 
          src="/images-post/spationaute.jpeg"
          alt="Rob & Masti"
          style={modalStyles.image}
        />
        <p style={modalStyles.text}>Rob & Masti à l'heure de leurs départ pour l'univers Starpunk</p>
      </Modal>
    </>
  );
};

export default ThreeScene;