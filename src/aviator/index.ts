/**
 * Tutorial by Karim Maaloul
 * http://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
 */

import Airplane from "./Airplane";
import Sea from "./Sea";
import Sky from "./Sky";
import Pilot from "./Pilot";
import Aviator from "./Aviator";

export default function() {
    const sea = new Sea();
    sea.mesh.position.y = -600;

    const sky = new Sky(20);
    sky.mesh.position.y = -600;

    const pilot = new Pilot();
    pilot.mesh.position.set(-10, 27, 0);

    const airplane = new Airplane(pilot);
    airplane.mesh.scale.set(0.25, 0.25, 0.25);
    airplane.mesh.position.y = 100;

    // set up the scene, the camera and the renderer, and animate it
    new Aviator(sea, sky, airplane)
        .createScene()
        .createLights()
        .addEvents()
        .animate();
}
