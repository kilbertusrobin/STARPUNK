import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Starpunk from './cards/starpunk';
import './ThreeScene.css';

const ThreeScene = () => {
  const cameraRef = useRef();
  const modelRef = useRef();
  const controlsRef = useRef();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // État pour le chargement
  const [progress, setProgress] = useState(0); // Pourcentage de progression
  const [isModelReady, setIsModelReady] = useState(false); // État pour indiquer que le modèle est prêt
  const modelPosition = useRef(new THREE.Vector3(0, 0, 0)); // Position actuelle
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0)); // Position cible

  useEffect(() => {
    const scene = new THREE.Scene();

    // Charger le fond
    const loaderbg = new THREE.TextureLoader();
    loaderbg.load('./images-post/background.jpg', (texture) => {
      scene.background = texture;
    });

    // Initialisation de la caméra
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(8, 2, 8); // Position initiale de la caméra
    cameraRef.current = camera;

    // Initialisation du renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lumière
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // Ajustez l'intensité si nécessaire
    scene.add(ambientLight);

    // Charger le modèle 3D
    const loader = new GLTFLoader();
    const loadModel = () => {
      return new Promise((resolve, reject) => {
        loader.load(
          './wooden_stool_02_4k.gltf',
          (gltf) => {
            const model = gltf.scene;
            model.scale.set(10, 10, 10);
            scene.add(model);
            modelRef.current = model;

            // Ajouter des points cliquables
            const points = [];
            const pointData = [
              { id: 1, position: [0.2, 0.2, 0.2], info: "Point 1: Information spécifique" },
              { id: 2, position: [-0.2, 0.2, -0.2], info: "Point 2: Autre information" },
              { id: 3, position: [0.2, -0.2, 0], info: "Point 3: Encore autre information" }
            ];

            pointData.forEach((data) => {
              const geometry = new THREE.SphereGeometry(0.03, 32, 32);
              const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
              const point = new THREE.Mesh(geometry, material);
              point.position.set(...data.position);
              point.userData = { id: data.id, info: data.info };
              points.push(point);
              model.add(point);
            });

            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            const onMouseClick = (event) => {
              mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
              mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

              raycaster.setFromCamera(mouse, camera);
              const intersects = raycaster.intersectObjects(points);

              if (intersects.length > 0) {
                const clickedPoint = intersects[0].object;
                setSelectedPoint(clickedPoint.userData);
                setIsModalOpen(true);
              }
            };

            window.addEventListener('click', onMouseClick);

            resolve();
          },
          (xhr) => {
            // Suivi de progression
            setProgress((xhr.loaded / xhr.total) * 100);
          },
          (error) => {
            console.error('Erreur lors du chargement du modèle:', error);
            setIsLoading(false);
            reject(error);
          }
        );
      });
    };

    // Contrôles de caméra
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Animation fluide
      if (modelRef.current) {
        modelPosition.current.lerp(targetPosition.current, 0.1); // Valeur de lerp à ajuster
        modelRef.current.position.copy(modelPosition.current);

        // Rotation lente
        modelRef.current.rotation.y += 0.001;
      }

      renderer.render(scene, camera);
    };

    loadModel().then(() => {
      setIsLoading(false);
      setIsModelReady(true); // Indiquer que le modèle est prêt
      animate();
    });

    return () => {
      controls.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  // Gestion de la position de l'objet avec l'ouverture/fermeture du modal
  useEffect(() => {
    if (modelRef.current) {
      if (isModalOpen) {
        // Déplacer l'objet à gauche
        targetPosition.current.set(-4, 0, 0); // Déplacer l'objet à gauche

        // Mettre à jour la cible de la caméra sans déplacer la caméra
        if (controlsRef.current) {
          controlsRef.current.target.set(-4, 0, 0); // Garder la cible de la caméra centrée sur l'objet déplacé
        }
      } else {
        targetPosition.current.set(0, 0, 0); // Revenir à la position initiale
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0); // Revenir à la position cible initiale de la caméra
        }
      }
    }
  }, [isModalOpen]);

  const closeModal = () => {
    setSelectedPoint(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {isLoading && (
        <div className="loading-page">
          <p>Chargement : {Math.round(progress)}%</p>
          <div className="progress-bar">
            <div
              className="progress-bar-inner"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Contenu de la scène 3D */}
      {!isLoading && isModelReady && (
        <>
          {selectedPoint && (
            <div className="modal-right">
              <Starpunk />
              <button onClick={closeModal} className="close-button">Fermer</button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ThreeScene;
