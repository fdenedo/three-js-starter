import * as THREE from 'three';

import Time from '@core/Time';
import Debug from '@core/Debug';
import Resources from '@core/Resources';
import Sizes from '@core/utils/sizes';
import Camera from '@core/Camera';

/**
 * An object that defines this method can be updated based on either
 * the amount of time elapsed since the start of the time loop (not
 * including time spent paused) or the time since the last tick, or
 * both.
 */
export type Updatable = (delta: number, elapsed: number) => void;

/**
 * Anything that inherits this interface must provide a `destroy()`
 * method that allows an orchestrator (e.g. `World`, `Experience`) to
 * free its memory to be safely garbage collected when it is no
 * longer needed.
 */
export interface Disposable {
    destroy: () => void;
}

export interface Debuggable {
    setupDebug?: (debug: Debug) => void;
}

/**
 * The contract for any entity that can be drawn to the canvas. It must
 * have a mesh and for safe cleanup it must be disposable. It may or may
 * not have an update function that allows it to change over time.
 */
export interface SceneEntity extends Disposable, Debuggable {
    readonly id: string;
    object: THREE.Object3D;
    update?: Updatable;
}

/**
 * The contract for the World class. The World is the content manager
 * for the experience, and owns scene objects and behaviours. It is
 * created and managed by Experience and it is through this contract
 * that the Experience is able to interact with scene objects. 
 */
export interface WorldContract extends Disposable, Debuggable {
    update: Updatable;
    add: (entity: SceneEntity) => void;
    remove: (entity: SceneEntity) => void;
}

/**
 * The contract for the Experience singleton class. The Experience is the
 * orchestrator of all of the dependencies required to pass through the
 * application to render things to the canvas.
 */
export interface ExperienceContract extends Disposable {
    canvas: HTMLCanvasElement;
    scene: THREE.Scene;
    camera: Camera;
    sizes: Sizes;
    time: Time;
    resources: Resources;
    debug: Debug;
}