import * as THREE from "three";
import colors from "./colors";
import { CylinderGeometry } from "three";
import IDisposable from "../interfaces/IDisposable";

interface Wave {
    y: number;
    x: number;
    z: number;
    angle: number;
    amplitude: number;
    speed: number;
}

export default class Sea implements IDisposable {
    geometry: THREE.CylinderGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    waves: Wave[];
    resources: Set<IDisposable>;

    constructor() {
        // radius top, radius bottom, height, # of segments on radius, # of segments vertically
        this.geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
        // rotate the geometry on the x axis
        this.geometry.applyMatrix4(
            new THREE.Matrix4().makeRotationX(-Math.PI / 2)
        );

        // generate waves
        const numOfVertices = this.geometry.vertices.length;
        this.waves = [];

        for (let i = 0; i < numOfVertices; i++) {
            const vertex = this.geometry.vertices[i];

            // store some data
            this.waves.push({
                y: vertex.y,
                x: vertex.x,
                z: vertex.z,
                // a random angle
                angle: Math.random() * Math.PI * 2,
                // a random distance
                amplitude: 5 + Math.random() * 15,
                // a random speed between 0.016 and 0.048 radians / frame
                speed: 0.016 + Math.random() * 0.032
            });
        }

        this.material = new THREE.MeshPhongMaterial({
            color: colors.blue,
            transparent: true,
            opacity: 0.6,
            flatShading: true
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // allow the sea to receive shadows
        this.mesh.receiveShadow = true;

        // save ref to resources to dispose later
        this.resources = new Set<IDisposable>([this.geometry, this.material]);
    }

    animateWaves(): void {
        const vertices = (this.mesh.geometry as CylinderGeometry).vertices;
        const numOfVertices = vertices.length;

        for (let i = 0; i < numOfVertices; i++) {
            const vertex = vertices[i];
            const vertexData = this.waves[i];

            // update vertex position
            vertex.x =
                vertexData.x +
                Math.cos(vertexData.angle) * vertexData.amplitude;
            vertex.y =
                vertexData.y +
                Math.sin(vertexData.angle) * vertexData.amplitude;

            // increment angle for next frame
            vertexData.angle += vertexData.speed;
        }

        /**
         * Tell the renderer that the geometry of the sea has changed
         * In fact,in order to maintain the best level of performance
         * three.js caches the geometries and ignores any changes
         * unless we add this line
         */
        (this.mesh.geometry as CylinderGeometry).verticesNeedUpdate = true;

        this.mesh.rotation.z += 0.005;
    }

    dispose(): void {
        for (const resource of this.resources) {
            resource.dispose();
        }
        this.resources.clear();
    }
}
