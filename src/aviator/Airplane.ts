import * as THREE from "three";
import colors from "./colors";
import Pilot from "./Pilot";

export default class Airplane {
    mesh: THREE.Object3D;
    propeller: THREE.Mesh;

    constructor(pilot: Pilot) {
        this.mesh = new THREE.Object3D();

        // add pilot
        this.mesh.add(pilot.mesh);

        // cabin
        const geomCockpit = new THREE.BoxGeometry(80, 50, 50, 1, 1, 1);
        const matCockpit = new THREE.MeshPhongMaterial({
            color: colors.red,
            flatShading: true
        });

        // access specific vertex of a shape through the vertices array
        geomCockpit.vertices[4].y -= 10;
        geomCockpit.vertices[4].z += 20;
        geomCockpit.vertices[5].y -= 10;
        geomCockpit.vertices[5].z -= 20;
        geomCockpit.vertices[6].y += 30;
        geomCockpit.vertices[6].z += 20;
        geomCockpit.vertices[7].y += 30;
        geomCockpit.vertices[7].z -= 20;

        const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
        cockpit.castShadow = true;
        cockpit.receiveShadow = true;
        this.mesh.add(cockpit);

        // engine
        const geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
        const matEngine = new THREE.MeshPhongMaterial({
            color: colors.white,
            flatShading: true
        });
        const engine = new THREE.Mesh(geomEngine, matEngine);
        engine.position.x = 40;
        engine.castShadow = true;
        engine.receiveShadow = true;
        this.mesh.add(engine);

        // tail
        const geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
        const matTailPlane = new THREE.MeshPhongMaterial({
            color: colors.red,
            flatShading: true
        });
        const tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
        tailPlane.position.set(-35, 25, 0);
        tailPlane.castShadow = true;
        tailPlane.receiveShadow = true;
        this.mesh.add(tailPlane);

        // wing
        const geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
        const matSideWing = new THREE.MeshPhongMaterial({
            color: colors.red,
            flatShading: true
        });
        const sideWing = new THREE.Mesh(geomSideWing, matSideWing);
        sideWing.castShadow = true;
        sideWing.receiveShadow = true;
        this.mesh.add(sideWing);

        // propeller
        const geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
        const matPropeller = new THREE.MeshPhongMaterial({
            color: colors.brown,
            flatShading: true
        });
        this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
        this.propeller.castShadow = true;
        this.propeller.receiveShadow = true;

        // blades
        const geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
        const matBlade = new THREE.MeshPhongMaterial({
            color: colors.brownDark,
            flatShading: true
        });

        const blade = new THREE.Mesh(geomBlade, matBlade);
        blade.position.set(8, 0, 0);
        blade.castShadow = true;
        blade.receiveShadow = true;
        this.propeller.add(blade);
        this.propeller.position.set(50, 0, 0);
        this.mesh.add(this.propeller);
    }

    animate(x: number, y: number, propellerRotation: number): void {
        // Move the plane at each frame by adding a fraction of the remaining distance
        this.mesh.position.y += (y - this.mesh.position.y) * 0.1;

        // Rotate the plane proportionally to the remaining distance
        this.mesh.rotation.z = (y - this.mesh.position.y) * 0.0128;
        this.mesh.rotation.x = (this.mesh.position.y - y) * 0.0064;

        this.propeller.rotation.x += propellerRotation;
    }
}
