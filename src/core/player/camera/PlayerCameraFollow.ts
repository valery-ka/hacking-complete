import {
    Scene,
    TransformNode,
    Nullable,
    Vector3,
    Quaternion,
    Observer,
    Scalar,
} from "@babylonjs/core";
import { CameraConfig, CameraLockAxis } from "types/engine/Camera.types";

import { isInsideRotatedBox } from "utils/babylon";

export class PlayerCameraFollow {
    private scene: Scene;
    private player: Nullable<TransformNode>;

    private cameraTarget: Nullable<TransformNode> = null;
    private observer: Nullable<Observer<Scene>> = null;

    private initialized: boolean = false;

    private currentConfig: Nullable<CameraConfig> = null;
    private targetConfig: Nullable<CameraConfig> = null;

    private checkCooldown = 0;
    private readonly checkInterval = 0.1;

    private updateSpeed: number = 0.005;
    private fixPlayerView: boolean = false;

    /** World position captured at setup — used as the anchor for locked follow axes. */
    private lockedPosition: Nullable<Vector3> = null;
    private readonly followTargetPos = new Vector3();

    constructor(scene: Scene, player: Nullable<TransformNode>) {
        this.scene = scene;
        this.player = player;
    }

    private getActiveConfig(): Nullable<CameraConfig> {
        return (
            this.targetConfig ??
            this.currentConfig ??
            this.player?.metadata?.camera?.metadata?.config ??
            null
        );
    }

    private getLockAxes(): CameraLockAxis[] {
        return this.getActiveConfig()?.lock_axes ?? [];
    }

    private setupCameraPosition(): void {
        if (this.initialized || !this.player) return;

        const camera = this.player.metadata?.camera;
        const camera_quat = this.player.metadata?.camera_quaternion;

        if (!camera) return;

        const target = new TransformNode("camera-target", this.scene);
        camera.parent = target;

        target.position.copyFrom(this.player.position);
        this.lockedPosition = this.player.position.clone();

        if (camera_quat) {
            target.rotationQuaternion = camera_quat.clone();
        } else {
            target.rotationQuaternion = Quaternion.Identity();
        }

        this.fixPlayerView = camera.metadata.config?.fix_player_view ?? false;
        this.cameraTarget = target;
        this.initialized = true;
    }

    private updateFollowPosition(lerpSpeed: number) {
        const paused = this.scene.metadata.gameClock.paused;
        if (!this.cameraTarget || !this.player || paused) return;

        const dt = this.scene.getEngine().getDeltaTime();
        const t = 1 - Math.pow(1 - lerpSpeed, dt / 16.6667);

        this.followTargetPos.copyFrom(this.player.position);

        const lockAxes = this.getLockAxes();
        if (this.lockedPosition && lockAxes.length > 0) {
            if (lockAxes.includes("x")) this.followTargetPos.x = this.lockedPosition.x;
            if (lockAxes.includes("y")) this.followTargetPos.y = this.lockedPosition.y;
            if (lockAxes.includes("z")) this.followTargetPos.z = this.lockedPosition.z;
        }

        this.cameraTarget.position = Vector3.Lerp(
            this.cameraTarget.position,
            this.followTargetPos,
            t,
        );
    }

    private updateFollowRotation(lerpSpeed: number) {
        const paused = this.scene.metadata.gameClock.paused;
        if (!this.cameraTarget || !this.player || paused) return;

        const fixPlayerView = this.targetConfig?.fix_player_view;
        const playerRot = this.player.metadata?.camera_quaternion;

        if (playerRot) {
            const dt = this.scene.getEngine().getDeltaTime();
            const t = 1 - Math.pow(1 - lerpSpeed, dt / 16.6667);

            const curr = this.cameraTarget.rotationQuaternion ?? Quaternion.Identity();
            this.cameraTarget.rotationQuaternion = Quaternion.Slerp(curr, playerRot, t);
        } else if (!fixPlayerView) {
            const dt = this.scene.getEngine().getDeltaTime();
            const t = 1 - Math.pow(1 - lerpSpeed, dt / 16.6667);

            const curr = this.cameraTarget.rotationQuaternion ?? Quaternion.Identity();
            this.cameraTarget.rotationQuaternion = Quaternion.Slerp(curr, Quaternion.Identity(), t);
        }
    }

    public setCameraTargetConfig(config: CameraConfig, updateSpeed: number = 0.005) {
        if (this.currentConfig?.trigger_id === config.trigger_id) return;

        this.targetConfig = config;
        this.updateSpeed = updateSpeed;

        const camera = this.player?.metadata?.camera;
        if (camera) {
            camera.metadata.config = this.targetConfig;
        }
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
        const paused = this.scene.metadata.gameClock.paused;
        if (!this.player || !this.targetConfig || paused) return;

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

        this.updateConfigCameraParams((this.updateSpeed * 165) / 60);

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

    private rotateWithPlayer(lerpSpeed: number) {
        const paused = this.scene.metadata.gameClock.paused;
        if (!this.player || paused) return;

        const playerRot = this.player.rotation;
        if (!playerRot || !this.cameraTarget) return;

        const dt = this.scene.getEngine().getDeltaTime();
        const t = 1 - Math.pow(1 - lerpSpeed, dt / 16.6667);

        const targetRot = Quaternion.FromEulerAngles(0, playerRot.y, 0);
        const currentRot = this.cameraTarget.rotationQuaternion ?? Quaternion.Identity();

        this.cameraTarget.rotationQuaternion = Quaternion.Slerp(currentRot, targetRot, t);
    }

    private zaebalo(): void {
        return;
    }

    public attachCamera(lerpSpeed: number = 0.08): void {
        if (this.observer) return;

        let frame = 0;
        const targetFrames = 5;

        this.observer = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.player) return;

            const dt = this.scene.metadata.gameClock.getGlobalDeltaTime();
            const lerpFactor = frame < targetFrames ? 1.0 : lerpSpeed;

            this.setupCameraPosition();

            const fixPlayerView = this.targetConfig?.fix_player_view || this.fixPlayerView;

            const playerIsDeadRef = this.scene.metadata.playerIsDeadRef;
            if (playerIsDeadRef.current) return;

            if (!this.targetConfig?.no_follow) {
                this.updateFollowPosition(lerpFactor);
                fixPlayerView
                    ? this.rotateWithPlayer(lerpFactor)
                    : this.updateFollowRotation(lerpFactor);
                this.updateCameraConfig();
            } else {
                this.setFixedCameraPosition(lerpFactor);
                fixPlayerView ? this.rotateWithPlayer(lerpFactor) : this.zaebalo();
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
        this.lockedPosition = null;
    }
}
