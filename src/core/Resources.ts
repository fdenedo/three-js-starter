// import * as THREE from "three";
// import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
// import EventEmitter from "./utils/EventEmitter";

// type ResourceDescriptor = {
//     name: string,
//     type: string,
//     paths: string[] | string
// }

// type ResourceItem = GLTF | THREE.Texture | THREE.CubeTexture;

// interface Loaders {
//   gltfLoader: GLTFLoader;
//   textureLoader: THREE.TextureLoader;
//   cubeTextureLoader: THREE.CubeTextureLoader;
// }

// export default class Resources extends EventEmitter {
//     sources?:    ResourceDescriptor[];
//     items:      Record<string, ResourceItem>;
//     toLoad:     number = 0;
//     loaded:     number = 0;
//     loaders:    Loaders;

//     constructor() {
//         super();

//         // Setup
//         this.items = {};
//         this.loaders = {} as Loaders;
//     }

//     load(): void {
//         this.toLoad = this.sources ? this.sources.length : 0;
//         this.loaded = 0;
//         this.setLoaders();
//         this.startLoading();
//     }

//     setSources(sources: ResourceDescriptor[]): void {
//         this.sources = sources;
//     }

//     setLoaders() {
//         this.loaders.gltfLoader = new GLTFLoader();
//         this.loaders.textureLoader = new THREE.TextureLoader();
//         this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
//     }

//     startLoading() {
//         if (!this.sources) return;
//         for (const source of this.sources) {
//             switch (source.type) {
//                 case 'gltfModel':
//                     this.loaders.gltfLoader.load(
//                         source.paths[0],
//                         file => {
//                             this.sourceLoaded(source, file);
//                         }
//                     );
//                     break;
//                 case 'texture':
//                     this.loaders.textureLoader.load(
//                         source.paths[0],
//                         file => {
//                             this.sourceLoaded(source, file);
//                         }
//                     );
//                     break;
//                 case 'cubeTexture':
//                     if (source.paths instanceof String) {
//                         console.error('NO');
//                         return;
//                     }

//                     this.loaders.cubeTextureLoader.load(
//                         source.paths as string[],
//                         file => {
//                             this.sourceLoaded(source, file);
//                         }
//                     );

//                     break;
//             }
//             if (source.type === 'gltfLoader') {

//             }
//         }
//     }

//     sourceLoaded(source: ResourceDescriptor, file: ResourceItem) {
//         console.log(source, file)
//         this.items[source.name] = file;

//         this.loaded++;

//         if (this.loaded === this.toLoad) {
//             this.trigger('ready')
//         }
//     }
// }

import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "@core/utils/EventEmitter";

// A clearer type for our sources
export interface Source {
    name: string;
    type: ResourceType;
    paths: string[];
}

export type ResourceType = "gltfModel" | "texture" | "cubeTexture"

// A type for the items we've loaded
export type LoadedResources = Record<string, GLTF | THREE.Texture | THREE.CubeTexture>;

export default class Resources extends EventEmitter {
  public sources: Source[];
  public items: LoadedResources = {};
  public toLoad: number;
  public loaded: number = 0;

  private loadingManager: THREE.LoadingManager;
  private loaders!: { // The "!" asserts that we will initialize this
    gltfLoader: GLTFLoader;
    textureLoader: THREE.TextureLoader;
    cubeTextureLoader: THREE.CubeTextureLoader;
  };

  constructor(sources: Source[]) {
    super();

    this.sources = sources;
    this.toLoad = this.sources.length;

    // The LoadingManager is key. It tracks progress across all loaders.
    this.loadingManager = new THREE.LoadingManager(
      // onLoad callback: All assets are loaded
      () => {
        console.log("All resources loaded!");
        this.trigger("ready");
      },
      // onProgress callback: An asset has loaded
      (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal;
        this.trigger("progress", [progressRatio, itemUrl]);
      },
      // onError callback
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
        // If there are no sources, we are ready immediately.
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
    // The LoadingManager now handles the loaded count and ready event!
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