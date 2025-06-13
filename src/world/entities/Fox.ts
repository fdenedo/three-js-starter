import * as THREE from 'three';
import { BaseEntity } from '@core/BaseEntity';
import World from 'src/world/World';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { disposeObject3D } from '@core/utils/dispose';
import Experience from '@core/Experience';
import Time from '@core/Time';

export default class Fox extends BaseEntity {
    world?: World;
    resource: GLTF;
    object: THREE.Object3D;
    time: Time;
    animations;
    debug;

    constructor() {
        super();

        const experience = Experience.instance;

        this.world = experience.world;
        this.resource = experience.resources.items['foxModel'] as GLTF;
        this.object = this.resource.scene;
        this.time = experience.time;
        this.debug = experience.debug;

        this.setModel();
        this.setAnimation();

        if (this.debug.active) this.setupDebug();
    }

    setModel() {
        this.object.scale.setScalar(0.02);

        this.object.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        })
    }

    setAnimation() {
        this.animations = {};
        this.animations.mixer = new THREE.AnimationMixer(this.object);
        
        this.animations.actions = {};
        this.animations.actions.idle = this.animations.mixer.clipAction(this.resource.animations[0]);
        this.animations.actions.walking = this.animations.mixer.clipAction(this.resource.animations[1]);
        this.animations.actions.running = this.animations.mixer.clipAction(this.resource.animations[2]);
        
        this.animations.actions.current = this.animations.actions.idle;
        this.animations.actions.current.play();

        this.animations.play = (name: string) => {
            const newAction = this.animations.actions[name];
            const oldAction = this.animations.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 1);

            this.animations.actions.current = newAction;
        }

    }

    setupDebug(): void {
        const pane = this.debug!.pane!.addFolder({ 'title': 'Fox' });
        pane.addButton({title: 'playIdle'})
            .on('click', () => this.animations.play('idle'));
        pane.addButton({title: 'playWalking'})
            .on('click', () => this.animations.play('walking'));
        pane.addButton({title: 'playRunning'})
            .on('click', () => this.animations.play('running'));
    }

    update(deltaTime: number, _: number) {
        this.animations.mixer.update(deltaTime * 0.001);
    }

    destroy(): void {
        disposeObject3D(this.object);
    }
}