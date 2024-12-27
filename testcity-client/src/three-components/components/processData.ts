import * as THREE from "three";
import { Component, Components } from "../../interface/typeComponents.interface";
import { TreemapNode } from "../structures/treemap";
import { createBuildings } from "./createBuildings";

export function processNodesAndAddBuildings(
    scene: THREE.Scene,
    componentsData: any,
    nodes: TreemapNode[],
    z: number,
    clickableBuildings: THREE.Object3D[]
): void {

    console.log("COMPONENTS DATA: ", nodes);
    for (const node of nodes) {
        if (node.children) {
            const matchedData = componentsData.find((data: any) => {
                return data.path === node.name;
            });
            if (matchedData) {
                processNodesAndAddBuildings(scene, matchedData.components, node.children, z + 1, clickableBuildings);
            }
        } else {
            const componentData = componentsData.find((data: Components) => {
                return data.file === node.name}
            );
            if (componentData) {
                createBuildings(scene, componentData.components as Component[], node, z, clickableBuildings);
            }
        }
    }
}