import * as THREE from 'three';
import { Component } from '../../interface/typeComponents.interface';
import { TreemapNode } from '../structures/treemap';

interface CoverageColorMapping {
    [key: string]: number;
}
const coverageColorMapping: CoverageColorMapping = {
    "100%": 0x4cff72,
    "0%": 0xf0f0f0,
};
function getColorBasedOnCoverage(coverage: string): number {
    if (coverage in coverageColorMapping) {
        return coverageColorMapping[coverage];
    }
    const coverageValue = parseFloat(coverage);
    if (coverageValue > 65) return 0xfec866;
    return 0xff4b63;
}

export function createBuildings(scene: THREE.Scene, components: Component[], fileNode: TreemapNode, z: number, clickableBuildings: THREE.Object3D[]): void {
    const centerX = fileNode.x + fileNode.width / 2;
    const centerY = fileNode.y + fileNode.height / 2;
    // const totalLines = components.reduce((sum, comp) => sum + comp.totalLines, 0);

    let angleStep = (2 * Math.PI) / components.length;
    let radius = Math.min(fileNode.width, fileNode.height) / 3;

    components.forEach((component, index) => {
        const angle = index * angleStep;
        const xOffset = Math.cos(angle) * radius;
        const yOffset = Math.sin(angle) * radius;

        
        const buildingHeight = Math.log(component.totalLines) * (Math.sqrt(component.totalLines)) / 4;
        // const buildingHeight = Math.log(component.totalLines) * (Math.sqrt(component.totalLines)) *1.5;
        const statements = component.methods + component.methods;
        // let width:number =  Math.log(statements*0.0001) + Math.sqrt(statements) + 10;
        let width:number =  Math.log(statements*0.00005) + Math.sqrt(statements) + 10;
        
        if(width > fileNode.width/2){
            width = fileNode.width/2;
        }
        const geometry = new THREE.BoxGeometry(width, width, buildingHeight);
        
        //borders
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        
        const color = getColorBasedOnCoverage(component.testPercent);
        const material = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5, metalness: 0.0 });
        const building = new THREE.Mesh(geometry, material);

        building.position.set(centerX + xOffset, centerY + yOffset, z + buildingHeight / 2);
        if(components.length == 1){
            building.position.set(centerX, centerY, z + buildingHeight / 2);
        }
        wireframe.position.copy(building.position);

        clickableBuildings.push(building);
        building.userData = component;

        scene.add(building);
        scene.add(wireframe);
    });
}

// export function createBuildings(scene: THREE.Scene, components: Component[], fileNode: TreemapNode, z: number): void {
//     const totalArea = components.reduce((sum, comp) => sum + comp.totalLines, 0);
//     let offsetX = fileNode.x;
//     let offsetY = fileNode.y;
//     let rowHeight = 0;

//     for (const component of components) {
//         const fraction = component.totalLines / totalArea;
//         const nodeWidth = fileNode.width * fraction;
//         const nodeHeight = fileNode.height * fraction;

//         if (offsetX + nodeWidth > fileNode.x + fileNode.width) {
//             offsetX = fileNode.x;
//             offsetY += rowHeight;
//             rowHeight = 0;
//         }

//         const buildingHeight = component.totalLines / 10; // Scale height for better visualization
//         const geometry = new THREE.BoxGeometry(nodeWidth, nodeHeight, buildingHeight);
//         const material = new THREE.MeshStandardMaterial({ color: 0xFF00FF, roughness: 0.5, metalness: 0.3 });
//         const building = new THREE.Mesh(geometry, material);

//         building.position.set(
//             offsetX + nodeWidth / 2,
//             offsetY + nodeHeight / 2,
//             z + buildingHeight / 2
//         );

//         scene.add(building);

//         offsetX += nodeWidth;
//         rowHeight = Math.max(rowHeight, nodeHeight);
//     }
// }

// export function createBuildings(scene: THREE.Scene, components: Component[], fileNode: TreemapNode, z: number): void {
    
//     console.log(components);
//     for (const component of components) {
//         const buildingHeight = component.totalLines * 10;
//         const geometry = new THREE.BoxGeometry(fileNode.width/2, fileNode.height/2, buildingHeight);
//         const material = new THREE.MeshStandardMaterial({ color: 0xff00ff, roughness: 0.5, metalness: 0.3 });
//         const building = new THREE.Mesh(geometry, material);

//         building.position.set(
//             fileNode.x + fileNode.width / 2,
//             fileNode.y + fileNode.height / 2,
//             z + buildingHeight / 2
//         );

//         scene.add(building);
//     }
// }
