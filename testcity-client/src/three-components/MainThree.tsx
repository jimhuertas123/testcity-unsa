
import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DirectoryInfo } from '../interface/typeStructureProjects.interface';
import { Component, Components } from '../interface/typeComponents.interface';
import { calculatePlatformSize, calculateTreemap } from './structures/treemap';
import { createPlatform } from './components/createPlatform';
import { processNodesAndAddBuildings } from './components/processData';

export const MainThree = () => {
    
    const mountRef = useRef<HTMLDivElement>(null);
    const clickableBuildings: THREE.Object3D[] = [];
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    
    useEffect(() => {
        //escena principal
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xe3f2fd); // Fondo verde oscuro

        //camara
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(50, 50, 1000);
        
        //render
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current?.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 10;
        controls.maxDistance = 500;
    
        const light = new THREE.PointLight(0xffffff, 1, 1000);
        light.position.set(50, 50, 100);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff); // Soft ambient light
        scene.add(ambientLight);


        const infoPanel = document.createElement("div");
        infoPanel.style.position = "absolute";
        infoPanel.style.top = "10px";
        infoPanel.style.right = "10px";
        infoPanel.style.padding = "10px";
        infoPanel.style.width = "200px";
        infoPanel.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        infoPanel.style.color = "white";
        infoPanel.style.display = "none";
        infoPanel.style.borderRadius = "5px";
        infoPanel.style.fontFamily = "ProximaNova";
        document.body.appendChild(infoPanel);


        function onPointerMove(event: MouseEvent) {
            pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }
    
        function onClick() {
            
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(clickableBuildings);
            
            if (intersects.length > 0) {
                const building = intersects[0].object as any;
                const info = building.userData as Component;
    
                
                if (info) {

                    const vector = new THREE.Vector3();
                    vector.setFromMatrixPosition(building.matrixWorld);
                    vector.project(camera);

                    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
                    const y = (vector.y * -0.5 + 0.5) * window.innerHeight;

                    // Posicionar el infoPanel en las coordenadas de pantalla
                    infoPanel.style.left = `${x}px`;
                    infoPanel.style.top = `${y}px`;


                    infoPanel.innerHTML = `
                        <strong>Component:</strong> ${info.name}<br>
                        <strong>Attributes:</strong> ${info.attributes}<br>
                        <strong>Methods:</strong> ${info.methods}<br>
                        <strong>Total Lines:</strong> ${info.totalLines}<br>
                        <strong>Lines Not Covered:</strong> ${info.lineNotCovered.join(", ")}<br>
                        <strong>Coverage:</strong> ${info.testPercent}%
                    `;
                    infoPanel.style.display = "block";
                }
            } else {
                infoPanel.style.display = "none";
            }
        }


        // Función para generar la ciudad
        function generateCity(directoryData: DirectoryInfo, componentData: Components[]) {
            const mainSize = calculatePlatformSize(directoryData.totalStatements);
            
            const mainPlatform = {
                name: directoryData.directory,
                x: 0,
                y: 0,
                width: mainSize,
                height: mainSize*2,
                children: calculateTreemap(directoryData.files, 0, 0, mainSize, mainSize),
            };

            createPlatform(scene, mainPlatform, 0);
            console.log(mainPlatform.children);
            
            if (mainPlatform.children) {
                processNodesAndAddBuildings(scene, componentData, mainPlatform.children, 1, clickableBuildings);
            }     
            
            
        
        }
        
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('click', onClick);
        // Leer los archivos JSON y generar la ciudad
        Promise.all([
            fetch('../src/config/example2-base.json').then(response => response.json()),
            fetch('../src/config/example2.json').then(response => response.json())
        ])
        .then(([directoryData, componentData]) => {
            generateCity(directoryData, componentData);
        })
        .catch(error => console.error('Error al cargar los archivos JSON:', error));

        // Animar la escena
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
            
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
            
        window.addEventListener('resize', handleResize);
            
        return () => {
            if (mountRef.current) {
                mountRef.current?.removeChild(renderer.domElement);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('click', onClick);
        };
    }, []);
        
    return <div ref={mountRef}>
        <div id="infoBox" style={{ display: 'none', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '5px' }}>
        </div>
    </div>;
};

