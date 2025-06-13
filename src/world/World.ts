import * as THREE from 'three';

import Experience from "@core/Experience";
import Debug from '@core/Debug';
import { SceneEntity, WorldContract } from "@core/types";

export default class World implements WorldContract {
    public debug: Debug;
    private experience: Experience;
    private scene: THREE.Scene;
    private entities: SceneEntity[] = [];

    constructor() {
        this.experience = Experience.instance;
        this.scene = this.experience.scene;
        this.debug = this.experience.debug;
    }

    public add(entity: SceneEntity): void {
        this.scene.add(entity.object);
        this.entities.push(entity);
    }

    public remove(entity: SceneEntity): void {
        const index = this.entities.findIndex(
            (entityToRemove) => entityToRemove.id === entity.id,
        );

        if (index > -1) {
            this.scene.remove(entity.object);
            entity.destroy();
            this.entities.splice(index, 1);
        }
    }

    public update(deltaTime: number, elapsedTime: number): void {
        for (const entity of this.entities) {
            if (entity.update) {
                entity.update(deltaTime, elapsedTime);
            }
        }
    }

    public destroy(): void {
        for (let i = this.entities.length - 1; i >= 0; i--) {
            const entity = this.entities[i];
            this.scene.remove(entity.object);
            entity.destroy();
        }
        this.entities = [];
    }
}