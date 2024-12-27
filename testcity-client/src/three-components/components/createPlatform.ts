
import * as THREE from "three";
import { TreemapNode } from "../structures/treemap";

export function createPlatform(scene: THREE.Scene, node: TreemapNode, z: number): void {
    const color = node.children
    ? (node.x === 0 && node.y === 0) //main platform
        ? 0xbdbdbd //light gray for subdirectories
        : 0x757575//dark gray for the main platform
    : 0x0000ff;
    
    const geometry = new THREE.BoxGeometry(
        (color === 0x0000ff) ? node.width*0.93
            : (color === 0x757575) ? node.width*0.98 : node.width, 
        (color === 0x0000ff) ? node.height*0.93 
            :  (color === 0x757575) ? node.height : node.height, 
        1);
    // const geometry = new THREE.BoxGeometry(node.width - 0.5, node.height - 0.5, 1);
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.3 });
    const platform = new THREE.Mesh(geometry, material);

    const edges = new THREE.EdgesGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);

    platform.position.set(node.x + node.width / 2, node.y + node.height / 2, z);
    wireframe.position.copy(platform.position);

    scene.add(platform);
    scene.add(wireframe);

    if (node.children) {
        for (const child of node.children) {
            createPlatform(scene, child, z + 1);
        }
    }
}