import {
    MeshBuilder,
    Mesh,
    Scene,
    ShaderMaterial,
    TransformNode,
    Quaternion,
} from "@babylonjs/core";
import { Nullable } from "types/common";
import {
    DisposableSceneEffect,
    disposeTrackedMesh,
    excludeMeshFromEffectLayers,
    runTimedEffect,
} from "core/effects/EffectLifetime";

const EFFECT_DURATION = 0.2;

const QUAT = Quaternion.RotationYawPitchRoll(0, Math.PI / 2, 0);

export class SphereBombDestroyEffect extends DisposableSceneEffect {

    constructor(scene: Scene) {
        super(scene);
    }

    private createGroundMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        return plane;
    }

    private createShaderMaterialGroundRingEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "cylinder-bomb-destroy",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "sphereBombDestroy",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "time", "effectSeed"],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);
        material.alphaMode = 6;

        return material;
    }

    public applyGroundRingEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createGroundMesh(10);
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

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        const cubes = this.scene.metadata?.effects?.cubes_explosion;

        this.applyGroundRingEffect(parent);
        cubes?.applySphereBombExplosion(parent, "red", "very-small");
    }
}
