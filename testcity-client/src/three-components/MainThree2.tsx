// import * as THREE from 'three';
// import { useEffect, useRef } from 'react';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { DirectoryInfo, FileInfo } from '../interface/typeStructureProjects.interface';
// import { Component, Components } from '../interface/typeComponents.interface';



// export const MainThree2 = () => {
    
//     const mountRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         //escena principal
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0xe4f2fd); // Fondo verde oscuro

//         //camara
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         camera.position.set(0, 5, 10);
//         //render
//         const renderer = new THREE.WebGLRenderer();
//         renderer.setSize(window.innerWidth*0.80, window.innerHeight);
//         mountRef.current?.appendChild(renderer.domElement);

//         //info box
//         const raycaster = new THREE.Raycaster();
//         const mouse = new THREE.Vector2();
//         //función para manejar el clic
//         function onDocumentMouseDown(event: MouseEvent) {
//             event.preventDefault();

//             mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//             mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//             raycaster.setFromCamera(mouse, camera);

//             const intersects = raycaster.intersectObjects(scene.children);

//             if (intersects.length > 0) {
//                 const intersectedObject = intersects[0].object;
//                 showInfo(intersectedObject.userData, event.clientX, event.clientY);
//             }
//         }

//         document.addEventListener('mousedown', onDocumentMouseDown, false);

//         // Función para mostrar la información
//         function showInfo(data: any, x: number, y: number) {
//             const infoBox = document.getElementById('infoBox');
//             if (infoBox) {
//                 infoBox.style.display = 'block';
//                 infoBox.style.left = `${x - 50}px`; // Ajustar para centrar mejor
//                 infoBox.style.top = `${y - 50}px`; // Ajustar para centrar mejor
//                 infoBox.innerHTML = `
//                     <p>Name: ${data.name}</p>
//                     <p>Methods: ${data.methods}</p>
//                     <p>Attributes: ${data.attributes}</p>
//                     <p>Total Lines: ${data.totalLines}</p>
//                     <p>Test Percent: ${data.testPercent}</p>
//                 `;
//             }
//         }


//         //zoom and pan
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;
//         controls.dampingFactor = 0.25;
//         controls.screenSpacePanning = false;
//         controls.maxPolarAngle = Math.PI / 2;

//         //función para crear una plataforma
//         function createPlatform(width: number, height: number, depth: number, color: THREE.ColorRepresentation, positionY: number) {
//             const geometry = new THREE.BoxGeometry(width, height, depth);
//             const material = new THREE.MeshBasicMaterial({ color });
//             const platform = new THREE.Mesh(geometry, material);
//             platform.position.y = positionY;
//             return platform;
//         }

//         function createBuilding(width: number, height: number, depth: number, color: THREE.ColorRepresentation, positionY: number) {
//             const geometry = new THREE.BoxGeometry(width, height, depth);
        
//             // Crear un material personalizado con un borde negro y respetar el color pasado por parámetros
//             const vertexShader = `
//                 varying vec2 vUv;
//                 void main() {
//                     vUv = uv;
//                     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//                 }
//             `;
        
//             const fragmentShader = `
//                 uniform vec3 uColor;
//                 varying vec2 vUv;
//                 void main() {
//                     float borderSize = 0.1;
//                     vec3 borderColor = vec3(0.2, 0.2, 0.2); // Color del borde negro
//                     vec3 centerColor = uColor; // Color del centro
//                     float border = smoothstep(0.0, borderSize, vUv.x) * smoothstep(0.0, borderSize, vUv.y) *
//                                    smoothstep(0.0, borderSize, 1.0 - vUv.x) * smoothstep(0.0, borderSize, 1.0 - vUv.y);
//                     vec3 finalColor = mix(borderColor, centerColor, border);
//                     gl_FragColor = vec4(finalColor, 1.0);
//                 }
//             `;
        
//             const material = new THREE.ShaderMaterial({
//                 vertexShader,
//                 fragmentShader,
//                 uniforms: {
//                     uColor: { value: new THREE.Color(color) }
//                 }
//             });
        
//             // Crear el mesh con la geometría y el material personalizado
//             const building = new THREE.Mesh(geometry, material);
//             building.position.y = positionY;
        
//             return building;
//         }

