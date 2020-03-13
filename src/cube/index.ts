import * as THREE from "three";
import WorldScene from "../WorldScene";
import IDisposable from "../interfaces/IDisposable";

export default class Cube extends WorldScene {
    cube: THREE.Mesh;

    constructor() {
        super();

        this.scene = new THREE.Scene();
        this.scene.name = "cube";

        this.camera = new THREE.PerspectiveCamera(
            75, // FOV in degrees: extent of scene which is shown on screen
            window.innerWidth / window.innerHeight, // aspect ratio
            0.1, // near: objects closer than this won't render
            1000 // far: objects further away won't render
        );

        // create box
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        // zoom out slightly so the cube and camera don't clash
        this.camera.position.z = 5;

        // save ref to resources
        this.resources = new Set<IDisposable>([geometry, material]);
    }

    animate(renderer: THREE.WebGLRenderer): void {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        renderer.render(this.scene, this.camera);

        // save animation loop id so we can cancel it
        this.animationId = requestAnimationFrame(
            () => this.animate(renderer)
            // this.animate.bind(this, renderer)
        );
    }

    addEvents(): void {}
    removeEvents(): void {}
}
