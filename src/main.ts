import { WEBGL } from "three/examples/jsm/WebGL.js";

import { World, Lines, Cube, CubeWLight, Text, Aviator } from "./index";
import Sea from "./aviator/Sea";
import Sky from "./aviator/Sky";
import Pilot from "./aviator/Pilot";
import Airplane from "./aviator/Airplane";

(function() {
    const worldEl = document.getElementById("world");
    const canvasEl = worldEl.querySelector(
        "#world-canvas"
    ) as HTMLCanvasElement;

    if (WEBGL.isWebGLAvailable()) {
        const world = new World(worldEl, canvasEl);
        world.addScene(new Lines());
        world.addScene(new Cube());
        world.addScene(new CubeWLight());
        world.addScene(new Text());

        const sea = new Sea();
        sea.mesh.position.y = -600;

        const sky = new Sky(20);
        sky.mesh.position.y = -600;

        const pilot = new Pilot();
        pilot.mesh.position.set(-10, 27, 0);

        const airplane = new Airplane(pilot);
        airplane.mesh.scale.set(0.25, 0.25, 0.25);
        airplane.mesh.position.y = 100;

        world.addScene(new Aviator(sea, sky, airplane));
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        worldEl.appendChild(warning);
    }
})();
