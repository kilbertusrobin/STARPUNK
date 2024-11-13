import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './ThreeScene.css'; // CSS pour les modales

const ThreeScene = () => {
  const cameraRef = useRef(); // Référence pour la caméra
  const modelRef = useRef();  // Référence pour le modèle
  const [selectedPoint, setSelectedPoint] = useState(null); // Pour gérer la sélection du point cliqué

  useEffect(() => {
    // Création de la scène
    const scene = new THREE.Scene();
    // Charger l'image de fond
  const loaderbg = new THREE.TextureLoader();
  loaderbg.load('./images-post/background.jpg', (texture) => {
    scene.background = texture; // Applique la texture comme arrière-plan
  });

    // Création de la caméra
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    cameraRef.current = camera; // Stockage de la caméra dans la référence

    // Création du rendu
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Ajouter une lumière ambiante
    const ambientLight = new THREE.AmbientLight(0x404040, 100); // lumière ambiante, intensité 10
    scene.add(ambientLight);

    
  


    // Charger le modèle 3D
    const loader = new GLTFLoader();
    loader.load('./wooden_stool_02_4k.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(10, 10, 10); // Augmenter l'échelle du modèle pour le rendre plus gros
      scene.add(model);
      modelRef.current = model; // Stocker le modèle dans la référence

      // Ajouter des points interactifs autour du modèle avec des informations uniques
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
        point.userData = { id: data.id, info: data.info }; // Stocker des informations dans userData
        points.push(point);
        model.add(point); // Ajouter les points en tant qu'enfants du modèle
      });

      // Raycaster pour détecter les clics sur les points
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const onMouseClick = (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(points);

        if (intersects.length > 0) {
          const clickedPoint = intersects[0].object;
          setSelectedPoint(clickedPoint.userData); // Stocker les données du point cliqué
        }
      };

      window.addEventListener('click', onMouseClick);

      // Nettoyage
      return () => {
        window.removeEventListener('click', onMouseClick);
      };
    });

    // Initialisation des contrôles de la caméra
    const controls = new OrbitControls(camera, renderer.domElement);

    // Animation de la scène
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Mise à jour des contrôles

      // Rotation très lente du modèle
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.001; // Rotation lente autour de l'axe Y
      }

      renderer.render(scene, camera);
    };

    animate();

    // Nettoyer le rendu lorsque le composant est démonté
    return () => {
      controls.dispose(); // Libération des ressources des contrôles
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  // Gérer la fermeture de la modale
  const closeModal = () => setSelectedPoint(null);

  return (
    <>
     
      {/* Modale spécifique au point cliqué */}
      {selectedPoint && (
        <div className="modal">
          <div className="modal-content">
            <h2>Point {selectedPoint.id}</h2>
            <p>{selectedPoint.info}</p>
            <button onClick={closeModal}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ThreeScene;
