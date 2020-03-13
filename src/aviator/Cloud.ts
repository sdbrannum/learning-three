import * as THREE from "three";
import colors from "./colors";
import IDisposable from "../interfaces/IDisposable";

/**
 * Clouds are created by generating random number of
 * cubes and assembling them together
 */
export default class Cloud implements IDisposable {
    geometry: THREE.BoxGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Object3D;
    resources: Set<IDisposable>;

    constructor() {
        this.geometry = new THREE.BoxGeometry(20, 20, 20);
        this.material = new THREE.MeshPhongMaterial({
            color: colors.white
        });

        this.mesh = new THREE.Object3D();

        // duplicate geometry random times
        const rand = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < rand; i++) {
            const m = new THREE.Mesh(this.geometry, this.material);

            // set position and rotation of each randomly
            m.position.x = i * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;

            const s = 0.1 + Math.random() * 0.9;
            m.scale.set(s, s, s);

            // allow each cube to case and receive shadows
            m.castShadow = true;
            m.receiveShadow = true;

            this.mesh.add(m);
        }

        // save ref to dispose of
        this.resources = new Set<IDisposable>([this.geometry, this.material]);
    }

    dispose(): void {
        for (const resource of this.resources) {
            resource.dispose();
        }
        this.resources.clear();
    }
}
