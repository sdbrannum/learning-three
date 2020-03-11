import * as THREE from "three";
import Cloud from "./Cloud";

export default class Sky {
    mesh: THREE.Object3D;

    constructor(numOfClouds: number) {
        this.mesh = new THREE.Object3D();

        // to distribute the clouds evenly we need to place them according to a uniform angle
        const stepAngle = (Math.PI * 2) / numOfClouds;

        // create the clouds
        for (let i = 0; i < numOfClouds; i++) {
            const cloud = new Cloud();

            // set rotation and position of each cloud
            const angle = stepAngle * i;
            // distance between center of axis and cloud
            const distance = 750 + Math.random() * 200;

            // convert distance and angle to coordinates
            cloud.mesh.position.y = Math.sin(angle) * distance;
            cloud.mesh.position.x = Math.cos(angle) * distance;

            // rotate cloud according to position
            cloud.mesh.rotation.z = angle + Math.PI / 2;

            // distribute them at random depths in the scene
            cloud.mesh.position.z = -400 - Math.random() * 400;

            // we also set a random scale for each cloud
            const scale = 1 + Math.random() * 2;
            cloud.mesh.scale.set(scale, scale, scale);

            // do not forget to add the mesh of each cloud in the scene
            this.mesh.add(cloud.mesh);
        }
    }
}
