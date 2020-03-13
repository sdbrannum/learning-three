import { WebGLRenderer, Scene } from "three";
import IWorldScene from "./interfaces/IWorldScene";

/**
 * Manager for scenes that takes care of
 * * mounting the renderer to the dom
 * * changing scenes
 * * calling dispose methods
 */
export default class World {
    worldDomEl: HTMLElement;
    canvasDomEl: HTMLCanvasElement;
    renderer: WebGLRenderer;
    private _sceneSelector: HTMLSelectElement;
    private _scenes: IWorldScene[] = [];
    private _currentScene: IWorldScene;

    constructor(worldDomEl: HTMLElement) {
        this.worldDomEl = worldDomEl;
        this.canvasDomEl = this.worldDomEl.querySelector(
            "#world-canvas"
        ) as HTMLCanvasElement;

        this.renderer = new WebGLRenderer({
            canvas: this.canvasDomEl,
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
     * @param worldScene
     */
    addScene(worldScene: IWorldScene): void {
        if (worldScene.scene.id === undefined) {
            throw new Error("Scene missing id");
        }
        if (worldScene.scene.name === undefined) {
            throw new Error("Scene not named");
        }
        this._scenes.push(worldScene);
        const option = this.generateOptionEl(
            worldScene.scene.id,
            this.normalizeCamelCase(worldScene.scene.name)
        );
        this._sceneSelector.appendChild(option);

        // set default first scene
        if (this._currentScene === undefined) {
            this.changeScene(worldScene.scene.id);
            this._sceneSelector.value = `${worldScene.scene.id}`;
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
            const oldSceneName = this._currentScene.scene.name;
            if (oldSceneName !== undefined) {
                this.worldDomEl.classList.remove(oldSceneName);
            }
            this._currentScene.removeEvents();
            this._currentScene.dispose();
        }

        // render new scene
        this._currentScene = this._scenes.find(scene => scene.scene.id === id);

        const newSceneName = this._currentScene.scene.name;
        if (newSceneName !== undefined) {
            this.worldDomEl.classList.add(newSceneName);
        }

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

    /**
     * Turn camelCase string to Camel Case
     * @param strToCamelCase
     * @remarks https://stackoverflow.com/questions/4149276/how-to-convert-camelcase-to-camel-case
     */
    private normalizeCamelCase(strToCamelCase: string): string {
        return (
            strToCamelCase
                // insert a space before all caps
                .replace(/([A-Z])/g, " $1")
                // uppercase the first character
                .replace(/^./, function(str) {
                    return str.toUpperCase();
                })
        );
    }
}