//         //función para crear una etiqueta de texto
//         function createLabel(text: string, position: { x: number; y: number; z: number; }) {
//             const canvas = document.createElement('canvas');
//             const context = canvas.getContext('2d');
//             // context!.font = '24px Arial';
//             context!.font = '30px Arial';
//             context!.fillStyle = 'white';
//             context!.fillText(text, 0, 70);
//             const texture = new THREE.CanvasTexture(canvas);
//             const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
//             const sprite = new THREE.Sprite(spriteMaterial);
//             sprite.scale.set(2, 1, 1);
//             sprite.position.set(position.x, position.y, position.z);
//             return sprite;
//         }

//         //función para determinar el color del edificio basado en la cobertura
//         interface CoverageColorMapping {
//             [key: string]: number;
//         }
//         const coverageColorMapping: CoverageColorMapping = {
//             "100%": 0x4CAF50,
//             "0%": 0xd0d0d0,
//         };
//         function getColorBasedOnCoverage(coverage: string): number {
//             if (coverage in coverageColorMapping) {
//                 return coverageColorMapping[coverage];
//             }
//             const coverageValue = parseFloat(coverage);
//             if (coverageValue > 65) return 0xFFEB3B;
//             return 0xF44336;
//         }

//         function findComponents(filePath: DirectoryInfo | Component | FileInfo, componentData: Components[]): Component[] {
//             for (const file of componentData) {
//                 console.log("component: ", file);
//                 console.log("filePath: ", filePath);
//                 if (file.file === (filePath as FileInfo).file) {//para saber si es un archivo
//                     return file.components as Component[];
//                 }               
//                 if ('directory' in file) {//para saber si es un directorio
//                     const subComponents = findComponents(filePath, file.components as Components[]);
//                     if (subComponents.length > 0) {
//                         return subComponents;
//                     }
//                 }
//             }
//             return [];
//         }

//         function preprocessData(directoryData: DirectoryInfo) {
//             const positions: { type: string; data: DirectoryInfo | Component | FileInfo; posX: number; posZ: number; color?: number; level: number }[] = [];

//             function processDirectory(directory: DirectoryInfo, parentPositionX: number, parentPositionZ: number, depth: number) {
//                 directory.files.forEach((file, fileIndex) => {
//                     const posX = parentPositionX + (fileIndex % 5) * 10 - (Math.floor(directory.files.length / 2) * 10);
//                     const posZ = parentPositionZ + Math.floor(fileIndex / 5) * 15 - (Math.floor(directory.files.length / 2) * 12);
                    
//                     if ('directory' in file) {
//                         const subdirColor = 0x808080 - 1 * 0x101010; // Color más oscuro para subdirectorios
//                         positions.push({ type: 'directory', data: file, posX, posZ, color: subdirColor, level: depth });
//                         processDirectory(file as DirectoryInfo, posX, posZ, depth + 0.2);
//                     } else {
//                         positions.push({ type: 'file', data: file, posX, posZ, level: depth });
//                     }
//                 });
//             }

//             processDirectory(directoryData, 80, 67, 0);
//             return positions;
//         }

//         // Función para generar la ciudad
//         function generateCity(directoryData: DirectoryInfo, componentData: Components[]) {
//             const totalStatements = directoryData.totalStatements;
//             const directoryPlatform = createPlatform(totalStatements * 0.1, 0.5, totalStatements * 0.2, 0x808080, 0);
//             scene.add(directoryPlatform);

//             const positions = preprocessData(directoryData);
//             // console.log("positions: ", positions);
            
//             positions.forEach((position) => {
//                 if (position.type === 'directory') {
//                     const subdirPlatform = createPlatform(10, 0.2, 10, position.color ? position.color : 0xff12ffdd, 0.5 + position.level * 2);
//                     subdirPlatform.position.x = position.posX;
//                     subdirPlatform.position.z = position.posZ;
//                     scene.add(subdirPlatform);
//                 } else if (position.type === 'file') {
//                     const fileComponents:Component[] = findComponents(position.data, componentData);
                    
//                     const numComponents = fileComponents.length;
//                     const platformSize = Math.ceil(Math.sqrt(numComponents)) * 3;

//                     const filePlatform = createPlatform(platformSize, 0.2, platformSize, 0x404040, 0.5 + position.level * 2);
//                     filePlatform.position.x = position.posX;
//                     filePlatform.position.z = position.posZ;
//                     scene.add(filePlatform);

