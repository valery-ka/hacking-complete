import {
    Mesh,
    MeshBuilder,
    Scene,
    KeyboardEventTypes,
    Vector3,
    Color3,
    LinesMesh,
    Quaternion,
    TransformNode,
    Observer,
    KeyboardInfo,
} from "@babylonjs/core";

import { Nullable } from "types/common";
import { PlayerConfig } from "types/player/Player.types";

import { PlayerShooter } from "../PlayerShooter";
import { PlayerRotationController } from "./PlayerRotationController";

import { getControlScheme } from "./ControlSchemes";
import { GamepadInputManager } from "./GamepadInputManager";

import { isAimAssistActive } from "utils/autoAim";
import { syncColliderPhysics } from "utils/babylon";

export class PlayerMovementSphere {
    private scene: Scene;
    private sphereRadius: number;

    private player: Mesh | TransformNode;
    private playerCollider: Nullable<Mesh>;
    private impostor: Mesh;

    private inputMap: { [key: string]: boolean } = {};
    private controls: PlayerConfig["controls"];
    private controlScheme: ReturnType<typeof getControlScheme>;
    private isInsideSphere: boolean;

    private longitude: number | undefined;
    private latitude: number | undefined;
    private localForward: Vector3 = Vector3.Forward();

    private gamepadInputManager: GamepadInputManager;
    private rotationController: PlayerRotationController;
    private shooterController: Nullable<PlayerShooter> = null;

    private beforeRenderObserver: Nullable<Observer<Scene>> = null;
    private keyboardObserver: Nullable<Observer<KeyboardInfo>> = null;

    private debug: boolean = false;
    private rotationPlaneHelper: Mesh | null = null;
    private verticalLine: LinesMesh | null = null;
    private horizontalLine: LinesMesh | null = null;

    constructor(scene: Scene, player: Mesh | TransformNode, playerCollider: Mesh | null) {
        this.scene = scene;

        this.isInsideSphere = player.metadata.config.is_inside_ground;
        this.sphereRadius = this.getMovingRadius(player);

        this.longitude = player.metadata.config.start_position.long;
        this.latitude = player.metadata.config.start_position.lat;

        this.player = player;
        this.player.rotation.y = this.isInsideSphere ? Math.PI : 0;

        this.impostor = MeshBuilder.CreateBox("impostor");
        this.impostor.position.copyFrom(this.player.position);
        this.impostor.visibility = this.debug ? 0.1 : 0;

        this.playerCollider = playerCollider;

        const spawnPosition = this.getWorldPosition();
        syncColliderPhysics(this.playerCollider, spawnPosition);
        this.player.position.copyFrom(spawnPosition);

        this.controls = player.metadata.config.controls;
        this.controlScheme = getControlScheme(this.controls.hand);

        this.gamepadInputManager = new GamepadInputManager(this.scene);
        this.rotationController = new PlayerRotationController(player, this.gamepadInputManager);
        this.shooterController = new PlayerShooter(this.scene, player, this.gamepadInputManager);
    }

    public setPosition(position: Vector3) {
        console.log("N/A");
    }

    private getSpherePosition(): Vector3 {
        const groundID = this.player.metadata.config.ground.id;
        const groundNode = this.scene.metadata.grounds[groundID];
        return groundNode.getAbsolutePosition();
    }

    public getLocalForward(): Vector3 {
        return this.localForward;
    }

    private getMovingRadius(player: Mesh | TransformNode) {
        const radius = player.metadata.config.ground.size.d / 2;
        const hover = player.metadata.config.hover_factor;

        return radius + (this.isInsideSphere ? -hover : hover);
    }

    private getGamepadLeftStickInput(): { dx: number; dz: number } {
        if (!this.gamepadInputManager.hasGamepads()) {
            return { dx: 0, dz: 0 };
        }

        const leftStick = this.gamepadInputManager.getLeftStick();
        let dx = leftStick.x;
        let dz = leftStick.y * -1;

        return { dx, dz };
    }

