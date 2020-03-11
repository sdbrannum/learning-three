import * as THREE from "three";
import colors from "./colors";

/**
 * Clouds are created by generating random number of
 * cubes and assembling them together
 */
export default class Cloud {
    geometry: THREE.BoxGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Object3D;

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
    }
}
