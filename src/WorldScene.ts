import IScene from "./interfaces/IScene";
import IDisposable from "./interfaces/IDisposable";

/**
 * Base class of all scenes
 */
export default abstract class WorldScene implements IScene {
    id: number;
    animationId: number;
    scene: import("three").Scene;
    camera: import("three").PerspectiveCamera;
    resources: Set<IDisposable>;

    abstract animate(renderer: THREE.WebGLRenderer): void;

    dispose(): void {
        // cancel animation
        if (this.animationId !== undefined) {
            window.cancelAnimationFrame(this.animationId);
        }

        if (this.resources === undefined) {
            throw new Error("Resources were never defined.");
        }

        // dispose of three resources
        for (const resource of this.resources) {
            resource.dispose();
        }
        this.resources.clear();
    }
}
