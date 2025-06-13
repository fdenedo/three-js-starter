import * as THREE from 'three';
import Experience from './Experience';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

function defaultInstance(aspectRatio: number): THREE.PerspectiveCamera {
    return new THREE.PerspectiveCamera(
        75,
        aspectRatio,
        0.1,
        100
    );
}

export default class Camera {
    public instance: THREE.PerspectiveCamera;
    public controls!: OrbitControls;

    private canvas;
    private sizes;

    constructor() {
        const experience = Experience.instance;
        this.canvas = experience.canvas;
        this.sizes = experience.sizes;
        this.instance = defaultInstance(this.sizes.aspectRatio);
        
        this.instance.position.set(5, 3, 6);

        this.setOrbitControls();
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize() {
        this.instance.aspect = this.sizes.aspectRatio;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controls?.update();
    }
}