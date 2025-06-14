import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "@core/utils/EventEmitter";

export interface Source {
    name: string;
    type: string;
    paths: string[];
}

export type ResourceType = "gltfModel" | "texture" | "cubeTexture"

export type LoadedResources = Record<string, GLTF | THREE.Texture | THREE.CubeTexture>;

export default class Resources extends EventEmitter {
    public sources: Source[];
    public items: LoadedResources = {};
    public toLoad: number;
    public loaded: number = 0;

    private loadingManager: THREE.LoadingManager;
    private loaders!: {
        gltfLoader: GLTFLoader;
        textureLoader: THREE.TextureLoader;
        cubeTextureLoader: THREE.CubeTextureLoader;
    };

    constructor(sources: Source[]) {
        super();

        this.sources = sources;
        this.toLoad = this.sources.length;

        this.loadingManager = new THREE.LoadingManager(
            // onLoad
            () => {
                console.log("All resources loaded!");
                this.trigger("ready");
            },
            // onProgress
            (itemUrl, itemsLoaded, itemsTotal) => {
                const progressRatio = itemsLoaded / itemsTotal;
                this.trigger("progress", [progressRatio, itemUrl]);
            },
            // onError
            (url) => {
                console.error(`There was an error loading ${url}`);
                this.trigger("error", [url]);
            }
        );

        this.setLoaders();
        this.startLoading();
    }

    private setLoaders(): void {
        this.loaders = {
            gltfLoader: new GLTFLoader(this.loadingManager),
            textureLoader: new THREE.TextureLoader(this.loadingManager),
            cubeTextureLoader: new THREE.CubeTextureLoader(this.loadingManager),
        };
    }

    private startLoading(): void {
        console.log("Starting to load resources...");
        if (this.sources.length === 0) {
            setTimeout(() => this.trigger("ready"));
            return;
        }

        for (const source of this.sources) {
            switch (source.type) {
                case "gltfModel":
                    this.loaders.gltfLoader.load(source.paths[0], (file) => {
                        this.sourceLoaded(source, file);
                    });
                    break;
                case "texture":
                    this.loaders.textureLoader.load(source.paths[0], (file) => {
                        this.sourceLoaded(source, file);
                    });
                    break;
                case "cubeTexture":
                    this.loaders.cubeTextureLoader.load(source.paths, (file) => {
                        this.sourceLoaded(source, file);
                    });
                    break;
                default:
                    console.warn(`Unknown resource type: ${source.type}`);
            }
        }
    }

    private sourceLoaded(source: Source, file: LoadedResources[string]): void {
        this.items[source.name] = file;
    }

    /**
     * A method to load a new set of assets, useful for changing levels/worlds.
     */
    //   public loadNewSources(newSources: Source[]): Promise<void> {
    //     return new Promise((resolve) => {
    //         this.sources = newSources;
    //         this.toLoad = this.sources.length;
    //         this.loaded = 0;
    //         this.items = {}; // Clear old items

    //         // We can listen for the 'ready' event on this specific load
    //         this.once('ready', () => {
    //             resolve();
    //         });

    //         this.startLoading();
    //     });
    //   }
}