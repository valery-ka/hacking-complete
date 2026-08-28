import {
    Scene,
    Mesh,
    TransformNode,
    ShaderMaterial,
    MeshBuilder,
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

const EFFECT_DURATION = 1.17;

export class PlayerDamageEffect extends DisposableSceneEffect implements IEffect {

    constructor(scene: Scene) {
        super(scene);
    }

    private createPlaneMesh(size: number = 2, offset: number = 0): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        plane.position.y = offset;
        plane.rotation.x = Math.PI / 2;
        return plane;
    }

    private createShaderRingsMaterial(ring: number = 0): ShaderMaterial {
        const material = new ShaderMaterial(
            "player-damage-rings",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "playerDamageRings",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "ring"],
                needAlphaBlending: true,
            },
        );

        material.setInt("ring", ring);
        material.setFloat("progress", 0);
        return material;
    }

    private createShaderGroundMaterial(): ShaderMaterial {
        const material = new ShaderMaterial(
            "player-damage-ground",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "playerDamageGround",
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

    private createShaderRedCircle(): ShaderMaterial {
        const material = new ShaderMaterial(
            "player-damage-red-circle",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "playerDamageRedCircle",
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

    private applyRingsEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const whiteRing = this.createPlaneMesh(6);
        const blackRing0 = this.createPlaneMesh(6, 0.1);
        const blackRing1 = this.createPlaneMesh(6, -0.1);

        whiteRing.parent = parent;
        blackRing0.parent = parent;
        blackRing1.parent = parent;

        const whiteRingMaterial = this.createShaderRingsMaterial(0);
        const black0RingMaterial = this.createShaderRingsMaterial(1);
        const black1RingMaterial = this.createShaderRingsMaterial(1);

        whiteRing.material = whiteRingMaterial;
        blackRing0.material = black0RingMaterial;
        blackRing1.material = black1RingMaterial;

        runTimedEffect(
            this.lifetime,
            this.scene,
            EFFECT_DURATION,
            (progress) => {
                whiteRingMaterial.setFloat("progress", progress);
                black0RingMaterial.setFloat("progress", progress);
                black1RingMaterial.setFloat("progress", progress);
            },
            () => {
                disposeTrackedMesh(this.scene, whiteRing, whiteRingMaterial);
                disposeTrackedMesh(this.scene, blackRing0, black0RingMaterial);
                disposeTrackedMesh(this.scene, blackRing1, black1RingMaterial);
            },
            () => this.scene.metadata.gameClock.playerSpeed,
        );
    }

    private applyGroundEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createPlaneMesh(10);
        effectMesh.parent = parent;

        const material = this.createShaderGroundMaterial();
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
            () => this.scene.metadata.gameClock.playerSpeed,
        );
    }

    public applyRedCircleEffect(
        parent: Nullable<Mesh | TransformNode> = null,
        size: number = 10,
        _speed: number = 1,
    ): void {
        if (!parent) return;
        const effectMesh = this.createPlaneMesh(size);
        effectMesh.parent = parent;

        const material = this.createShaderRedCircle();
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
            () => this.scene.metadata.gameClock.playerSpeed,
        );
    }

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        this.applyRingsEffect(parent);
        this.applyGroundEffect(parent);
        this.applyRedCircleEffect(parent);
    }
}
