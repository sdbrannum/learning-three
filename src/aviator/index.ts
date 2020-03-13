import * as THREE from "three";
import WorldScene from "../WorldScene";
import Sea from "./Sea";
import Sky from "./Sky";
import Airplane from "./Airplane";
import ICoordinates from "../interfaces/ICoordinates";

export default class Aviator extends WorldScene {
    sea: Sea;
    sky: Sky;
    airplane: Airplane;
    mousePosition: ICoordinates;

    constructor(sea: Sea, sky: Sky, airplane: Airplane) {
        super();
        this.sea = sea;
        this.sky = sky;
        this.airplane = airplane;
        this.mousePosition = { x: 0, y: 0 };
        this.createScene();
        this.createLights();
    }

    /**
     * @returns {number} Scene Id
     */
    createScene(): number {
        const sceneHeight = window.innerHeight;
        const sceneWidth = window.innerWidth;

        this.scene = new THREE.Scene();
        this.scene.name = "aviator";

        // fog effect
        this.scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

        // camera
        const aspectRatio = sceneWidth / sceneHeight;
        const fov = 60;
        const nearPlane = 1;
        const farPlane = 10000;
        this.camera = new THREE.PerspectiveCamera(
            fov,
            aspectRatio,
            nearPlane,
            farPlane
        );

        // camera position
        this.camera.position.x = 0;
        this.camera.position.y = 100;
        this.camera.position.z = 200;

        // add objects
        this.scene.add(this.sea.mesh);
        this.scene.add(this.sky.mesh);
        this.scene.add(this.airplane.mesh);

        return this.scene.id;
    }

    createLights(): void {
        /**
         * a hemisphere light is a gradient colored light;
         * first param: sky color, second param: ground color
         * third param: intensity of light
         */
        const hemisphereLight = new THREE.HemisphereLight(
            0xaaaaaa,
            0x000000,
            0.9
        );

        // an ambient light modifies the global color of a scene and makes the shadows softer
        const ambientLight = new THREE.AmbientLight(0xdc8874, 0.25);

        /**
         * a directional light shines from a specific direction like the sun
         */
        const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

        // set direction of light
        shadowLight.position.set(150, 350, 350);

        // shadow casting
        shadowLight.castShadow = true;

        // define visible area of the projected shadow
        shadowLight.shadow.camera.left = -400;
        shadowLight.shadow.camera.right = 400;
        shadowLight.shadow.camera.top = 400;
        shadowLight.shadow.camera.bottom = -400;
        shadowLight.shadow.camera.near = 1;
        shadowLight.shadow.camera.far = 1000;

        // define resolution of the shadow, higher = better but more expensive
        shadowLight.shadow.mapSize.width = 2048;
        shadowLight.shadow.mapSize.height = 2048;

        // activate the lights
        this.scene.add(hemisphereLight);
        this.scene.add(ambientLight);
        this.scene.add(shadowLight);
    }

    animate(renderer: THREE.WebGLRenderer): void {
        // rotate the sea and the sky
        this.sea.mesh.rotation.z += 0.005;
        this.sky.mesh.rotation.z += 0.01;

        // update airplane
        const targetX = this.rescale(
            this.mousePosition.x,
            -0.75,
            0.75,
            -100,
            100
        );
        const targetY = this.rescale(
            this.mousePosition.y,
            -0.75,
            0.75,
            25,
            175
        );
        this.airplane.animate(targetX, targetY, 0.3);

        // update sea
        this.sea.animateWaves();

        // render the scene
        renderer.render(this.scene, this.camera);

        // call the loop function again
        this.animationId = requestAnimationFrame(
            this.animate.bind(this, renderer)
        );
    }

    addEvents(): Aviator {
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        return this;
    }

    removeEvents(): void {
        window.removeEventListener("mousemove", this.onMouseMove);
    }

    onMouseMove(event: MouseEvent): void {
        /**
         * normalize mouse position between -1 and 1;
         * horizontal axis
         */
        const tx = -1 + (event.clientX / window.innerWidth) * 2;

        /** inverse above formula for y-axis*/
        const ty = 1 - (event.clientY / window.innerHeight) * 2;

        // update mouse position
        this.mousePosition = { x: tx, y: ty };
    }

    /**
     * Scale a number from an old range to a new range
     * @param unscaled
     * @param oldMin
     * @param oldMax
     * @param newMin
     * @param newMax
     * @remarks https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
     * @remarks used to scale mouse positioning
     */
    private rescale(
        unscaled: number,
        oldMin: number,
        oldMax: number,
        newMin: number,
        newMax: number
    ): number {
        // (b - a) (x - min)
        // -----------------  + a
        //    (max - min)
        return (
            ((newMax - newMin) * (unscaled - oldMin)) / (oldMax - oldMin) +
            newMin
        );
    }

    dispose(): void {
        // cancel animation
        if (this.animationId !== undefined) {
            window.cancelAnimationFrame(this.animationId);
        }

        this.sea.dispose();
        this.airplane.dispose();
        this.sky.dispose();
    }
}
