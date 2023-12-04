import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const VisualizationComponent = ({ clusterData, onSelected, selectedItem }) => {
    const mountRef = useRef(null);
    const selectedSphereRef = useRef(null); // useRef to keep track of the selected sphere
    const sceneRef = useRef(null);



    /*
useEffect(() => {
    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(20, 20, 30);
    camera.lookAt(new THREE.Vector3(8, 8, 10));

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(8, 10, 10);
    controls.update();

    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };
    animate();

    return () => {
        mountRef.current.removeChild(renderer.domElement);
    };
}, []); // Empty dependency array to run only on mount

*/





    useEffect(() => {
        // Visual update for the selected sphere
        if (sceneRef && selectedItem) {
            sceneRef.current.traverse(function (object) {
                if (object.isMesh) {
                    const isCurrentSelected = object.userData.x === selectedItem.x &&
                                              object.userData.y === selectedItem.y &&
                                              object.userData.z === selectedItem.z;
                    const originalColor = object.userData.clusterId === 0 ? 0xff0000 : 0x0000ff;
                    object.material.color.setHex(isCurrentSelected ? 0x00ff00 : originalColor);
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
                newSelectedObject.material.color.setHex(0x00ff00); // Change to green for selection
                newSelectedObject.material.needsUpdate = true;
                selectedSphereRef.current = newSelectedObject;
                onSelected(newSelectedObject.userData);
            }
        }; 

    document.addEventListener('mousedown', onDocumentMouseDown, false);

    // Destructure width and height from the parent container
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(20, 20, 30); // X, Y, Z
    camera.lookAt(new THREE.Vector3(8, 8, 10)); // Adjust based on your data's center

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Add cluster data to the scene
    const cluster0Material = new THREE.MeshBasicMaterial({ color: 'red' });
    const cluster1Material = new THREE.MeshBasicMaterial({ color: 'blue' });
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);














    clusterData.forEach(dataPoint => {
        // Determine the color of the sphere based on clustering
        let sphereColor;
        if (dataPoint.clusterId !== undefined) {
            // Clustering done, use colors based on clusterId
            sphereColor = dataPoint.clusterId === 0 ? 0xff0000 : 0x0000ff;
        } else {
            // Clustering not done, use a default color (e.g., grey)
            sphereColor = 0xaaaaaa;
        }

        // Create sphere material with the determined color
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



        /*
    clusterData.forEach(dataPoint => {
      // Create a unique material for each sphere
      const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color: dataPoint.clusterId === 0 ? 0xff0000 : 0x0000ff, // Initially red or blue
      });

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32), // Sphere size 0.5
        sphereMaterial
      );

      sphere.position.set(dataPoint.x, dataPoint.y, dataPoint.z);
      sphere.userData = {
          //  id: dataPoint.id,
        x: dataPoint.x,
        y: dataPoint.y,
        z: dataPoint.z,
        clusterId: dataPoint.clusterId
      };
      scene.add(sphere);
    });
    */







    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(8, 10, 10);
    controls.update();

    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

    // Render loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // Clean up on component unmount
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      document.removeEventListener('mousedown', onDocumentMouseDown);

    };
  }, [clusterData]); // Re-run effect if clusterData changes

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default VisualizationComponent;

