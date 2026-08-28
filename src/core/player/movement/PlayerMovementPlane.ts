import {
    Scene,
    Vector3,
    Mesh,
    TransformNode,
    Nullable,
    KeyboardEventTypes,
    Observer,
    KeyboardInfo,
} from "@babylonjs/core";

import { PlayerConfig } from "types/player/Player.types";

import { PlayerShooter } from "../PlayerShooter";
import { PlayerRotationController } from "./PlayerRotationController";
import { GamepadInputManager } from "./GamepadInputManager";

import { getControlScheme } from "./ControlSchemes";

import { isAimAssistActive } from "utils/autoAim";
import { syncColliderPhysics } from "utils/babylon";

export class PlayerMovementPlane {
    private scene: Scene;

    private player: Nullable<TransformNode>;
    private playerId: number;

    private playerHover: number;

    private playerCollider: Nullable<Mesh>;

    private controls: PlayerConfig["controls"];
    private isInsideMovement: boolean;

    private gamepadInputManager: GamepadInputManager;
    private rotationController: PlayerRotationController;
    private shooterController: Nullable<PlayerShooter> = null;

    private keyboardObserver: Nullable<Observer<KeyboardInfo>> = null;
    private beforeRenderObserver: Nullable<Observer<Scene>> = null;

    constructor(scene: Scene, player: Nullable<TransformNode>, playerCollider: Nullable<Mesh>) {
        this.scene = scene;

        this.player = player;
        this.playerId = player?.metadata.config.id;

        this.playerHover = player?.metadata.config.hover_factor;

        const startPos = player?.metadata.config.start_position;
        this.playerCollider = playerCollider;

        this.controls = player?.metadata.config.controls;
        this.isInsideMovement = player?.metadata.config.is_inside_ground;

        const spawnPosition = new Vector3(startPos.x, this.getHoverOnPlane(), startPos.z);
        syncColliderPhysics(this.playerCollider, spawnPosition);
        this.player!.position.copyFrom(spawnPosition);

        this.player!.rotation.z = this.isInsideMovement ? Math.PI : 0;
        this.player!.rotation.y = this.player?.metadata?.config?.start_rotation ?? 0;

        this.gamepadInputManager = new GamepadInputManager(this.scene);
        this.rotationController = new PlayerRotationController(
            this.player!,
            this.gamepadInputManager,
        );
        this.shooterController = new PlayerShooter(
            this.scene,
            this.player!,
            this.gamepadInputManager,
        );
    }

    public setPosition(position: Vector3) {
        syncColliderPhysics(this.playerCollider, position);
        this.player?.position.copyFrom(position);
    }

    protected getHoverOnPlane() {
        const height = this.player?.metadata.config.ground.size / 2;
        const hover = height + this.playerHover;

        return this.isInsideMovement ? -hover : hover;
    }

    private getGamepadLeftStickInput(): { dx: number; dz: number } {
        if (!this.gamepadInputManager.hasGamepads()) {
            return { dx: 0, dz: 0 };
        }

        const leftStick = this.gamepadInputManager.getLeftStick();
        let dx = leftStick.x;
        let dz = leftStick.y * -1;

        if (this.controls.inverted_xy[0]) dx *= -1;
        if (this.controls.inverted_xy[1]) dz *= -1;

        return { dx, dz };
    }

    private getGamepadRightStickInput(): { dx: number; dz: number } {
        if (!this.gamepadInputManager.hasGamepads()) {
            return { dx: 0, dz: 0 };
        }

        const rightStick = this.gamepadInputManager.getRightStick();
        let dx = rightStick.x;
        let dz = rightStick.y * -1;

        if (this.controls.inverted_xy[0]) dx *= -1;
        if (this.controls.inverted_xy[1]) dz *= -1;

        return { dx, dz };
    }

    private updateMovement(dx: number, dz: number, baseSpeed: number) {
        if (!this.playerCollider?.physicsImpostor) return;

        const isLocked = this.scene.metadata.controlsLockedRef.current;
        if (isLocked) {
            this.stopMovement();
            return;
        }

        const camera = this.scene.metadata.cameras[this.playerId] ?? this.scene.metadata.cameras[0];
        const camForward = camera.getForwardRay().direction.clone();
        camForward.y = 0;
        camForward.normalize();

        const camRight = Vector3.Cross(Vector3.Up(), camForward).normalize();
        let moveVector = camForward.scale(dz).add(camRight.scale(dx));

        if (!moveVector.equals(Vector3.Zero())) {
            const stickForce = moveVector.length();
            const clampedForce = Math.min(1.0, stickForce);
            const velocity = moveVector.normalize().scale(baseSpeed * clampedForce);

            this.playerCollider.physicsImpostor.setLinearVelocity(velocity);
        } else {
            this.playerCollider.physicsImpostor.setLinearVelocity(new Vector3(0, 0, 0));
        }

        this.playerCollider.position.y = this.getHoverOnPlane();

        if (this.player) {
            this.player.position.copyFrom(this.playerCollider.position);
        }
    }

    private stopMovement() {
        if (!this.playerCollider?.physicsImpostor) return;

        this.playerCollider.physicsImpostor.setLinearVelocity(Vector3.Zero());
        this.playerCollider.physicsImpostor.setAngularVelocity(Vector3.Zero());
    }

    public attachControls(speed: number = 11) {
        if (!this.player) return;

        const gameClock = this.scene.metadata.gameClock;

        const inputMap: Record<string, boolean> = {};
        const controlScheme = getControlScheme(this.controls.hand);

        this.keyboardObserver = this.scene.onKeyboardObservable.add((kbInfo) => {
            const code = kbInfo.event.code;
            inputMap[code] = kbInfo.type === KeyboardEventTypes.KEYDOWN;
        });

        this.beforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.player) return;

            let dx =
                (inputMap[controlScheme.right] ? 1 : 0) - (inputMap[controlScheme.left] ? 1 : 0);
            let dz =
                (inputMap[controlScheme.forward] ? 1 : 0) - (inputMap[controlScheme.back] ? 1 : 0);

            const gamepadInput =
                this.controls.hand === "right"
                    ? this.getGamepadRightStickInput()
                    : this.getGamepadLeftStickInput();

            if (
                this.gamepadInputManager.hasGamepads() &&
                (Math.abs(gamepadInput.dx) > 0.01 || Math.abs(gamepadInput.dz) > 0.01)
            ) {
                dx = gamepadInput.dx;
                dz = gamepadInput.dz;
            } else {
                if (this.controls.inverted_xy[0]) dx *= -1;
                if (this.controls.inverted_xy[1]) dz *= -1;
            }

            const currentSpeed = speed * gameClock.playerSpeed;

            if (!gameClock.paused) {
                this.updateMovement(dx, dz, currentSpeed);
                this.shooterController?.updateBulletPlane();
                this.rotationController?.updateRotationPlane(
                    this.controls.inverted_rot,
                    this.playerId,
                    isAimAssistActive(this.scene, this.player?.metadata.config.aim_assist),
                    this.controls.hand,
                );
            } else {
                this.stopMovement();
            }
        });
    }

    public dispose(disposeGampadInput: boolean = true) {
        if (this.beforeRenderObserver) {
            this.scene.onBeforeRenderObservable.remove(this.beforeRenderObserver);
            this.beforeRenderObserver = null;
        }

        if (this.keyboardObserver) {
            this.scene.onKeyboardObservable.remove(this.keyboardObserver);
            this.keyboardObserver = null;
        }

        if (disposeGampadInput) {
            this.gamepadInputManager.dispose();
        }

        this.rotationController?.dispose();
        this.shooterController?.dispose();
    }
}
