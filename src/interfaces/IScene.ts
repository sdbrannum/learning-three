import IDisposable from "./IDisposable";
import { WebGLRenderer } from "three";

export default interface IScene {
    id: number;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    resources: Set<IDisposable>;

    animate(renderer: THREE.WebGLRenderer): void;
    addEvents(): void;
    removeEvents(): void;
    dispose(): void;
}
