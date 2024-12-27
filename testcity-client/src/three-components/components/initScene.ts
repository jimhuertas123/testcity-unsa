import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { DirectoryInfo } from "../../interface/typeStructureProjects.interface";
import { calculatePlatformSize, calculateTreemap } from "../structures/treemap";
import { createPlatform } from "./createPlatform";

export function initScene(data: DirectoryInfo) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 50, 100);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 500;

    const light = new THREE.PointLight(0xffffff, 1, 1000);
    light.position.set(50, 50, 100);
    scene.add(light);

    // Fondo claro para contraste
    scene.background = new THREE.Color(0xf0f0f0);

    // Crear la plataforma principal
    const mainSize = calculatePlatformSize(data.totalStatements);
    const mainPlatform = {
        name: data.directory,
        x: 0,
        y: 0,
        width: mainSize,
        height: mainSize,
        children: calculateTreemap(data.files, 0, 0, mainSize, mainSize),
    };

    createPlatform(scene, mainPlatform, 0);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    return {scene, camera, renderer, controls};
}