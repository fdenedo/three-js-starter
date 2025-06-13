import Debug from '@core/Debug';
import Experience from '@core/Experience';
import * as THREE from 'three';


type EnvironmentMap = {
    intensity?: number,
    texture?: THREE.Texture,
    updateMaterials?: () => void;
}

export default class Environment {
    scene;
    sunLight!: THREE.DirectionalLight;
    resource;
    environmentMap!: EnvironmentMap;
    debug: Debug;


    constructor() {
        const experience = Experience.instance;
        this.scene = experience.scene;
        this.resource = experience.resources.items['environmentMapTexture'] as THREE.CubeTexture;
        this.debug = experience.debug;

        this.setSunLight();
        this.setEnvironmentMap();

        if (this.debug.active) this.setupDebug();
    }

    setSunLight() {
        this.sunLight = new THREE.DirectionalLight(0xffffff, 4);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 15;
        this.sunLight.shadow.mapSize.set(1024, 1024);
        this.sunLight.shadow.normalBias = 0.05;
        this.sunLight.position.set(3, 3, -2.25);
        this.scene.add(this.sunLight);
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 0.4;
        this.environmentMap.texture = this.resource;
        // this.environmentMap.texture.encoding = THREE.SRGBColorSpace;

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse(child => {
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap?.texture || null;
                    child.material.envMapIntensity = this.environmentMap?.intensity || 0;
                    child.material.needsUpdate = true;
                }
            });
        }

        this.environmentMap.updateMaterials();
    }

    setupDebug() {
        const folder = this.debug!.pane!.addFolder({ title: 'Environment' });
        folder.addBinding(this.sunLight, 'intensity', { label: 'Sunlight Intensity', min: 0, max: 10, step: 0.001 });
        folder.addBinding(this.sunLight.position, 'x', { label: 'Sunlight X', min: -5, max: 5, step: 0.001 });
        folder.addBinding(this.sunLight.position, 'y', { label: 'Sunlight Y', min: -5, max: 5, step: 0.001 });
        folder.addBinding(this.sunLight.position, 'z', { label: 'Sunlight Z', min: -5, max: 5, step: 0.001 });
        folder.addBinding(
            this.environmentMap, 
            'intensity', 
            { 
                title: 'Environment Intensity', 
                min: 0, 
                max: 4, 
                step: 0.001 
            }).on('change', () => { this.environmentMap.updateMaterials });
    }
}