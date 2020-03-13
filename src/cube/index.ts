import * as THREE from "three";
import WorldScene from "../WorldScene";
import IDisposable from "../interfaces/IDisposable";

export default class Cube extends WorldScene {
    cube: THREE.Mesh;

    constructor(renderer: THREE.WebGLRenderer) {
        super(renderer);
        this.scene = new THREE.Scene();
        this.id = this.scene.id;

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

    animate(): void {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);

        // save animation loop id so we can cancel it
        this.animationId = requestAnimationFrame(
            () => this.animate()
            // this.animate.bind(this, renderer)
        );
    }
}
