import {
    Color3,
    InstancedMesh,
    Mesh,
    MultiMaterial,
    Scene,
    ShadowGenerator,
    StandardMaterial,
} from "@babylonjs/core";
import { DisposableSceneEffect } from "core/effects/EffectLifetime";
import { Nullable } from "types/common";

export class ShieldDamageEffect extends DisposableSceneEffect {
    constructor(scene: Scene) {
        super(scene);
    }

    private addShadow(mesh: Mesh) {
        const shadowGenerators = this.scene.metadata.shadows;

        shadowGenerators?.forEach((generator: ShadowGenerator) => {
            const light = generator.getLight();

            const dynamicShadow = light?.metadata?.config?.shadowType === "dynamic";

            if (dynamicShadow) {
                generator.addShadowCaster(mesh);
            }
        });
    }

    public apply(parent: Nullable<Mesh> = null) {
        if (!parent) return;
        const DURATION = 0.2;

        const superParent = parent?.parent as InstancedMesh;
        if (!superParent?.name?.includes("cylinder")) return;

        const clonedMesh = superParent.sourceMesh.clone("damage-flash-mesh");
        if (!clonedMesh) return;

        const material = superParent.material as MultiMaterial;
        const clonedMaterial = material.clone("damage-material-clone", true);

        clonedMesh.position.copyFrom(superParent.position);
        clonedMesh.scaling = superParent.scaling.clone();
        clonedMesh.parent = superParent.parent;

        clonedMesh.setEnabled(true);
        clonedMesh.material = clonedMaterial;

        this.addShadow(clonedMesh);

        superParent.isVisible = false;

        const effectiveMaterial = clonedMaterial
            .getChildren()
            .find((material) =>
                material?.name.includes("enemy-material-light"),
            ) as StandardMaterial;

        if (!effectiveMaterial.metadata) effectiveMaterial.metadata = {};
        if (!effectiveMaterial.metadata.originalEmissiveColor) {
            effectiveMaterial.metadata.originalEmissiveColor =
                effectiveMaterial.emissiveColor.clone();
        }

        const originalColor = effectiveMaterial.metadata.originalEmissiveColor.clone();
        const flashColor = new Color3(1.0, 0.31, 0.0);

        effectiveMaterial.emissiveColor = flashColor;

        let elapsed = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            if (superParent && !superParent.isDisposed()) superParent.isVisible = true;
            if (clonedMesh && !clonedMesh.isDisposed()) clonedMesh.dispose(true, true);
            try {
                clonedMaterial.dispose(true, true, true);
            } catch {
                // already disposed
            }
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            const progress = Math.min(elapsed / DURATION, 1);

            try {
                effectiveMaterial.emissiveColor = Color3.Lerp(flashColor, originalColor, progress);
            } catch {
                // material already disposed
            }

            if (progress >= 1) {
                finish();
            }
        });
    }
}
