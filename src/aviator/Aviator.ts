import * as THREE from "three";
import Sea from "./Sea";
import Sky from "./Sky";
import Airplane from "./Airplane";
import ICoordinates from "../interfaces/ICoordinates";

export default class Aviator {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    sea: Sea;
    sky: Sky;
    airplane: Airplane;
    mousePosition: ICoordinates;

    constructor(sea: Sea, sky: Sky, airplane: Airplane) {
        this.sea = sea;
        this.sky = sky;
        this.airplane = airplane;
        this.mousePosition = { x: 0, y: 0 };
    }

    createScene(): Aviator {
        const sceneHeight = window.innerHeight;
        const sceneWidth = window.innerWidth;

        this.scene = new THREE.Scene();

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

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            // allow transparency to show the gradient background we defined in css
            alpha: true,
            // activate antialiasing; less performant, but low poly should be fine
            antialias: true
        });

        this.renderer.setSize(sceneWidth, sceneHeight);

        // high dpi
        // this.renderer.setPixelRatio(
        //     window.devicePixelRatio ? window.devicePixelRatio : 1
        // );

        // enable shadow rendering
        this.renderer.shadowMap.enabled = true;

        // canvas
        document.body.appendChild(this.renderer.domElement);

        // add objects
        this.scene.add(this.sea.mesh);
        this.scene.add(this.sky.mesh);
        this.scene.add(this.airplane.mesh);

        return this;
    }

    createLights(): Aviator {
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

        return this;
    }

    addEvents(): Aviator {
        const onWindowResize = (): void => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerHeight / window.innerHeight;
            this.camera.updateProjectionMatrix();
        };

        const onMouseMove = (event: MouseEvent): void => {
            /**
             * normalize mouse position between -1 and 1;
             * horizontal axis
             */
            const tx = -1 + (event.clientX / window.innerWidth) * 2;

            /** inverse above formula for y-axis*/
            const ty = 1 - (event.clientY / window.innerHeight) * 2;

            // update mouse position
            this.mousePosition = { x: tx, y: ty };
        };

        window.addEventListener("resize", onWindowResize);
        window.addEventListener("mousemove", onMouseMove);

        return this;
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
    rescale(
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

    animate(): void {
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
        this.renderer.render(this.scene, this.camera);

        // call the loop function again
        requestAnimationFrame(this.animate.bind(this));
    }
}
