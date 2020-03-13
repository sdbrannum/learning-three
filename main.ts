import { WEBGL } from "three/examples/jsm/WebGL.js";

import { World, Cube, Lines, Aviator, CubeWLight } from "./src/index";
import Sea from "./src/aviator/Sea";
import Sky from "./src/aviator/Sky";
import Pilot from "./src/aviator/Pilot";
import Airplane from "./src/aviator/Airplane";

(function() {
    const worldEl = document.getElementById("world");
    const canvasEl = worldEl.querySelector(
        "#world-canvas"
    ) as HTMLCanvasElement;

    if (WEBGL.isWebGLAvailable()) {
        const world = new World(canvasEl);
        world.addScene("Line", new Lines());
        world.addScene("Cube", new Cube());
        world.addScene("Cube w/ Light", new CubeWLight());

        const sea = new Sea();
        sea.mesh.position.y = -600;

        const sky = new Sky(20);
        sky.mesh.position.y = -600;

        const pilot = new Pilot();
        pilot.mesh.position.set(-10, 27, 0);

        const airplane = new Airplane(pilot);
        airplane.mesh.scale.set(0.25, 0.25, 0.25);
        airplane.mesh.position.y = 100;

        world.addScene("Aviator", new Aviator(sea, sky, airplane));
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        worldEl.appendChild(warning);
    }
})();
