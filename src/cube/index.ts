import * as THREE from "three";

export default function(): void {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, // FOV in degrees: extent of scene which is shown on screen
        window.innerWidth / window.innerHeight, // aspect ratio
        0.1, // near: objects closer than this won't render
        1000 // far: objects further away won't render
    );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    // add canvas element to dom
    document.body.appendChild(renderer.domElement);

    // create box
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // zoom out slightly so the cube and camera don't clash
    camera.position.z = 5;

    // animation loop
    const animate = (): void => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };

    animate();
}
