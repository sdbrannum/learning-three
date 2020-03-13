import * as THREE from "three";
import IDisposable from "../interfaces/IDisposable";
import WorldScene from "../WorldScene";

export default class Lines extends WorldScene {
    constructor() {
        super();

        this.scene = new THREE.Scene();
        this.id = this.scene.id;
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            1,
            500
        );
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(0, 0, 0);

        // line
        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const points = [
            new THREE.Vector3(-10, 0, 0),
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(10, 0, 0)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const line = new THREE.Line(geometry, material);

        // store ref to resources for disposal
        this.resources = new Set<IDisposable>([material, geometry, this.scene]);

        // add to scene
        this.scene.add(line);
    }

    animate(renderer: THREE.WebGLRenderer): void {}
    addEvents(): void {}
    removeEvents(): void {}
}
