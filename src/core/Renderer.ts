import * as THREE from 'three';
import Experience from './Experience';
import Sizes from './utils/sizes';

function defaultInstance(canvas: HTMLCanvasElement, sizes: Sizes): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.toneMapping = THREE.CineonToneMapping;
    renderer.toneMappingExposure = 1.75;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x282828);
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.pixelRatio);

    return renderer;
}

export default class Renderer {
    public instance: THREE.WebGLRenderer;
    
    private canvas;
    private sizes;
    private scene;
    private camera;

    constructor() {
        const experience = Experience.instance;
        this.canvas = experience.canvas;
        this.sizes = experience.sizes;
        this.scene = experience.scene;
        this.camera = experience.camera;
        this.instance = defaultInstance(this.canvas, this.sizes);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
    }
    
    update() {
        this.instance.render(this.scene, this.camera.instance);
    }
}