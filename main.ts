import { WEBGL } from "three/examples/jsm/WebGL.js";

import { World, Cube, Lines, aviator } from "./src/index";

(function() {
    const worldElement = document.getElementById("world");

    if (WEBGL.isWebGLAvailable()) {
        const world = new World(worldElement);
        world.addScene("Line", new Lines());
        world.addScene("Cube", new Cube());
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        worldElement.appendChild(warning);
    }
})();
