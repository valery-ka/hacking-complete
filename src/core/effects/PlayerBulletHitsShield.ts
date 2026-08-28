import {
    Scene,
    Mesh,
    TransformNode,
    ShaderMaterial,
    MeshBuilder,
    Vector3,
    Quaternion,
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

const EFFECT_DURATION = 0.2;
const OFFSET_TO_CAMERA = 2.0;

const QUAT = Quaternion.RotationYawPitchRoll(0, Math.PI / 2, 0);

export class PlayerBulletHitsShield extends DisposableSceneEffect implements IEffect {

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

    private createPlaneMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        return plane;
    }

    private createShaderMaterialBillboardRingEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "player-bullet-hits-shield",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "playerBulletHitsShield",
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

    private createShaderMaterialPlaneRingEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "player-bullet-hits-shield-plane",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "playerBulletHitsShieldPlane",
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

    private createShaderMaterialBaseEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "player-bullet-hits-wall-1",
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

        material.setInt("amount", 20);

        material.setFloat("uSize", 0.002);
        material.setFloat("uSpeed", 0.1);
        material.setFloat("effectSeed", Math.random() * 1000);
        material.setFloat("time", performance.now() * 0.001);

        material.setVector3("color", new Vector3(1.0, 1.0, 1.0));

        return material;
    }

    public applyPlaneRingEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createPlaneMesh(7);
        const material = this.createShaderMaterialPlaneRingEffect();

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

    public applyBillboardRingEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        const effectMesh = this.createBillboardMesh(7);
        const material = this.createShaderMaterialBillboardRingEffect();

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

    public applyBaseEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        const effectMesh = this.createBillboardMesh(10);
        const material = this.createShaderMaterialBaseEffect();

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

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        this.applyBaseEffect(parent);
        this.applyPlaneRingEffect(parent);
        this.applyBillboardRingEffect(parent);
    }
}
