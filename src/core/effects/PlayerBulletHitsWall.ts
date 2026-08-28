import {
    Scene,
    Mesh,
    TransformNode,
    ShaderMaterial,
    MeshBuilder,
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

const EFFECT_DURATION = 0.2;
const OFFSET_TO_CAMERA = 2.0;

export class PlayerBulletHitsWall extends DisposableSceneEffect implements IEffect {

    private dispose00: Nullable<Texture> = null;
    private dispose01: Nullable<Texture> = null;
    private dispose02: Nullable<Texture> = null;
    private dispose03: Nullable<Texture> = null;
    private dispose04: Nullable<Texture> = null;

    constructor(scene: Scene) {
        super(scene);
    }

    private createBillboardMesh(size: number = 1.5): Mesh {
        const plane = MeshBuilder.CreatePlane("effect-plane", { size: size }, this.scene);
        excludeMeshFromEffectLayers(this.scene, plane);
        plane.rotation.z = Math.PI;
        plane.billboardMode = Mesh.BILLBOARDMODE_ALL;
        plane.renderingGroupId = 0;
        return plane;
    }

    private initTextures(): void {
        if (!this.dispose00) {
            this.dispose00 = this.scene.metadata.textures["textures/player/bullet/dispose_00.png"];
        }
        if (!this.dispose01) {
            this.dispose01 = this.scene.metadata.textures["textures/player/bullet/dispose_01.png"];
        }
        if (!this.dispose02) {
            this.dispose02 = this.scene.metadata.textures["textures/player/bullet/dispose_02.png"];
        }
        if (!this.dispose03) {
            this.dispose03 = this.scene.metadata.textures["textures/player/bullet/dispose_03.png"];
        }
        if (!this.dispose04) {
            this.dispose04 = this.scene.metadata.textures["textures/player/bullet/dispose_04.png"];
        }
    }

    private createShaderMaterialBaseEffect(type: string = "light"): ShaderMaterial {
        const isDarkBullet = type === "dark";

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

        material.setVector3(
            "color",
            isDarkBullet ? new Vector3(0.0, 0.0, 0.0) : new Vector3(1.0, 1.0, 1.0),
        );

        return material;
    }

    private createShaderMaterialTexturesEffect(type: string = "light"): ShaderMaterial {
        this.initTextures();

        const isDarkBullet = type === "dark";

        const material = new ShaderMaterial(
            "player-bullet-hits-wall-0",
            this.scene,
            {
                vertex: "defaultEnemy",
                fragment: "playerBulletHitsWall",
            },
            {
                attributes: ["position", "uv"],
                uniforms: ["worldViewProjection", "progress", "invertColors"], // Add invertColors
                samplers: ["dispose00", "dispose01", "dispose02", "dispose03", "dispose04"],
                needAlphaBlending: true,
            },
        );

        material.setFloat("progress", 0);
        material.setFloat("invertColors", isDarkBullet ? 1.0 : 0.0);
        material.setTexture("dispose00", this.dispose00!);
        material.setTexture("dispose01", this.dispose01!);
        material.setTexture("dispose02", this.dispose02!);
        material.setTexture("dispose03", this.dispose03!);
        material.setTexture("dispose04", this.dispose04!);

        return material;
    }

    public applyBaseEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        const type = parent?.metadata?.type;

        const effectMesh = this.createBillboardMesh(10);
        const material = this.createShaderMaterialBaseEffect(type);

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

    public applyTexturesEffect(parent: Nullable<Mesh | TransformNode> = null): void {
        const type = parent?.metadata?.type;

        const effectMesh = this.createBillboardMesh();
        const material = this.createShaderMaterialTexturesEffect(type);

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

    public apply(parent: Nullable<Mesh | TransformNode> = null): void {
        this.applyBaseEffect(parent);
        this.applyTexturesEffect(parent);
    }
}
