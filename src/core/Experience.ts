import * as THREE from 'three';

import Time from './Time';
import { ExperienceContract } from "./types";
import Sizes from './utils/sizes';
import World from '../world/World';
import Resources from './Resources';
import Debug from './Debug';
import sources from '../sources';
import Camera from './Camera';
import Renderer from './Renderer';

export default class Experience implements ExperienceContract {
    static instance: Experience; // Singleton

    public canvas!: HTMLCanvasElement;
    public sizes!: Sizes;
    public time!: Time;
    public scene!: THREE.Scene;
    public camera!: Camera;
    public resources!: Resources;
    public debug!: Debug;
    public world?: World;
    
    private renderer!: Renderer;

    constructor(canvas: HTMLCanvasElement) {
        if (Experience.instance) {
            return Experience.instance;
        }
        Experience.instance = this;

        /* @ts-ignore */
        window.experience = this;

        this.canvas = canvas;

        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.debug = new Debug();

        this.resources = new Resources(sources);

        this.sizes.on('resize', () => this.resize());
        this.time.on('tick', () => this.update());
    }

    public init() {
        this.time.start();
    }

    public loadWorld(world: World): void {
        if (this.world) {
            this.world.destroy();
        }

        this.world = world;
    }

    public destroy(): void {
        this.time.stop();
        this.time.off('tick');
        this.sizes.off('resize');

        this.world?.destroy();
        this.camera.controls.dispose();
        this.renderer.instance.dispose();

        if (this.debug.active) {
            this.debug.pane?.dispose();
        }
    }

    private resize(): void {
        this.camera.resize();
        this.renderer.resize();
    }

    private update(): void {
        this.camera.update();
        this.world?.update(this.time.delta, this.time.elapsed);
        this.renderer.update();
    }
}