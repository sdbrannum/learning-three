import IDisposable from "./IDisposable";
import * as THREE from "three";

export default interface IWorldScene {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    resources: Set<IDisposable>;

    animate(renderer: THREE.WebGLRenderer): void;
    addEvents(): void;
    removeEvents(): void;
    dispose(): void;
}
