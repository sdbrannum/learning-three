import * as THREE from "three";
import WorldScene from "../WorldScene";
import IDisposable from "../interfaces/IDisposable";
import * as fontJson from "three/examples/fonts/gentilis_regular.typeface.json";

export default class Text extends WorldScene {
    text: THREE.Mesh;
    parent: THREE.Object3D;

    constructor() {
        super();

        this.scene = new THREE.Scene();
        this.scene.name = "text";
        // this.scene.background = new THREE.Color(0x000000);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z += 40;

        // turn caching on
        THREE.Cache.enabled = true;
        const textGeometry = this.loadFont("Hello World!");
        const textMaterial = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide
        });

        // random color
        const hue = Math.random();
        const saturation = 1;
        const luminance = 0.5;
        textMaterial.color.setHSL(hue, saturation, luminance);

        this.text = new THREE.Mesh(textGeometry, textMaterial);

        // change the center of rotation from the left edge to the actual center of the text
        textGeometry.computeBoundingBox();
        textGeometry.boundingBox
            .getCenter(this.text.position)
            .multiplyScalar(-1);
        this.parent = new THREE.Object3D();
        this.parent.add(this.text);
        this.parent.position.x = 0.5;
        this.parent.position.y = 0;

        this.scene.add(this.parent);

        // save ref to resources to dispose later
        this.resources = new Set<IDisposable>([textGeometry, textMaterial]);
    }

    loadFont(text: string): THREE.TextGeometry {
        const font = new THREE.Font(fontJson);

        return new THREE.TextGeometry(text, {
            font: font,
            size: 3.0,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5
        });
    }

    animate(renderer: THREE.WebGLRenderer): void {
        this.parent.rotation.x += 0.01;
        this.parent.rotation.y += 0.01;

        renderer.render(this.scene, this.camera);

        this.animationId = requestAnimationFrame(() => this.animate(renderer));
    }

    addEvents(): void {}
    removeEvents(): void {}
}
