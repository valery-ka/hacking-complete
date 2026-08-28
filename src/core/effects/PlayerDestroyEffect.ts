import {
    Scene,
    Mesh,
    TransformNode,
    ShaderMaterial,
    MeshBuilder,
    Texture,
    Vector3,
} from "@babylonjs/core";
import { PlayerAudioEngine } from "core/audio/PlayerAudioEngine";
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

const EFFECT_DURATION = 0.2;
const OFFSET_TO_CAMERA = 2.0;

export class PlayerDestroyEffect extends DisposableSceneEffect implements IEffect {
    private audioEngine: PlayerAudioEngine;


    private flare: Nullable<Texture> = null;

    constructor(scene: Scene) {
        super(scene);
        this.audioEngine = scene.metadata.audio_engine?.getPlayerAudio();

    }

    private initTextures(): void {
        if (!this.flare) {
            this.flare = this.scene.metadata.textures["textures/shared/flare.png"];
        }
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

        material.alphaMode = 1;
        material.setVector3("color", new Vector3(0.98, 0.0, 0.0));
        material.setFloat("progress", 0);
        material.setFloat("time", performance.now() * 0.001);
        material.setInt("amount", 50);
        material.setFloat("factor", 10.0);
        return material;
    }

    private createShaderMaterialFlareEffect(): ShaderMaterial {
        this.initTextures();

        const material = new ShaderMaterial(
            "player-destroy-flare",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "customFlare",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "flare", "color", "scaleX", "scaleY"],
                needAlphaBlending: true,
            },
        );

        material.alphaMode = 1;
        material.setFloat("progress", 0);
        material.setTexture("flare", this.flare!);
        material.setVector3("color", new Vector3(1, 0, 0));
        material.setFloat("scaleX", 1.0);
        material.setFloat("scaleY", 1.0);

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

    public applyFlareEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createBillboardMesh(60);
        const material = this.createShaderMaterialFlareEffect();

        effectMesh.material = material;

        const parentPosition = parent!.position.clone();
        const cameraPosition = this.scene.activeCamera!.globalPosition.clone();

        let direction: Vector3;
        direction = cameraPosition.subtract(parentPosition).normalize();
        if (this.scene.activeCameras?.[0]) {
            direction = Vector3.Up().scale(0.5);
        }

        const hasMultipleCameras = this.scene.activeCameras!.length >= 1;
        effectMesh.position = parentPosition.add(direction.scale(hasMultipleCameras ? 0 : 10));

        runTimedEffect(
            this.lifetime,
            this.scene,
            0.4,
            (progress) => {
                material.setFloat("progress", progress);
            },
            () => {
                disposeTrackedMesh(this.scene, effectMesh, material);
            },
        );
    }

    private combinedClassesEffects(parent: Nullable<Mesh | TransformNode> = null) {
        const enemyEffects = this.scene.metadata?.effects?.enemy_destroy;
        const coreEffects = this.scene.metadata?.effects?.core_destroy;
        const playerEffects = this.scene.metadata?.effects?.player_damage;
        const cubesEffects = this.scene.metadata?.effects?.cubes_explosion;

        const isDarkPlayer = parent?.name.includes("dark");
        const cubesColor = isDarkPlayer ? "light" : "dark";

        coreEffects?.applySquaresEffect(parent, 10, 1, isDarkPlayer);

        type ScheduledEffect = {
            time: number;
            run: () => void;
        };

        const schedule: ScheduledEffect[] = [
            {
                time: 0.1,
                run: () => {
                    playerEffects?.applyRedCircleEffect(parent, 15, 2);
                },
            },
            {
                time: 0.2,
                run: () => {
                    enemyEffects?.applyGroundRingEffect(parent);
                    cubesEffects?.applyCore(parent, cubesColor);
                    this.applySparklesEffect(parent);
                    this.applyFlareEffect(parent);
                },
            },
            {
                time: 0.3,
                run: () => {
                    coreEffects?.applyRingEffect(parent);
                },
            },
        ];

        let elapsed = 0;
        let unsubscribe = () => {};
        const finish = this.lifetime.track(() => {
            unsubscribe();
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            while (schedule.length && elapsed >= schedule[0].time) {
                const effect = schedule.shift()!;
                effect.run();
            }

            if (schedule.length === 0) {
                finish();
            }
        });
    }

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        this.combinedClassesEffects(parent);

        this.audioEngine?.playSound("player_destroy", 1.0, parent!);
    }
}
