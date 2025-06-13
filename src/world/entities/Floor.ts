import * as THREE from 'three';
import { BaseEntity } from '@core/BaseEntity';
import { disposeObject3D } from '@core/utils/dispose';
import Experience from '@core/Experience';

export default class Floor extends BaseEntity {
    object!: THREE.Object3D;
    world;
    resources;
    geometry?: THREE.BufferGeometry;
    material?: THREE.MeshStandardMaterial;

    constructor() {
        super();

        const experience = Experience.instance;
        this.world = experience.world;
        this.resources = {
            'dirtColorTexture': experience.resources.items['dirtColorTexture'] as THREE.Texture,
            'dirtNormalTexture': experience.resources.items['dirtNormalTexture'] as THREE.Texture,
        };

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.CircleGeometry(5, 64);
    }

    setMaterial() {
        const colorMap = this.resources['dirtColorTexture'];
        colorMap.colorSpace = THREE.SRGBColorSpace;
        colorMap.repeat.set(1.5, 1.5);
        colorMap.wrapS = THREE.RepeatWrapping;
        colorMap.wrapT = THREE.RepeatWrapping;

        const normalMap = this.resources['dirtNormalTexture'];
        normalMap.repeat.set(1.5, 1.5);
        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;

        this.material = new THREE.MeshStandardMaterial({
            map: colorMap,
            normalMap: normalMap
        });
    }

    setMesh() {
        this.object = new THREE.Mesh(this.geometry, this.material);
        this.object.rotation.x = - Math.PI * 0.5;
        this.object.receiveShadow = true;
    }

    destroy(): void {
        disposeObject3D(this.object);
    }
}