//visualization.js
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const clusterColors = [
    0xff0000, // red
    0x0000ff, // blue
    0x00ff00, // green
    0xffff00, // yellow
    0xff00ff, // magenta
];

const VisualizationComponent = ({ clusterData, onSelected, selectedItem }) => {
    const mountRef = useRef(null);
    const selectedSphereRef = useRef(null); 
    const sceneRef = useRef(null);

    useEffect(() => {

        if (!clusterData || clusterData.length === 0) {
            return;
        }

        // Visual update for the selected sphere
        if (sceneRef && selectedItem) {
            sceneRef.current.traverse(function (object) {
                if (object.isMesh) {
                     const isCurrentSelected = object.userData.x === selectedItem.x &&
                                              object.userData.y === selectedItem.y &&
                                              object.userData.z === selectedItem.z;
                    const originalColor = clusterColors[object.userData.clusterId % clusterColors.length];
                    object.material.color.setHex(isCurrentSelected ? 0x00ffff : originalColor);
                }
            });
        }
    }, [selectedItem]);

    useEffect(() => {

        if (!clusterData || clusterData.length === 0) {
            return;
        }
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();


        const onDocumentMouseDown = (event) => {
            event.preventDefault();
            mouse.x = ((event.clientX - renderer.domElement.offsetLeft) / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -((event.clientY - renderer.domElement.offsetTop) / renderer.domElement.clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            if (intersects.length > 0) {
                const newSelectedObject = intersects[0].object;
                if (selectedSphereRef.current && selectedSphereRef.current !== newSelectedObject) {
                    const prevColor = selectedSphereRef.current.userData.clusterId === 0 ? 0xff0000 : 0x0000ff;
                    selectedSphereRef.current.material.color.setHex(prevColor);
                }
                newSelectedObject.material.color.setHex(0x00ff00); // Change to cyan for selection
                newSelectedObject.material.needsUpdate = true;
                selectedSphereRef.current = newSelectedObject;
                onSelected(newSelectedObject.userData);
            }
        }; // onDocumentMouseDown function ends

    // Destructure width and height from the parent container
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Add cluster data to the scene
        //    const cluster0Material = new THREE.MeshBasicMaterial({ color: 'red' });
        //    const cluster1Material = new THREE.MeshBasicMaterial({ color: 'blue' });
        //    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);

    clusterData.forEach(dataPoint => {


        const colorIndex = dataPoint.clusterId % clusterColors.length; // Use modulo to avoid out-of-range errors
        const sphereColor = clusterColors[colorIndex];

        // Create sphere material with the selected color
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: sphereColor });

        // Rest of the sphere creation code
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            sphereMaterial
        );

        // Set sphere position and userData
        sphere.position.set(dataPoint.x, dataPoint.y, dataPoint.z);
        sphere.userData = {
            x: dataPoint.x,
            y: dataPoint.y,
            z: dataPoint.z,
            clusterId: dataPoint.clusterId
        };

        // Add sphere to the scene
        scene.add(sphere);
    });


    let sumX = 0, sumY = 0, sumZ = 0;
        clusterData.forEach(point => {
            sumX += point.x;
            sumY += point.y;
            sumZ += point.z;
        });

    const centerX = sumX / clusterData.length;
    const centerY = sumY / clusterData.length;
    const centerZ = sumZ / clusterData.length;
    const center = new THREE.Vector3(centerX, centerY, centerZ);

    // Update camera position and orbit controls target
    camera.position.set(centerX, centerY, centerZ + 20); 
    camera.lookAt(center);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(centerX, centerY, centerZ);

    controls.update();

        renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false); //////////??

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      renderer.domElement.removeEventListener('mousedown', onDocumentMouseDown);

        sceneRef.current.children.forEach(child => {
            sceneRef.current.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
        renderer.dispose();
    };
  }, [clusterData]); // Re-run effect if clusterData changes

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default VisualizationComponent;
