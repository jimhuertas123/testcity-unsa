import { useEffect, useRef } from "react";
import * as THREE from "three";
import { widthScreen } from "../hooks/widthScreen";
import { heightScreen } from "../hooks/heightScreen";

export const MainThree = () => {
    const refContainer = useRef<HTMLDivElement>(null);

    const { width } = widthScreen();
    const { height } = heightScreen();

    useEffect(() => {
        let scene: THREE.Scene = new THREE.Scene();
        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        let renderer = new THREE.WebGLRenderer();

        renderer.setSize(window.innerWidth, window.innerHeight);

        if (refContainer.current) {
            refContainer.current.appendChild(renderer.domElement);
        }

        let geometry = new THREE.BoxGeometry(1, 1, 1);
        let material = new THREE.MeshBasicMaterial({ 
            color: 0xaa3324,
            wireframe: true
        });
        let cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 2;

        let animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };

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
            if (refContainer.current) {
                refContainer.current.removeChild(renderer.domElement);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [width, height]);

    return <div className="city-view" ref={refContainer} />;
};