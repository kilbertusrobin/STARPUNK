import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Starpunk from './cards/starpunk';
import './ThreeScene.css';

const ThreeScene = () => {
  const cameraRef = useRef();
  const modelRef = useRef();
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modelPosition = useRef(new THREE.Vector3(0, 0, 0)); // Position actuelle de l'objet
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0)); // Position cible de l'objet

  useEffect(() => {
    const scene = new THREE.Scene();
    const loaderbg = new THREE.TextureLoader();
    loaderbg.load('./images-post/background.jpg', (texture) => {
      scene.background = texture;
    });

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 100);
    scene.add(ambientLight);

    const loader = new GLTFLoader();
    loader.load('./wooden_stool_02_4k.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(10, 10, 10);
      scene.add(model);
      modelRef.current = model;

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

      return () => {
        window.removeEventListener('click', onMouseClick);
      };
    });

    const controls = new OrbitControls(camera, renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Interpolation pour un mouvement plus fluide de l'objet
      if (modelRef.current) {
        modelPosition.current.lerp(targetPosition.current, 0.1); // Interpolation fluide (0.1 est la vitesse)
        modelRef.current.position.copy(modelPosition.current);


        modelRef.current.rotation.y += 0.001;  // Rotation lente autour de l'axe Y
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      controls.dispose();
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (modelRef.current) {
      if (isModalOpen) {
        // Déplacer l'objet 3D plus à gauche
        targetPosition.current.set(-6, 0, 0); // Déplacer davantage à gauche
      } else {
        // Recentrer l'objet 3D
        targetPosition.current.set(0, 0, 0); // Revenir au centre
      }
    }
  }, [isModalOpen]);

  const closeModal = () => {
    setSelectedPoint(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {selectedPoint && (
        <div className="modal-right">
          <Starpunk />
          <button onClick={closeModal} className="close-button">Fermer</button>
        </div>
      )}
    </>
  );
};

export default ThreeScene;
