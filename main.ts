import { WEBGL } from "three/examples/jsm/WebGL.js";

import { cube, lines, aviator } from "./src/index";

checkWebGLCompatAndRun();

function checkWebGLCompatAndRun(): void {
    if (WEBGL.isWebGLAvailable()) {
        // Initiate function or other initializations here
        aviator();
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        document.body.appendChild(warning);
    }
}
