import { WEBGL } from "three/examples/jsm/WebGL.js";

import { World, Cube, Lines, aviator, CubeWLight } from "./src/index";

(function() {
    const worldElement = document.getElementById("world");

    if (WEBGL.isWebGLAvailable()) {
        const world = new World(worldElement);
        world.addScene("Line", new Lines());
        world.addScene("Cube", new Cube());
        world.addScene("Cube w/ Light", new CubeWLight());
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        worldElement.appendChild(warning);
    }
})();