// import * as THREE from 'three';
// import { useEffect, useRef } from 'react';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { DirectoryInfo } from '../interface/typeStructureProjects.interface';
// import { Components } from '../interface/typeComponents.interface';
// import { calculatePlatformSize, calculateTreemap, TreemapNode } from './structures/treemap';

// export const MainThree = () => {
    
//     const mountRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         //escena principal
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xe4f2fd); // Fondo verde oscuro

//         //camara
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         camera.position.set(50, 50, 100);
        
//         //render
//         const renderer = new THREE.WebGLRenderer();
//         renderer.setSize(window.innerWidth*0.80, window.innerHeight);
//         mountRef.current?.appendChild(renderer.domElement);
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;
//         controls.dampingFactor = 0.05;
//         controls.screenSpacePanning = false;
//         controls.minDistance = 10;
//         controls.maxDistance = 500;
    
//         const light = new THREE.PointLight(0xffffff, 1, 10000);
//         light.position.set(50, 50, 100);
//         scene.add(light);

//         const ambientLight = new THREE.AmbientLight(0xffffff); // Soft ambient light
//         scene.add(ambientLight);

//         //función para crear una plataforma
//         function createPlatform(scene: THREE.Scene, node: TreemapNode, z: number): void {
//             const color = node.children
//                 ? (node.x === 0 && node.y === 0) //main platform
//                     ? 0xf0f0f0 //light gray for subdirectories
//                     : 0xa8a8a8 //dark gray for the main platform
//                 : 0x0000ff;
//             console.log(node);

//             const geometry = new THREE.BoxGeometry(node.width, node.height, 1);
//             const material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 });
//             const platform = new THREE.Mesh(geometry, material);
        
//             platform.position.set(node.x + node.width / 2, node.y + node.height / 2, z);
//             scene.add(platform);
        
//             if (node.children) {
//                 for (const child of node.children) {
//                     createPlatform(scene, child, z + 1);
//                 }
//             }
//         }
        


//         // Función para generar la ciudad
//         function generateCity(directoryData: DirectoryInfo, componentData: Components[]) {
//             componentData;

//             const mainSize = calculatePlatformSize(directoryData.totalStatements);
//             const mainPlatform = {
//                 name: directoryData.directory,
//                 x: 0,
//                 y: 0,
//                 width: mainSize,
//                 height: mainSize,
//                 children: calculateTreemap(directoryData.files, 0, 0, mainSize, mainSize),
//             };

//             createPlatform(scene, mainPlatform, 0);
            
//         }
        
//         // Leer los archivos JSON y generar la ciudad
//         Promise.all([
//             fetch('../src/config/example1-base.json').then(response => response.json()),
//             fetch('../src/config/example1.json').then(response => response.json())
//         ])
//         .then(([directoryData, componentData]) => {
//             generateCity(directoryData, componentData);
//         })
//         .catch(error => console.error('Error al cargar los archivos JSON:', error));
            
//         // Animar la escena
//         function animate() {
//             requestAnimationFrame(animate);
//             controls.update();
//             renderer.render(scene, camera);
//         }
//         animate();
            
//         const handleResize = () => {
//             const newWidth = window.innerWidth*0.8;
//             const newHeight = window.innerHeight;
//             camera.aspect = newWidth / newHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(newWidth, newHeight);
//         };
            
//         window.addEventListener('resize', handleResize);
            
//         return () => {
//             if (mountRef.current) {
//                 mountRef.current?.removeChild(renderer.domElement);
//             }
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);
        
//     return <div ref={mountRef}>
//         <div id="infoBox" style={{ display: 'none', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '5px' }}>
//         </div>
//     </div>;
// };