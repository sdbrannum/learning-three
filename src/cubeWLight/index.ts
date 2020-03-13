import * as THREE from "three";
import WorldScene from "../WorldScene";
import IDisposable from "../interfaces/IDisposable";

export default class CubeWLight extends WorldScene {
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
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        // zoom out slightly so the cube and camera don't clash
        this.camera.position.z = 5;

        // light
        const light = new THREE.DirectionalLight(0xffffff, 1);
        // left, up, behind camera towards 0,0,0
        light.position.set(-1, 2, 5);
        this.scene.add(light);

        // save ref to resources
        this.resources = new Set<IDisposable>([geometry, material]);
    }

    animate(): void {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
        this.animationId = requestAnimationFrame(
            // () => this.animate(renderer)
            this.animate.bind(this)
        );
    }
}
