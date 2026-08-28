import {
    Scene,
    Mesh,
    TransformNode,
    ShaderMaterial,
    MeshBuilder,
    Quaternion,
    Matrix,
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

const OFFSET_TO_CAMERA = 2.0;
const EFFECT_DURATION = 0.4;

const QUAT_0 = Quaternion.RotationYawPitchRoll(0, Math.PI / 2, 0);
const QUAT_1 = Quaternion.RotationYawPitchRoll(0, Math.PI / 2, Math.PI / 4);

export class CoreDestroyEffect extends DisposableSceneEffect implements IEffect {

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

    private createGroundMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        return plane;
    }

    private createShaderMaterialSquaresEffect(
        smoothFlag: number = 0,
        invertColor: boolean = false,
    ): ShaderMaterial {
        const material = new ShaderMaterial(
            "core-destroy-squares",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "coreDestroySquares",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "smoothFlag", "effectSeed", "color"],
                needAlphaBlending: true,
            },
        );

        material.setInt("smoothFlag", smoothFlag);
        material.setFloat("progress", 0);
        material.setVector3(
            "color",
            invertColor ? new Vector3(1.0, 1.0, 1.0) : new Vector3(0.0, 0.0, 0.0),
        );
        return material;
    }

    private createShaderMaterialCircleEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "core-destroy-circle",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "coreDestroyCircle",
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

    private createShaderMaterialRingEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "core-destroy-ring",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "coreDestroyRing",
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

    private createShaderMaterialBoardEffect(): ShaderMaterial {
        const material = new ShaderMaterial(
            "core-destroy-board",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "coreDestroyBoard",
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

    public applySquaresEffect(
        parent: Nullable<Mesh | TransformNode> = null,
        size: number = 15,
        smoothFlag: number = 0,
        invertColor: boolean = false,
    ): void {
        if (!parent) return;
        const effectMesh = this.createGroundMesh(size);
        const material = this.createShaderMaterialSquaresEffect(smoothFlag, invertColor);

        let parentQuat = parent.rotationQuaternion;
        if (!parentQuat) {
            const { x, y, z } = parent.rotation;
            parentQuat = Quaternion.FromEulerAngles(x, y, z);
        }

        effectMesh.position = parent.position.clone();
        effectMesh.rotationQuaternion = parentQuat.clone().multiply(QUAT_0);
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

    public applyCircleEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createGroundMesh(15);
        const material = this.createShaderMaterialCircleEffect();

        let parentQuat = parent.rotationQuaternion;
        if (!parentQuat) {
            const { x, y, z } = parent.rotation;
            parentQuat = Quaternion.FromEulerAngles(x, y, z);
        }

        const parentMatrix = Matrix.Compose(Vector3.One(), parentQuat, parent.position);
        const offsetLocal = new Vector3(0, 0.1, 0);
        const offsetWorld = Vector3.TransformCoordinates(offsetLocal, parentMatrix);

        effectMesh.position = offsetWorld.clone();
        effectMesh.rotationQuaternion = parentQuat.clone().multiply(QUAT_0);
        effectMesh.material = material;

        runTimedEffect(
            this.lifetime,
            this.scene,
            0.3,
            (progress) => {
                material.setFloat("progress", progress);
            },
            () => {
                disposeTrackedMesh(this.scene, effectMesh, material);
            },
        );
    }

    public applyRingEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createBillboardMesh(50);
        const material = this.createShaderMaterialRingEffect();

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
            0.2,
            (progress) => {
                material.setFloat("progress", progress);
            },
            () => {
                disposeTrackedMesh(this.scene, effectMesh, material);
            },
        );
    }

    public applyBoardEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        if (!parent) return;
        const effectMesh = this.createGroundMesh(20);
        const material = this.createShaderMaterialBoardEffect();

        let parentQuat = parent.rotationQuaternion;
        if (!parentQuat) {
            const { x, y, z } = parent.rotation;
            parentQuat = Quaternion.FromEulerAngles(x, y, z);
        }

        effectMesh.position = parent.position.clone();
        effectMesh.rotationQuaternion = parentQuat.clone().multiply(QUAT_1);
        effectMesh.material = material;

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

    private applyPlayerCameraWiggle() {
        const players = this.scene.metadata.players;

        if (players) {
            players.forEach((player: TransformNode) => {
                player.metadata?.callbacks?.wiggle_camera();
            });
        }
    }

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        const textures = this.scene.metadata?.effects?.enemy_destroy;
        textures?.applyTexturesEffect(parent, 4);
        this.applySquaresEffect(parent);
        this.applyCircleEffect(parent);
        this.applyRingEffect(parent);
        this.applyBoardEffect(parent);
        this.applyPlayerCameraWiggle();
    }
}
