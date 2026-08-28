import {
    MeshBuilder,
    Mesh,
    Scene,
    ShaderMaterial,
    TransformNode,
    Quaternion,
    Vector3,
    Matrix,
    StandardMaterial,
    Color3,
    InstancedMesh,
} from "@babylonjs/core";
import { Nullable } from "types/common";
import { getWorldOffset } from "utils/babylon";
import {
    DisposableSceneEffect,
    disposeTrackedMesh,
    excludeMeshFromEffectLayers,
    runTimedEffect,
} from "core/effects/EffectLifetime";

const EFFECT_DURATION = 0.5;

const QUAT = Quaternion.RotationYawPitchRoll(0, Math.PI / 2, 0);

export class EnemyCylinderBombSpawnAnimation extends DisposableSceneEffect {

    constructor(scene: Scene) {
        super(scene);
    }

    private createMesh(size: number = 2.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size });
        excludeMeshFromEffectLayers(this.scene, plane);
        return plane;
    }

    private createBeamMesh(): Mesh {
        const cylinder = MeshBuilder.CreateCylinder("enemy-beam", {
            height: 20,
            diameter: 0.5,
            tessellation: 4,
        });
        return cylinder;
    }

    private createShellMesh(): Mesh {
        const cylinder = MeshBuilder.CreateCylinder("enemy-shell-beam", {
            height: 20,
            diameter: 0.25,
            tessellation: 4,
        });
        excludeMeshFromEffectLayers(this.scene, cylinder);
        return cylinder;
    }

    private createShaderGroundEffectMaterial(): ShaderMaterial {
        const material = new ShaderMaterial(
            "enemy-spawn-animation-0",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "cylinderBombGround",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress"],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);

        return material;
    }

    private createShaderCircleEffectMaterial(): ShaderMaterial {
        const material = new ShaderMaterial(
            "enemy-spawn-animation-1",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "cylinderBombSpawnCircle",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress"],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);

        return material;
    }

    private createBeamMaterial(): StandardMaterial {
        const material = new StandardMaterial("enemy-spawn-animation-2");

        material.disableLighting = true;
        material.disableDepthWrite = true;

        material.diffuseColor = new Color3(1.0, 1.0, 1.0);
        material.emissiveColor = new Color3(1.0, 1.0, 1.0);

        return material;
    }

    private createShellMaterial(): StandardMaterial {
        const material = new StandardMaterial("enemy-spawn-animation-3");

        material.disableLighting = true;

        material.diffuseColor = Color3.Black();
        material.emissiveColor = Color3.Black();

        return material;
    }

    private applyGroundEffect(parent: Nullable<Mesh | TransformNode> = null) {
        if (!parent) return;
        const effectMesh = this.createMesh(2.5);
        const material = this.createShaderGroundEffectMaterial();

        let quat = parent.rotationQuaternion;

        if (!quat) {
            const rot = parent.rotation;
            quat = Quaternion.FromEulerAngles(rot.x, rot.y, rot.z);
        }

        effectMesh.position = parent.position.clone();
        effectMesh.rotationQuaternion = quat.clone().multiply(QUAT);
        effectMesh.material = material;

        const offsetLocal = new Vector3(0, 0, 0.5);
        const offsetWorld = getWorldOffset(
            offsetLocal,
            effectMesh.position,
            effectMesh.rotationQuaternion.toEulerAngles(),
        );

        effectMesh.position = offsetWorld;

        runTimedEffect(
            this.lifetime,
            this.scene,
            EFFECT_DURATION,
            (progress) => {
                material.setFloat("progress", progress);
            },
            () => {
                disposeTrackedMesh(this.scene, effectMesh, material);
            },
        );
    }

    private applyCircleEffect(parent: Nullable<Mesh | TransformNode> = null) {
        if (!parent) return;
        const effectMesh = this.createMesh(5.0);
        const material = this.createShaderCircleEffectMaterial();

        let quat = parent.rotationQuaternion;

        if (!quat) {
            const rot = parent.rotation;
            quat = Quaternion.FromEulerAngles(rot.x, rot.y, rot.z);
        }

        effectMesh.position = parent.position.clone();
        effectMesh.rotationQuaternion = quat.clone().multiply(QUAT);
        effectMesh.material = material;

        const offsetLocal = new Vector3(0, 0, 0);
        const offsetWorld = getWorldOffset(
            offsetLocal,
            effectMesh.position,
            effectMesh.rotationQuaternion.toEulerAngles(),
        );

        effectMesh.position = offsetWorld;

        runTimedEffect(
            this.lifetime,
            this.scene,
            EFFECT_DURATION,
            (progress) => {
                material.setFloat("progress", progress);
            },
            () => {
                disposeTrackedMesh(this.scene, effectMesh, material);
            },
        );
    }

    private applyBeamEffect(anchor: Nullable<Mesh | TransformNode> = null) {
        if (!anchor) return;

        const beamMesh = this.createBeamMesh();
        const shellMesh = this.createShellMesh();
        const beamMaterial = this.createBeamMaterial();
        const shellMaterial = this.createShellMaterial();

        let anchorQuat = anchor.rotationQuaternion;
        if (!anchorQuat) {
            const { x, y, z } = anchor.rotation;
            anchorQuat = Quaternion.FromEulerAngles(x, y, z);
        }

        const anchorMatrix = Matrix.Compose(Vector3.One(), anchorQuat, anchor.position);

        const startOffsetLocal = new Vector3(0, 20, 0);
        const endOffsetLocal = new Vector3(0, 10, 0);

        const startOffsetWorld = Vector3.TransformCoordinates(startOffsetLocal, anchorMatrix);
        const endOffsetWorld = Vector3.TransformCoordinates(endOffsetLocal, anchorMatrix);

        beamMesh.position = startOffsetWorld.clone();
        beamMesh.rotationQuaternion = anchorQuat.clone();
        beamMesh.material = beamMaterial;

        shellMesh.position = endOffsetWorld.clone();
        shellMesh.rotationQuaternion = anchorQuat.clone();
        shellMesh.material = shellMaterial;
        shellMesh.visibility = 0.1;

        const initialXZ = 1;
        const initialY = 0;
        beamMesh.scaling = new Vector3(initialXZ, initialY, initialXZ);

        let elapsed = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            disposeTrackedMesh(this.scene, beamMesh, beamMaterial, [true, true]);
            disposeTrackedMesh(this.scene, shellMesh, shellMaterial, [true, true]);
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            const progress = elapsed / EFFECT_DURATION;

            if (progress >= 1.0) {
                finish();
                return;
            }

            const targetXZ = 0.0;
            const targetY = 1.0;

            const currentXZ = initialXZ + (targetXZ - initialXZ) * progress;
            const currentY = initialY + (targetY - initialY) * progress;

            beamMesh.position = Vector3.Lerp(startOffsetWorld, endOffsetWorld, progress);
            beamMesh.scaling = new Vector3(currentXZ, currentY, currentXZ);
        });
    }

    private applyMaterialAlphaFadeIn(parent: Nullable<TransformNode> = null): void {
        if (!parent) return;
        const DURATION = 0.5;

        const instancedMeshes = parent.getChildren() as InstancedMesh[];

        instancedMeshes.forEach((instancedMesh) => {
            const clonedMesh = instancedMesh?.sourceMesh?.clone("enemy-spawn-fade-in-mesh");
            if (!clonedMesh) return;

            clonedMesh.position.copyFrom(instancedMesh.position);
            clonedMesh.scaling = instancedMesh.scaling.clone();
            clonedMesh.visibility = 0;
            clonedMesh.parent = parent;

            clonedMesh.setEnabled(true);
            instancedMesh.isVisible = false;

            let elapsed = 0;
            let unsubscribe = () => {};
            const finish = this.lifetime.track(() => {
                unsubscribe();
                if (clonedMesh && !clonedMesh.isDisposed()) clonedMesh.dispose();
                if (instancedMesh && !instancedMesh.isDisposed()) instancedMesh.isVisible = true;
            });

            unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
                elapsed += dt;

                const progress = Math.min(elapsed / DURATION, 1);
                if (!clonedMesh.isDisposed()) {
                    clonedMesh.visibility = progress;
                }

                if (progress >= 0.9 && !instancedMesh.isDisposed()) {
                    instancedMesh.isVisible = true;
                }

                if (progress >= 1) {
                    finish();
                }
            });
        });
    }

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        this.applyGroundEffect(parent);
        this.applyCircleEffect(parent);
        this.applyBeamEffect(parent);
        this.applyMaterialAlphaFadeIn(parent);
    }
}
