import {
    Color3,
    Mesh,
    MeshBuilder,
    Scene,
    StandardMaterial,
    TransformNode,
    ShaderMaterial,
    Vector3,
    InstancedMesh,
    AbstractMesh,
    MultiMaterial,
    ShadowGenerator,
} from "@babylonjs/core";
import { Nullable } from "types/common";
import {
    DisposableSceneEffect,
    disposeTrackedMesh,
    excludeMeshFromEffectLayers,
    runTimedEffect,
} from "core/effects/EffectLifetime";

const EFFECT_DURATION = 0.2;
const OFFSET_TO_CAMERA = 1.0;

export class EnemyDamageEffect extends DisposableSceneEffect {

    constructor(scene: Scene) {
        super(scene);
    }

    private createBillboardMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        plane.renderingGroupId = 0;
        return plane;
    }

    private createShaderMaterialBaseEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "enemy-damage-effect",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "squaresFromCenter",
            },
            {
                attributes: ["position", "uv"],
                uniforms: [
                    "worldViewProjection",
                    "progress",
                    "time",
                    "effectSeed",
                    "amount",
                    "color",
                    "uSpeed",
                    "uSize",
                ],
                needAlphaBlending: true,
            },
        );

        material.setInt("amount", 200);

        material.setFloat("uSize", 0.002);
        material.setFloat("uSpeed", 0.04);
        material.setFloat("effectSeed", Math.random() * 1000);
        material.setFloat("time", performance.now() * 0.001);

        material.setVector3("color", new Vector3(0.0, 0.0, 0.0));

        return material;
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

    private applyMaterialFlash(
        parent: Nullable<TransformNode> = null,
        passRotation: Nullable<Vector3> = null,
    ): void {
        if (!parent) return;

        const DURATION = 0.1;
        const instancedMeshes = parent.getChildren() as InstancedMesh[];

        instancedMeshes.forEach((instancedMesh) => {
            if (instancedMesh?.metadata?.disable_side_effects) return;
            const clonedMesh = instancedMesh?.sourceMesh?.clone("enemy-damage-flash-mesh");
            if (!clonedMesh) return;

            clonedMesh.position.copyFrom(instancedMesh.position);
            clonedMesh.scaling = instancedMesh.scaling.clone();

            if (passRotation) {
                clonedMesh.rotation = passRotation;
            }

            if (instancedMesh?.metadata?.flipped) {
                clonedMesh.rotation.y = Math.PI;
            }

            clonedMesh.visibility = 1.0;
            clonedMesh.parent = parent;
            clonedMesh.setEnabled(true);

            this.addShadow(clonedMesh);

            instancedMesh.isVisible = false;

            const originalMaterial = instancedMesh.material;

            if (originalMaterial instanceof MultiMaterial) {
                const clonedMultiMaterial = new MultiMaterial(
                    "enemy-damage-flash-multi-material",
                    this.scene,
                );

                for (let i = 0; i < originalMaterial.subMaterials.length; i++) {
                    const subMaterial = originalMaterial.subMaterials[i];

                    if (subMaterial instanceof StandardMaterial) {
                        const clonedSubMaterial = subMaterial.clone(
                            `enemy-damage-flash-submaterial-${i}`,
                        ) as StandardMaterial;

                        clonedSubMaterial.metadata = clonedSubMaterial.metadata || {};
                        clonedSubMaterial.metadata.originalEmissiveColor =
                            clonedSubMaterial.emissiveColor?.clone();
                        clonedSubMaterial.metadata.originalSubMaterial = subMaterial;

                        clonedSubMaterial.emissiveColor = Color3.White();

                        clonedMultiMaterial.subMaterials.push(clonedSubMaterial);
                    } else if (subMaterial) {
                        clonedMultiMaterial.subMaterials.push(subMaterial);
                    }
                }

                clonedMesh.material = clonedMultiMaterial;

                this.animateMultiMaterialFlash(
                    clonedMultiMaterial,
                    instancedMesh,
                    clonedMesh,
                    DURATION,
                );
            } else if (originalMaterial instanceof StandardMaterial) {
                const clonedMaterial = originalMaterial.clone(
                    "enemy-damage-flash-material",
                ) as StandardMaterial;

                clonedMesh.material = clonedMaterial;

                const flashColor = Color3.White();
                clonedMaterial.metadata = clonedMaterial.metadata || {};
                clonedMaterial.metadata.originalEmissiveColor =
                    clonedMaterial.emissiveColor?.clone();
                const originalColor =
                    clonedMaterial.metadata.originalEmissiveColor?.clone() || Color3.Black();

                clonedMaterial.emissiveColor.copyFrom(flashColor);

                this.animateStandardMaterialFlash(
                    clonedMaterial,
                    originalColor,
                    flashColor,
                    instancedMesh,
                    clonedMesh,
                    DURATION,
                );
            }
        });
    }

    private animateMultiMaterialFlash(
        clonedMaterial: MultiMaterial,
        instancedMesh: InstancedMesh,
        clonedMesh: AbstractMesh,
        duration: number,
    ): void {
        const flashColor = Color3.White();
        const subMaterialsData: Array<{
            material: StandardMaterial;
            originalEmissiveColor: Color3;
        }> = [];

        clonedMaterial.subMaterials.forEach((subMaterial, index) => {
            if (
                subMaterial instanceof StandardMaterial &&
                subMaterial.metadata?.originalEmissiveColor
            ) {
                subMaterialsData.push({
                    material: subMaterial,
                    originalEmissiveColor: subMaterial.metadata.originalEmissiveColor,
                });
            }
        });

        let elapsed = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            if (!instancedMesh.isDisposed()) instancedMesh.isVisible = true;
            if (!clonedMesh.isDisposed()) clonedMesh.dispose();
            subMaterialsData.forEach((data) => {
                try {
                    data.material.dispose(true, true);
                } catch {
                    // already disposed
                }
            });
            try {
                clonedMaterial.dispose(true, true);
            } catch {
                // already disposed
            }
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;
            const progress = Math.min(elapsed / duration, 1);

            subMaterialsData.forEach((data) => {
                data.material.emissiveColor.copyFrom(
                    Color3.Lerp(flashColor, data.originalEmissiveColor, progress),
                );
            });

            if (progress >= 1) {
                finish();
            }
        });
    }

    private animateStandardMaterialFlash(
        clonedMaterial: StandardMaterial,
        originalColor: Color3,
        flashColor: Color3,
        instancedMesh: InstancedMesh,
        clonedMesh: AbstractMesh,
        duration: number,
    ): void {
        let elapsed = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            if (!instancedMesh.isDisposed()) instancedMesh.isVisible = true;
            if (!clonedMesh.isDisposed()) clonedMesh.dispose();
            try {
                clonedMaterial.dispose(true, true);
            } catch {
                // already disposed
            }
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;
            const progress = Math.min(elapsed / duration, 1);

            clonedMaterial.emissiveColor.copyFrom(Color3.Lerp(flashColor, originalColor, progress));

            if (progress >= 1) {
                finish();
            }
        });
    }

    public applyBaseEffect(
        bullet: Nullable<Mesh> = null,
        enemy: Nullable<TransformNode> = null,
    ): void {
        if (!bullet || !enemy) return;

        const effectMesh = this.createBillboardMesh(5);
        const material = this.createShaderMaterialBaseEffect();

        effectMesh.material = material;

        const parent = bullet.parent as TransformNode;
        const parentPosition = parent!.position.clone();
        const cameraPosition = this.scene.activeCamera!.globalPosition.clone();

        let direction: Vector3;
        direction = cameraPosition.subtract(parentPosition).normalize();
        if (this.scene.activeCameras?.[0]) {
            direction = Vector3.Up().scale(0.5);
        }

        effectMesh.position = parentPosition.add(direction.scale(OFFSET_TO_CAMERA));

        let elapsed = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            disposeTrackedMesh(this.scene, effectMesh, material);
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            const progress = Math.min(elapsed / EFFECT_DURATION, 1);

            if (enemy.name.includes("core")) {
                material.setVector3("color", new Vector3(0.1, 0.1, 0.1));
            }

            if (!enemy.parent) {
                material.setFloat("progress", 1.0);
            } else {
                material.setFloat("progress", progress);
            }

            if (progress >= 1) {
                finish();
            }
        });
    }

    public apply(
        parent: Nullable<TransformNode> = null,
        passRotation: Nullable<Vector3> = null,
    ): void {
        this.applyMaterialFlash(parent, passRotation);
    }
}
