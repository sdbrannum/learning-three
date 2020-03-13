import { WEBGL } from "three/examples/jsm/WebGL.js";

import { World, Cube, Lines, aviator, CubeWLight } from "./src/index";

(function() {
    const worldEl = document.getElementById("world");
    const canvasEl = worldEl.querySelector(
        "#world-canvas"
    ) as HTMLCanvasElement;

    if (WEBGL.isWebGLAvailable()) {
        const world = new World(canvasEl);
        world.addScene("Line", new Lines(world.renderer));
        world.addScene("Cube", new Cube(world.renderer));
        world.addScene("Cube w/ Light", new CubeWLight(world.renderer));
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        worldEl.appendChild(warning);
    }
})();