    private calculateMovement(
        forward: Vector3,
        right: Vector3,
        movementSpeed: number = 14,
    ): Vector3 {
        const {
            forward: fwdKey,
            back: backKey,
            left: leftKey,
            right: rightKey,
        } = this.controlScheme;

        let movement = Vector3.Zero();

        const isLocked = this.scene.metadata.controlsLockedRef.current;
        if (isLocked) return movement;

        const gamepadInput = this.getGamepadLeftStickInput();

        const isUsingGamepad =
            this.gamepadInputManager.hasGamepads() &&
            (Math.abs(gamepadInput.dx) > 0.1 || Math.abs(gamepadInput.dz) > 0.1);

        let dx: number, dz: number;

        if (isUsingGamepad) {
            dx = gamepadInput.dx;
            dz = gamepadInput.dz;
        } else {
            dx = (this.inputMap[rightKey] ? 1 : 0) - (this.inputMap[leftKey] ? 1 : 0);
            dz = (this.inputMap[fwdKey] ? 1 : 0) - (this.inputMap[backKey] ? 1 : 0);
        }

        if (this.controls.inverted_xy[0]) dx *= -1;
        if (this.controls.inverted_xy[1]) dz *= -1;

        let finalForward = forward;
        if (this.isInsideSphere) {
            finalForward = finalForward.scale(-1);
        }

        const movementVector = finalForward
            .scale(dz * movementSpeed)
            .add(right.scale(dx * movementSpeed));

        if (!isUsingGamepad) {
            const magnitude = movementVector.length();
            if (magnitude > 0) {
                return movementVector.normalize().scale(movementSpeed);
            }
        }

        return movementVector;
    }

    private getForwardProjected(up: Vector3): Vector3 {
        return this.localForward.subtract(up.scale(Vector3.Dot(this.localForward, up))).normalize();
    }

    private getWorldPosition(): Vector3 {
        const spherePos = this.getSpherePosition();

        const x = this.sphereRadius * Math.cos(this.latitude!) * Math.cos(this.longitude!);
        const y = this.sphereRadius * Math.sin(this.latitude!);
        const z = this.sphereRadius * Math.cos(this.latitude!) * Math.sin(this.longitude!);

        const pos = new Vector3(x, y, z);

        return pos.add(spherePos);
    }

    private updatePlayer(
        mesh: Mesh | TransformNode,
        updateWithCursor: boolean,
        movementSpeed: number = 16,
    ): void {
        const spherePos = this.getSpherePosition();
        const position = mesh.position.clone().subtract(spherePos);
        const up = position.normalize();

        const forwardProjected = this.getForwardProjected(up);
        const right = Vector3.Cross(up, forwardProjected).normalize();
        const movement = this.calculateMovement(forwardProjected, right);

        if (this.playerCollider?.physicsImpostor) {
            if (!movement.equals(Vector3.Zero())) {
                const velocity = movement.normalize().scale(movementSpeed);
                this.playerCollider.physicsImpostor.setLinearVelocity(velocity);
            } else {
                this.playerCollider.physicsImpostor.setLinearVelocity(Vector3.Zero());
            }

            const physPos = this.playerCollider.getAbsolutePosition();
            const relativePos = physPos.subtract(spherePos);

            const correctedRelative = relativePos.normalize().scale(this.sphereRadius);
            const corrected = spherePos.add(correctedRelative);

            this.playerCollider.position.copyFrom(corrected);
            mesh.position.copyFrom(corrected);
        }

        this.localForward = forwardProjected;
        this.player.metadata.camera_quaternion = forwardProjected;

        const aimAssist = isAimAssistActive(this.scene, this.player?.metadata.config.aim_assist);

        this.shooterController?.updateBulletSphere(
            this.sphereRadius,
            aimAssist && this.controls.inverted_rot,
        );

        if (updateWithCursor && this.rotationPlaneHelper) {
            const { baseRotation, finalRotation } = this.rotationController.getRotationQuaternion(
                this.isInsideSphere,
                this.localForward,
                up,
            );
            this.rotationPlaneHelper.rotationQuaternion = finalRotation;

            if (!aimAssist) {
                this.player.rotationQuaternion = finalRotation;
            }

            this.player.metadata.camera_quaternion = baseRotation;

            if (this.isInsideSphere) {
                const flipXRotation = Quaternion.FromEulerAngles(Math.PI, 0, 0);
                const currentRot = this.player.rotationQuaternion!.clone();
                this.player.rotationQuaternion = currentRot!.multiply(flipXRotation);
            }

            this.playerCollider!.rotationQuaternion = finalRotation;
        } else {
            mesh.rotationQuaternion = Quaternion.FromLookDirectionRH(forwardProjected, up);
        }

        if (this.debug) this.updateHelpers();
    }

