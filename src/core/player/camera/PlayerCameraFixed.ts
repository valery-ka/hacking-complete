import {
    Scene,
    TransformNode,
    Nullable,
    Vector3,
    Quaternion,
    Observer,
    Scalar,
} from "@babylonjs/core";
import { CameraConfig } from "types/engine/Camera.types";

import { isInsideRotatedBox } from "utils/babylon";

export class PlayerCameraFixed {
    private scene: Scene;
    private player: Nullable<TransformNode>;

    private cameraTarget: Nullable<TransformNode> = null;
    private observer: Nullable<Observer<Scene>> = null;

    private initialized: boolean = false;

    private currentConfig: Nullable<CameraConfig> = null;
    private targetConfig: Nullable<CameraConfig> = null;

    private checkCooldown = 0;
    private readonly checkInterval = 0.5;

    constructor(scene: Scene, player: Nullable<TransformNode>) {
        this.scene = scene;
        this.player = player;
    }

    private setupCameraPosition(): void {
        if (this.initialized || !this.player) return;

        const camera = this.player.metadata?.camera;
        const camera_quat = this.player.metadata?.camera_quaternion;

        if (!camera) return;

        const target = new TransformNode("camera-target", this.scene);
        camera.parent = target;

        const startTarget = this.currentConfig?.target;
        const targetVector3 = new Vector3(
            startTarget?.x ?? 0,
            startTarget?.y ?? 0,
            startTarget?.z ?? 0,
        );
        target.position.copyFrom(targetVector3);

        if (camera_quat) {
            target.rotationQuaternion = camera_quat.clone();
        } else {
            target.rotationQuaternion = Quaternion.Identity();
        }

        this.cameraTarget = target;
        this.initialized = true;
    }

    public setCameraTargetConfig(config: CameraConfig) {
        if (this.currentConfig?.trigger_id === config.trigger_id) return;
        this.targetConfig = config;
    }

    private updateConfigCameraParams(lerpSpeed: number) {
        if (!this.player || !this.targetConfig) return;
        const camera = this.player.metadata?.camera;
        if (!camera) return;

        const dt = this.scene.getEngine().getDeltaTime();
        const t = 1 - Math.pow(1 - lerpSpeed, dt / 16.6667);

        camera.alpha = Scalar.Lerp(camera.alpha, this.targetConfig.alpha.value, t);
        camera.beta = Scalar.Lerp(camera.beta, this.targetConfig.beta.value, t);
        camera.radius = Scalar.Lerp(camera.radius, this.targetConfig.radius, t);
    }

    private cameraHasReachedTarget(): boolean | null {
        if (!this.player || !this.targetConfig) return false;
        const camera = this.player.metadata?.camera;
        if (!camera) return false;

        const cfg = this.targetConfig;

        return (
            Math.abs(camera.radius - cfg.radius) < 0.05 &&
            Math.abs(camera.alpha - cfg.alpha.value) < 0.01 &&
            Math.abs(camera.beta - cfg.beta.value) < 0.01 &&
            this.cameraTarget &&
            Vector3.Distance(
                this.cameraTarget.position,
                new Vector3(cfg.target.x, cfg.target.y, cfg.target.z),
            ) < 0.05
        );
    }

    private updateCameraConfig() {
        const paused = this.scene.metadata.gameClock.paused;
        if (!this.targetConfig || paused) return;

        this.updateConfigCameraParams((0.005 * 165) / 60);

        if (this.cameraHasReachedTarget()) {
            this.currentConfig = this.targetConfig;
            this.targetConfig = null;
        }
    }

    private checkPlayerPosition(deltaTime: number) {
        const paused = this.scene.metadata.gameClock.paused;
        if (paused) return;

        this.checkCooldown += deltaTime;

        if (this.checkCooldown < this.checkInterval) {
            return;
        }

        this.checkCooldown = 0;

        const player = this.player;
        if (!player) return;

        const triggers = this.scene.metadata.triggers;
        const configs = this.scene.metadata.configs.camera;

        for (const trigger of triggers) {
            if (!trigger.metadata) continue;
            if (trigger.metadata.action !== "camera") continue;

            if (isInsideRotatedBox(player.position, trigger)) {
                const poolId = trigger.metadata.pool;

                const cfg = configs.find((c: CameraConfig) => c.trigger_id === poolId);

                if (cfg) {
                    this.setCameraTargetConfig(cfg);
                }
            }
        }
    }

    public attachCamera(): void {
        if (this.observer) return;

        this.observer = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.player) return;

            const dt = this.scene.metadata.gameClock.getGlobalDeltaTime();

            this.setupCameraPosition();

            this.updateCameraConfig();

            this.checkPlayerPosition(dt);
        });
    }

    public dispose(): void {
        if (this.observer) {
            this.scene.onBeforeRenderObservable.remove(this.observer);
            this.observer = null;
        }

        if (this.cameraTarget) {
            this.cameraTarget.dispose();
            this.cameraTarget = null;
        }

        this.player = null;
        this.initialized = false;
        this.currentConfig = null;
        this.targetConfig = null;
    }
}
