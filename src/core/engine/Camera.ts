import { ArcRotateCamera, FreeCamera, Scene, Vector3 } from "@babylonjs/core";

import { Nullable } from "types/common";
import { CameraConfig } from "types/engine/Camera.types";

export class Camera {
    private scene: Scene;

    public camera: Nullable<ArcRotateCamera> | Nullable<FreeCamera> = null;
    public debugCamera: Nullable<ArcRotateCamera> = null;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public create(config: CameraConfig, id: number) {
        const { target, alpha, beta, radius } = config;

        this.camera = new ArcRotateCamera(
            `arc-rotate-camera-${id}`,
            alpha.value,
            beta.value,
            radius,
            new Vector3(target.x, target.y, target.z),
            this.scene,
        );

        this.camera.lowerBetaLimit = 0;
        this.camera.upperBetaLimit = 2 * Math.PI;

        if (config.is_orthographic) {
            this.camera.mode = 1;

            const zoom = 1.2;
            const increment = config.orthbounds_increment ?? 1;

            this.camera.orthoTop = 9 * zoom * increment;
            this.camera.orthoRight = 16 * zoom * increment;
            this.camera.orthoBottom = -9 * zoom * increment;
            this.camera.orthoLeft = -16 * zoom * increment;
        }

        this.debugCamera = new ArcRotateCamera(
            "debug-camera",
            -Math.PI / 2,
            Math.PI / 2,
            10,
            new Vector3(0, 0, 0),
            this.scene,
        );

        this.debugCamera.setPosition(new Vector3(0, 50, -0.01));

        this.camera.metadata = { ...this.camera.metadata, config: config };

        this.scene.metadata.cameras.push(this.camera);

        return this.camera;
    }

    public dispose() {
        if (this.camera) {
            this.camera.detachControl();
            this.camera.dispose();
            this.camera = null;
        }
        if (this.debugCamera) {
            this.debugCamera.detachControl();
            this.debugCamera.dispose();
            this.debugCamera = null;
        }
    }
}
