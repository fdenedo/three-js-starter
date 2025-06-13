import * as THREE from 'three';

export function disposeObject3D(object: THREE.Object3D): void {
    if (!object) return;

    object.children.forEach(disposeObject3D);

    if (object instanceof THREE.Mesh && object.geometry) {
        object.geometry.dispose();
    }

    if (object instanceof THREE.Mesh && object.material) {
        if (Array.isArray(object.material)) {
            object.material.forEach((material) => {
                disposeMaterial(material);
            });
        } else {
            disposeMaterial(object.material);
        }
    }
}

function disposeObject(object: any) {
  if (object.dispose && typeof object.dispose === "function") {
    object.dispose();
  }
}

function disposeMaterial(material: THREE.Material): void {
    disposeObject(material);

    for (const key in material) {
        const value = (material as any)[key];
        if (value instanceof THREE.Texture) {
            disposeObject(value);
        }
    }
}