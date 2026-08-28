import { Scene, Mesh, TransformNode, ShaderMaterial, MeshBuilder, Vector3 } from "@babylonjs/core";
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

const EFFECT_DURATION = 0.25;
const OFFSET_TO_CAMERA = 2.0;

export class CoreDamageEffect extends DisposableSceneEffect implements IEffect {
    private createBillboardMesh(): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: 3 }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        plane.renderingGroupId = 0;
        return plane;
    }

    private createShaderMaterial(): ShaderMaterial {
        const material = new ShaderMaterial(
            "ring-effect",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "ringEffect",
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

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        const effectMesh = this.createBillboardMesh();
        const material = this.createShaderMaterial();

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
}
