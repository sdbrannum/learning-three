import { WebGLRenderer, Scene } from "three";
import IScene from "./interfaces/IScene";

/**
 * Manager for scenes that takes care of
 * * mounting the renderer to the dom
 * * changing scenes
 * * calling dispose methods
 */
export default class World {
    renderer: WebGLRenderer;
    private _sceneSelector: HTMLSelectElement;
    private _scenes: IScene[] = [];
    private _currentScene: IScene;

    constructor(canvasEl: HTMLCanvasElement) {
        this.renderer = new WebGLRenderer({
            canvas: canvasEl,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight, false);
        // enable shadow rendering
        this.renderer.shadowMap.enabled = true;
        // high dpi
        // this.renderer.setPixelRatio(
        //     window.devicePixelRatio ? window.devicePixelRatio : 1
        // );

        // scene selector
        this._sceneSelector = document.getElementById(
            "scene-selector"
        ) as HTMLSelectElement;

        this._sceneSelector.addEventListener(
            "change",
            this.onSceneSelectorChange.bind(this)
        );

        window.addEventListener("resize", this.onWindowResize);
    }

    /**
     * Add scene to world without rendering it
     * @param sceneName
     * @param scene
     */
    addScene(sceneName: string, scene: IScene): void {
        if (scene.id === undefined) {
            throw new Error("Scene missing id");
        }
        this._scenes.push(scene);
        const option = this.generateOptionEl(scene.id, sceneName);
        this._sceneSelector.appendChild(option);

        // set default first scene
        if (this._currentScene === undefined) {
            this.changeScene(scene.id);
            this._sceneSelector.value = `${scene.id}`;
        }
    }

    /**
     * Render the scene of the given id and cleanup old resources
     * @param id id of the scene to change to
     */
    changeScene(id: number): void {
        // clean-up current resources
        this.renderer.clear();
        if (this._currentScene !== undefined) {
            this._currentScene.removeEvents();
            this._currentScene.dispose();
        }

        // render new scene
        this._currentScene = this._scenes.find(scene => scene.id === id);
        this.renderer.render(
            this._currentScene.scene,
            this._currentScene.camera
        );
        this._currentScene.addEvents();
        this._currentScene.animate(this.renderer);
    }

    /**
     * Event handler for scene selector being changed
     * @param evt
     */
    onSceneSelectorChange(evt: Event): void {
        const sceneId = (evt.currentTarget as HTMLSelectElement).value;
        this.changeScene(+sceneId);
    }

    onWindowResize(evt: Event): void {
        if (this._currentScene !== undefined) {
            this.renderer.setSize(window.innerWidth, window.innerHeight, false);
            const canvas = this.renderer.domElement;
            this._currentScene.camera.aspect =
                canvas.clientWidth / canvas.clientHeight;
            this._currentScene.camera.updateProjectionMatrix();
        }
    }

    /**
     * Helper method to generate HTMLOptionElements
     * @param value value of option
     * @param label label for option
     * @remarks used to generate scene options
     */
    private generateOptionEl(
        value: string | number,
        label: string
    ): HTMLOptionElement {
        const el = document.createElement("option");
        el.setAttribute("value", String(value));
        const textNode = document.createTextNode(label);
        el.appendChild(textNode);
        return el;
    }
}