//                     fileComponents.forEach((component, compIndex) => {
//                         const methods = component.methods;
//                         const attributes = component.attributes;
//                         const lines = component.totalLines;
//                         const base = methods + attributes
//                         const width = Math.log(base) + Math.sqrt(4*base)+10;
//                         const depth = Math.log(base) + Math.sqrt(4*base)+10;
//                         const height = (lines /((methods + attributes)*(methods + attributes)))+5;
//                         const color = getColorBasedOnCoverage(component.testPercent);

//                         const building = createBuilding(width/2, height*5, depth/2, color, height*2.5); // Ajustar la altura del edificio
//                         building.position.x = filePlatform.position.x + (compIndex % Math.ceil(Math.sqrt(numComponents))) * 3 - platformSize / 2 + 1.5;
//                         building.position.z = filePlatform.position.z + Math.floor(compIndex / Math.ceil(Math.sqrt(numComponents))) * 3 - platformSize / 2 + 1.5;
                        
//                         building.userData = {
//                             name: component.name,
//                             methods: component.methods,
//                             attributes: component.attributes,
//                             totalLines: component.totalLines,
//                             testPercent: component.testPercent
//                         };

//                         scene.add(building);

//                         // Crear y añadir la etiqueta de texto
//                         const label = createLabel(component.name, new THREE.Vector3(building.position.x, building.position.y + height / 2 + 0.5 * 5, building.position.z));
//                         scene.add(label);
//                     });
//                 }
//             });
//         }
        
//         // Leer los archivos JSON y generar la ciudad
//         Promise.all([
//             fetch('../src/config/example2-base.json').then(response => response.json()),
//             fetch('../src/config/example2.json').then(response => response.json())
//         ])
//         .then(([directoryData, componentData]) => {
//             generateCity(directoryData, componentData);
//         })
//         .catch(error => console.error('Error al cargar los archivos JSON:', error));
        
//         // Añadir controles de teclado
//         function onKeyDown(event: KeyboardEvent) {
//             switch (event.key) {
//                 case 'w':
//                     camera.position.z -= 4.5;
//                     break;
//                 case 's':
//                     camera.position.z += 4.5;
//                     break;
//                 case 'a':
//                     camera.position.x -= 4.5;
//                     break;
//                 case 'd':
//                     camera.position.x += 4.5;
//                     break;
//             }
//         }
//         window.addEventListener('keydown', onKeyDown);
            
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
//             window.removeEventListener('keydown', onKeyDown);
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);
        
//     return <div ref={mountRef}>
//         <div id="infoBox" style={{ display: 'none', position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '5px' }}>
//         </div>
//     </div>;
// };








                
                // const numComponents = Array.isArray(fileComponents) ? fileComponents.length : 0;
                // console.log("componentes: ",fileComponents);
                
                // const platformSize = Math.ceil(Math.sqrt(numComponents)) * 3;
            
                // const filePlatform = createPlatform(platformSize, 0.2, platformSize, 0x404040, 0.5); // Ajustar la altura de la plataforma
                // // filePlatform.position.x = parentPositionX + index * (platformSize + 2);
                // filePlatform.position.x = parentPositionX + (index % 5) * (platformSize + 2);
                // filePlatform.position.z = parentPositionZ + Math.floor(index / 5) * (platformSize + 2);
                // scene.add(filePlatform);
                
                // if(fileComponents){
                // fileComponents.forEach((component, compIndex) => {
                //     const methods = component.methods;
                //     const attributes = component.attributes;
                //     const lines = component.totalLines;
                //     const width = methods + attributes;
                //     const depth = methods + attributes;
                //     const height = lines / 10;
                //     const color = getColorBasedOnCoverage(component.testPercent);
            
                //     const building = createBuilding(width, height, depth, color, 0.6 + height / 2); // Ajustar la altura del edificio
                //     building.position.x = filePlatform.position.x + (compIndex % Math.ceil(Math.sqrt(numComponents))) * 3 - platformSize / 2 + 1.5;
                //     building.position.z = filePlatform.position.z + Math.floor(compIndex / Math.ceil(Math.sqrt(numComponents))) * 3 - platformSize / 2 + 1.5;
                //     scene.add(building);
            
                //     // Crear y añadir la etiqueta de texto
                //     const label = createLabel(component.name, new THREE.Vector3(building.position.x, building.position.y + height / 2 + 0.5, building.position.z));
                //     scene.add(label);
                // });
                