    private registerKeyboardEvents(): void {
        this.keyboardObserver = this.scene.onKeyboardObservable.add((kbInfo) => {
            const code = kbInfo.event.code;
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) this.inputMap[code] = true;
            if (kbInfo.type === KeyboardEventTypes.KEYUP) this.inputMap[code] = false;
        });
    }

    private stopMovement() {
        if (!this.playerCollider?.physicsImpostor) return;

        this.playerCollider.physicsImpostor.setLinearVelocity(Vector3.Zero());
        this.playerCollider.physicsImpostor.setAngularVelocity(Vector3.Zero());
    }

    public attachControls(): void {
        if (!this.player) return;

        if (!this.rotationPlaneHelper) {
            this.rotationPlaneHelper = MeshBuilder.CreateBox(
                "rotation-plane-helper",
                {
                    width: 2 * this.sphereRadius,
                    height: 0.01,
                    depth: 2 * this.sphereRadius,
                },
                this.scene,
            );
            this.rotationPlaneHelper.rotationQuaternion = new Quaternion();
            this.rotationPlaneHelper.visibility = this.debug ? 1 : 0;
        }

        this.registerKeyboardEvents();

        this.beforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.scene.metadata.gameClock.paused) {
                this.rotationController.updateRotationSphere(
                    this.controls.inverted_rot,
                    this.controls.inverted_xy[1],
                    isAimAssistActive(this.scene, this.player?.metadata.config.aim_assist),
                );
                this.updatePlayer(this.impostor, false);
                this.updatePlayer(this.player, true);
            } else {
                this.stopMovement();
            }
        });
    }

    private updateHelpers(): void {
        const result = createSphericalPoles(
            this.scene,
            this.impostor.position,
            this.localForward,
            this.sphereRadius,
            this.verticalLine,
            this.horizontalLine,
        );
        this.verticalLine = result.verticalLine;
        this.horizontalLine = result.horizontalLine;
    }

    public dispose(disposeGampadInput: boolean = true) {
        this.debug = false;

        this.verticalLine?.dispose();
        this.horizontalLine?.dispose();
        this.impostor?.dispose();
        this.rotationPlaneHelper?.dispose();

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

        this.rotationController.dispose();
        this.shooterController?.dispose();
    }
}

// Утилиты которые мне впадлу выносить
function createSphericalPoles(
    scene: Scene,
    meshPosition: Vector3,
    localForward: Vector3,
    sphereRadius: number,
    verticalLine: LinesMesh | null,
    horizontalLine: LinesMesh | null,
): {
    verticalLine: LinesMesh;
    horizontalLine: LinesMesh;
} {
    const steps = 64;
    const sphereCenter = new Vector3(0, 0, 0);

    const up = meshPosition.clone().normalize();

    const forwardProjected = localForward
        .subtract(up.scale(Vector3.Dot(localForward, up)))
        .normalize();
    const right = Vector3.Cross(up, forwardProjected).normalize();

    const verticalPoints: Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const point = up
            .scale(Math.cos(angle))
            .add(forwardProjected.scale(Math.sin(angle)))
            .scale(sphereRadius);
        verticalPoints.push(point.add(sphereCenter));
    }

    let updatedVerticalLine: LinesMesh;
    if (!verticalLine) {
        updatedVerticalLine = MeshBuilder.CreateLines(
            "vertical-line",
            { points: verticalPoints, updatable: true },
            scene,
        );
        updatedVerticalLine.color = Color3.Red();
    } else {
        updatedVerticalLine = MeshBuilder.CreateLines("verticalLine", {
            points: verticalPoints,
            instance: verticalLine,
        });
    }

    const greenPoints: Vector3[] = [];
    for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * Math.PI * 2;
        const point = up
            .scale(Math.cos(angle))
            .add(right.scale(Math.sin(angle)))
            .scale(sphereRadius);
        greenPoints.push(point.add(sphereCenter));
    }

    let updatedGreenLine: LinesMesh;
    if (!horizontalLine) {
        updatedGreenLine = MeshBuilder.CreateLines(
            "horizontal-line",
            { points: greenPoints, updatable: true },
            scene,
        );
        updatedGreenLine.color = Color3.Blue();
    } else {
        updatedGreenLine = MeshBuilder.CreateLines("horizontalLine", {
            points: greenPoints,
            instance: horizontalLine,
        });
    }

    return {
        verticalLine: updatedVerticalLine,
        horizontalLine: updatedGreenLine,
    };
}
