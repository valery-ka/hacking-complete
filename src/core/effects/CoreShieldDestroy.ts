import {
    Scene,
    Mesh,
    TransformNode,
    ShaderMaterial,
    MeshBuilder,
    Vector3,
    Quaternion,
    Texture,
} from "@babylonjs/core";
import { EnemyAudioEngine } from "core/audio/EnemyAudioEngine";
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

export class CoreShieldDestroy extends DisposableSceneEffect implements IEffect {
    private audioEngine: EnemyAudioEngine;


    private destroy00: Nullable<Texture> = null;
    private destroy01: Nullable<Texture> = null;
    private destroy02: Nullable<Texture> = null;
    private destroy03: Nullable<Texture> = null;
    private destroy04: Nullable<Texture> = null;
    private destroy05: Nullable<Texture> = null;

    constructor(scene: Scene) {
        super(scene);
        this.audioEngine = scene.metadata.audio_engine?.getEnemyAudio();

    }

    private initTextures(): void {
        if (!this.destroy00) {
            this.destroy00 = this.scene.metadata.textures["textures/enemy/shield/destroy_00.png"];
        }
        if (!this.destroy01) {
            this.destroy01 = this.scene.metadata.textures["textures/enemy/shield/destroy_01.png"];
        }
        if (!this.destroy02) {
            this.destroy02 = this.scene.metadata.textures["textures/enemy/shield/destroy_02.png"];
        }
        if (!this.destroy03) {
            this.destroy03 = this.scene.metadata.textures["textures/enemy/shield/destroy_03.png"];
        }
        if (!this.destroy04) {
            this.destroy04 = this.scene.metadata.textures["textures/enemy/shield/destroy_04.png"];
        }
        if (!this.destroy05) {
            this.destroy05 = this.scene.metadata.textures["textures/enemy/shield/destroy_05.png"];
        }
    }

    private createMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size });
        excludeMeshFromEffectLayers(this.scene, plane);
        return plane;
    }

    private createBillboardMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        plane.renderingGroupId = 0;
        return plane;
    }

    private createShaderMaterialSparklesEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "player-destroy-sparkles",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "playerDestroySparkles",
            },
            {
                attributes: ["position", "uv"],
                uniforms: [
                    "worldViewProjection",
                    "progress",
                    "time",
                    "effectSeed",
                    "color",
                    "amount",
                    "factor",
                ],
                needAlphaBlending: true,
            },
        );

        material.alphaMode = 7;
        material.setVector3("color", new Vector3(0.97, 0.97, 0.85));
        material.setFloat("progress", 0);
        material.setFloat("time", performance.now() * 0.001);
        material.setInt("amount", 15);
        material.setFloat("factor", 1.0);
        return material;
    }

    private createShaderRingEffectMaterial(): ShaderMaterial {
        const material = new ShaderMaterial(
            "core-shield-destroy-ring",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "coreShieldDestroyRing",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress"],
                needAlphaBlending: true,
            },
        );

        material.alphaMode = 7;
        material.setFloat("progress", 0);

        return material;
    }

    private createShaderMaterialTexturesEffect(): ShaderMaterial {
        this.initTextures();

        const material = new ShaderMaterial(
            "core-shield-destroy-textures",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "coreShieldDestroyTextures",
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

        material.alphaMode = 1;

        return material;
    }

    public applySparklesEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createBillboardMesh(60);
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

    private applyCircleEffect(parent: Nullable<Mesh | TransformNode> = null) {
        if (!parent) return;
        const effectMesh = this.createMesh(15);
        const material = this.createShaderRingEffectMaterial();

        let quat = parent.rotationQuaternion;

        if (!quat) {
            const rot = parent.rotation;
            quat = Quaternion.FromEulerAngles(rot.x, rot.y, rot.z);
        }

        effectMesh.position = parent.position.clone();
        effectMesh.rotationQuaternion = quat.clone().multiply(QUAT);
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

    public applyTexturesEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createBillboardMesh(5);
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

        runTimedEffect(
            this.lifetime,
            this.scene,
            EFFECT_DURATION,
            (progress) => {
                material.setFloat("progress", progress);
            },
            () => {
                disposeTrackedMesh(this.scene, effectMesh, material, [true, false, true]);
            },
        );
    }

    private applyRadualBlur() {
        const players = this.scene.metadata.players;

        if (players) {
            players.forEach((player: TransformNode) => {
                player.metadata?.callbacks?.radial_blur_camera();
            });
        }
    }

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;

        const cubes = this.scene.metadata?.effects?.cubes_explosion;
        cubes?.apply(parent, "light");

        this.applySparklesEffect(parent);
        this.applyCircleEffect(parent);
        this.applyTexturesEffect(parent);

        this.applyRadualBlur();
        this.audioEngine?.playSound("enemy_core_shield_destroy", 1.0, parent);
    }
}
