import * as THREE from 'three';
import { SceneEntity } from '@core/types';

export abstract class BaseEntity implements SceneEntity {
    public readonly id: string;
    public abstract object: THREE.Object3D;

    constructor() {
        this.id = THREE.MathUtils.generateUUID();
    }

    abstract destroy(): void;
}