import * as THREE from "three";
import colors from "./colors";

export default class Pilot {
    mesh: THREE.Object3D;
    hairAngle: number;
    hairTop: THREE.Object3D;

    constructor() {
        this.mesh = new THREE.Object3D();
        this.mesh.name = "pilot";

        // used to animate hair later
        this.hairAngle = 0;

        // Body of the pilot
        const bodyGeometry = new THREE.BoxGeometry(15, 15, 15);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: colors.brown,
            flatShading: true
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(2, -12, 0);
        this.mesh.add(body);

        // pilot's face
        const faceGeometry = new THREE.BoxGeometry(10, 10, 10);
        const faceMaterial = new THREE.MeshLambertMaterial({
            color: colors.pink
        });
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        this.mesh.add(face);

        // hair
        const hairGeometry = new THREE.BoxGeometry(4, 4, 4);
        const hairMaterial = new THREE.MeshLambertMaterial({
            color: colors.brown
        });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);

        // align the shape of the hair to its bottom boundary, that will make it easier to scale.
        hair.geometry.applyMatrix4(
            new THREE.Matrix4().makeTranslation(0, 2, 0)
        );

        // create a container for the hair
        const hairContainer = new THREE.Object3D();

        // create a container for the hairs at the top
        // of the head (the ones that will be animated)
        this.hairTop = new THREE.Object3D();

        // create the hairs at the top of the head
        // and position them on a 3 x 4 grid
        for (let i = 0; i < 12; i++) {
            const h = hair.clone();
            const col = i % 3;
            const row = Math.floor(i / 3);
            const startPosZ = -4;
            const startPosX = -4;
            h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
            this.hairTop.add(h);
        }
        hairContainer.add(this.hairTop);

        // create the hairs at the side of the face
        const hairSideGeometry = new THREE.BoxGeometry(12, 4, 2);
        hairSideGeometry.applyMatrix4(
            new THREE.Matrix4().makeTranslation(-6, 0, 0)
        );
        const hairSideR = new THREE.Mesh(hairSideGeometry, hairMaterial);
        const hairSideL = hairSideR.clone();
        hairSideR.position.set(8, -2, 6);
        hairSideL.position.set(8, -2, -6);
        hairContainer.add(hairSideR);
        hairContainer.add(hairSideL);

        // create the hairs at the back of the head
        const hairBackGeometry = new THREE.BoxGeometry(2, 8, 10);
        const hairBack = new THREE.Mesh(hairBackGeometry, hairMaterial);
        hairBack.position.set(-1, -4, 0);
        hairContainer.add(hairBack);
        hairContainer.position.set(-5, 5, 0);

        this.mesh.add(hairContainer);

        // glasses
        const glassGeometry = new THREE.BoxGeometry(5, 5, 5);
        const glassMaterial = new THREE.MeshLambertMaterial({
            color: colors.black
        });
        const glassR = new THREE.Mesh(glassGeometry, glassMaterial);
        glassR.position.set(6, 0, 3);
        const glassL = glassR.clone();
        glassL.position.z = -glassR.position.z;

        const glassAGeometry = new THREE.BoxGeometry(11, 1, 11);
        const glassA = new THREE.Mesh(glassAGeometry, glassMaterial);
        this.mesh.add(glassR);
        this.mesh.add(glassL);
        this.mesh.add(glassA);

        // ears
        const earGeometry = new THREE.BoxGeometry(2, 3, 2);
        const earL = new THREE.Mesh(earGeometry, faceMaterial);
        earL.position.set(0, 0, -6);
        const earR = earL.clone();
        earR.position.set(0, 0, 6);
        this.mesh.add(earL);
        this.mesh.add(earR);
    }

    animateHair(): void {
        // get the hair
        const hairs = this.hairTop.children;

        // update them according to the angle hairAngle
        const l = hairs.length;
        for (let i = 0; i < l; i++) {
            const h = hairs[i];
            // each hair element will scale on cyclical basis between 75% and 100% of its original size
            h.scale.y = 0.75 + Math.cos(this.hairAngle + i / 3) * 0.25;
        }
        // increment the angle for the next frame
        this.hairAngle += 0.16;
    }
}
