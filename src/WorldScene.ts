import * as THREE from "three";
import IScene from "./interfaces/IScene";
import IDisposable from "./interfaces/IDisposable";

/**
 * Base class of all scenes
 */
export default abstract class WorldScene implements IScene {
    id: number;
    renderer: THREE.WebGLRenderer;
    animationId: number;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    resources: Set<IDisposable>;

    constructor(renderer: THREE.WebGLRenderer) {
        this.renderer = renderer;
    }

    abstract animate(): void;

    /** cancel animation and dispose of resources */
    dispose(): void {
        // cancel animation
        if (this.animationId !== undefined) {
            window.cancelAnimationFrame(this.animationId);
        }

        // dispose of three resources
        if (this.resources === undefined) {
            throw new Error("Resources were never defined.");
        }

        for (const resource of this.resources) {
            resource.dispose();
        }
        this.resources.clear();
    }
}
