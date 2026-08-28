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

export class PlayerCameraThirdPerson {
    private scene: Scene;
    private player: Nullable<TransformNode>;

    private cameraTarget: Nullable<TransformNode> = null;
    private observer: Nullable<Observer<Scene>> = null;

    private initialized: boolean = false;

    private currentConfig: Nullable<CameraConfig> = null;
    private targetConfig: Nullable<CameraConfig> = null;

    private checkCooldown = 0;
    private readonly checkInterval = 0.1;

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

        target.position.copyFrom(this.player.position);

        if (camera_quat) {
            target.rotationQuaternion = camera_quat.clone();
        } else {
            target.rotationQuaternion = Quaternion.Identity();
        }

        this.cameraTarget = target;
        this.initialized = true;
    }

    private updateFollowPosition(lerpSpeed: number) {
        const paused = this.scene.metadata.gameClock.paused;
        if (!this.cameraTarget || !this.player || paused) return;

        const dt = this.scene.getEngine().getDeltaTime();
        const t = 1 - Math.pow(1 - lerpSpeed, dt / 16.6667);

        this.cameraTarget.position = Vector3.Lerp(
            this.cameraTarget.position,
            this.player.position,
            t,
        );
    }

    private rotateWithPlayer(lerpSpeed: number) {
        const paused = this.scene.metadata.gameClock.paused;
        if (!this.player || paused) return;

        const playerRot = this.player.rotation;
        if (!playerRot || !this.cameraTarget) return;

        const targetRot = Quaternion.FromEulerAngles(0, playerRot.y, 0);

        const currentRot = this.cameraTarget.rotationQuaternion ?? Quaternion.Identity();

        const dt = this.scene.getEngine().getDeltaTime();
        const t = 1 - Math.pow(1 - lerpSpeed, dt / 16.6667);

        this.cameraTarget.rotationQuaternion = Quaternion.Slerp(currentRot, targetRot, t);
    }

    private setCameraTargetConfig(config: CameraConfig) {
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

        camera.target.x = Scalar.Lerp(camera.target.x, this.targetConfig.target.x, t);
        camera.target.y = Scalar.Lerp(camera.target.y, this.targetConfig.target.y, t);
        camera.target.z = Scalar.Lerp(camera.target.z, this.targetConfig.target.z, t);
    }

    private setFixedCameraPosition(lerpSpeed: number) {
        if (!this.player || !this.targetConfig) return;

        const cameraPlayer = this.player.metadata?.camera;
        const cameraTarget = this.cameraTarget;

        if (!cameraTarget || !cameraPlayer) return;

        const lerpMultiplier = 0.2;

        const dt = this.scene.getEngine().getDeltaTime();
        const t = 1 - Math.pow(1 - lerpSpeed * lerpMultiplier, dt / 16.6667);

        cameraPlayer.alpha = Scalar.Lerp(cameraPlayer.alpha, this.targetConfig.alpha.value, t);
        cameraPlayer.beta = Scalar.Lerp(cameraPlayer.beta, this.targetConfig.beta.value, t);
        cameraPlayer.radius = Scalar.Lerp(cameraPlayer.radius, this.targetConfig.radius, t);

        cameraTarget.position.x = Scalar.Lerp(
            cameraTarget.position.x,
            this.targetConfig.target.x,
            t,
        );
        cameraTarget.position.y = Scalar.Lerp(
            cameraTarget.position.y,
            this.targetConfig.target.y,
            t,
        );
        cameraTarget.position.z = Scalar.Lerp(
            cameraTarget.position.z,
            this.targetConfig.target.z,
            t,
        );
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

    public attachCamera(lerpSpeed: number = 0.08): void {
        if (this.observer) return;

        let frame = 0;
        const targetFrames = 5;

        this.observer = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.player) return;

            const dt = this.scene.metadata.gameClock.getGlobalDeltaTime();

            this.setupCameraPosition();

            if (!this.targetConfig?.no_follow) {
                this.updateFollowPosition(frame < targetFrames ? 1.0 : lerpSpeed);
                this.rotateWithPlayer(frame < targetFrames ? 1.0 : lerpSpeed);
                this.updateCameraConfig();
            } else {
                this.setFixedCameraPosition(frame < targetFrames ? 1.0 : lerpSpeed);
            }

            this.checkPlayerPosition(dt);

            frame++;
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
