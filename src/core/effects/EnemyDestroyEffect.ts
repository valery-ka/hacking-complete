import {
    Scene,
    Mesh,
    TransformNode,
    ShaderMaterial,
    MeshBuilder,
    Quaternion,
    Texture,
    Vector3,
} from "@babylonjs/core";
import { Nullable } from "types/common";
import {
    DisposableSceneEffect,
    disposeTrackedMesh,
    excludeMeshFromEffectLayers,
    runTimedEffect,
} from "core/effects/EffectLifetime";

interface IEffect {
    apply(parent: Nullable<Mesh | TransformNode>): void;
}

const EFFECT_DURATION = 0.3;
const OFFSET_TO_CAMERA = 2.0;

const QUAT = Quaternion.RotationYawPitchRoll(0, Math.PI / 2, 0);

export class EnemyDestroyEffect extends DisposableSceneEffect implements IEffect {

    private destroy00: Nullable<Texture> = null;
    private destroy01: Nullable<Texture> = null;
    private destroy02: Nullable<Texture> = null;
    private destroy03: Nullable<Texture> = null;
    private destroy04: Nullable<Texture> = null;
    private destroy05: Nullable<Texture> = null;

    constructor(scene: Scene) {
        super(scene);
    }

    private initTextures(): void {
        if (!this.destroy00) {
            this.destroy00 = this.scene.metadata.textures["textures/enemy/destroy/destroy_00.png"];
        }
        if (!this.destroy01) {
            this.destroy01 = this.scene.metadata.textures["textures/enemy/destroy/destroy_01.png"];
        }
        if (!this.destroy02) {
            this.destroy02 = this.scene.metadata.textures["textures/enemy/destroy/destroy_02.png"];
        }
        if (!this.destroy03) {
            this.destroy03 = this.scene.metadata.textures["textures/enemy/destroy/destroy_03.png"];
        }
        if (!this.destroy04) {
            this.destroy04 = this.scene.metadata.textures["textures/enemy/destroy/destroy_04.png"];
        }
        if (!this.destroy05) {
            this.destroy05 = this.scene.metadata.textures["textures/enemy/destroy/destroy_05.png"];
        }
    }

    private createBillboardMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        plane.renderingGroupId = 0;
        return plane;
    }

    private createGroundMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        return plane;
    }

    private createShaderMaterialPlaneRingEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "enemy-destroy-plane-ring",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "enemyDestroyPlane",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "time", "effectSeed"],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);
        return material;
    }

    private createShaderMaterialGroundRingEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "enemy-destroy-ground-ring",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "enemyDestroyGround",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "time", "effectSeed"],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);
        return material;
    }

    private createShaderMaterialSparklesEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "enemy-destroy-sparkles",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "enemyDestroySparkles",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "time", "effectSeed"],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);
        material.setFloat("time", performance.now() * 0.001);
        return material;
    }

    private createShaderMaterialTexturesEffect(): ShaderMaterial {
        this.initTextures();

        const material = new ShaderMaterial(
            "enemy-destroy-textures",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "enemyDestroyTextures",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "time"],
                samplers: [
                    "destroy00",
                    "destroy01",
                    "destroy02",
                    "destroy03",
                    "destroy04",
                    "destroy05",
                ],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);
        material.setFloat("time", performance.now() * 0.001);

        material.setTexture("destroy00", this.destroy00!);
        material.setTexture("destroy01", this.destroy01!);
        material.setTexture("destroy02", this.destroy02!);
        material.setTexture("destroy03", this.destroy03!);
        material.setTexture("destroy04", this.destroy04!);
        material.setTexture("destroy05", this.destroy05!);

        return material;
    }

    public applyGroundRingEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createGroundMesh(15);
        const material = this.createShaderMaterialGroundRingEffect();

        let parentQuat = parent.rotationQuaternion;
        if (!parentQuat) {
            const { x, y, z } = parent.rotation;
            parentQuat = Quaternion.FromEulerAngles(x, y, z);
        }

        effectMesh.position = parent.position.clone();
        effectMesh.rotationQuaternion = parentQuat.clone().multiply(QUAT);
        effectMesh.material = material;

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

    public applyPlaneRingEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createBillboardMesh(15);
        const material = this.createShaderMaterialPlaneRingEffect();

        effectMesh.material = material;

        const parentPosition = parent!.position.clone();
        const cameraPosition = this.scene.activeCamera!.globalPosition.clone();

        let direction: Vector3;
        direction = cameraPosition.subtract(parentPosition).normalize();
        if (this.scene.activeCameras?.[0]) {
            direction = Vector3.Up().scale(0.5);
        }

        const hasMultipleCameras = this.scene.activeCameras!.length >= 1;
        effectMesh.position = parentPosition.add(
            direction.scale(hasMultipleCameras ? 0 : OFFSET_TO_CAMERA),
        );

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

    public applySparklesEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createBillboardMesh(50);
        const material = this.createShaderMaterialSparklesEffect();

        effectMesh.material = material;

        const parentPosition = parent!.position.clone();
        const cameraPosition = this.scene.activeCamera!.globalPosition.clone();

        let direction: Vector3;
        direction = cameraPosition.subtract(parentPosition).normalize();
        if (this.scene.activeCameras?.[0]) {
            direction = Vector3.Up().scale(0.5);
        }

        const hasMultipleCameras = this.scene.activeCameras!.length >= 1;
        effectMesh.position = parentPosition.add(
            direction.scale(hasMultipleCameras ? 0 : OFFSET_TO_CAMERA),
        );
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

    public applyTexturesEffect(
        parent: Nullable<Mesh | TransformNode> = null,
        size: number = 3,
    ): void {
        if (!parent) return;
        const effectMesh = this.createBillboardMesh(size);
        const material = this.createShaderMaterialTexturesEffect();

        effectMesh.material = material;

        const parentPosition = parent!.position.clone();
        const cameraPosition = this.scene.activeCamera!.globalPosition.clone();

        let direction: Vector3;
        direction = cameraPosition.subtract(parentPosition).normalize();
        if (this.scene.activeCameras?.[0]) {
            direction = Vector3.Up().scale(0.5);
        }

        const hasMultipleCameras = this.scene.activeCameras!.length >= 1;
        effectMesh.position = parentPosition.add(
            direction.scale(hasMultipleCameras ? 0 : OFFSET_TO_CAMERA),
        );

        let elapsed = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
            disposeTrackedMesh(this.scene, effectMesh, material, [true, false, true]);
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            const progress = elapsed / 0.25;

            if (progress >= 0.25 && progress <= 0.75) {
                material.setFloat("progress", progress);
            }

            if (progress >= 1) {
                finish();
            }
        });
    }

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        this.applyGroundRingEffect(parent);
        this.applyPlaneRingEffect(parent);
        this.applySparklesEffect(parent);
        this.applyTexturesEffect(parent);
    }
}
