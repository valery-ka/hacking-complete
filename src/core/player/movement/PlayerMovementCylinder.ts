import {
    Mesh,
    MeshBuilder,
    Scene,
    KeyboardEventTypes,
    Vector3,
    LinesMesh,
    TransformNode,
    Observer,
    KeyboardInfo,
    Matrix,
    Quaternion,
    Color3,
} from "@babylonjs/core";

import { Nullable } from "types/common";
import { PlayerConfig } from "types/player/Player.types";

import { PlayerShooter } from "../PlayerShooter";
import { PlayerRotationController } from "./PlayerRotationController";

import { getControlScheme } from "./ControlSchemes";
import { GamepadInputManager } from "./GamepadInputManager";

import { isAimAssistActive } from "utils/autoAim";
import { syncColliderPhysics } from "utils/babylon";

export class PlayerMovementCylinder {
    private scene: Scene;

    private isInsideCylinder: boolean;
    private radius: number;
    private height: number;

    private player: Mesh | TransformNode;
    private playerCollider: Nullable<Mesh>;

    private inputMap: { [key: string]: boolean } = {};
    private controlScheme: ReturnType<typeof getControlScheme>;
    private controls: PlayerConfig["controls"];

    private gamepadInputManager: GamepadInputManager;
    private rotationController: Nullable<PlayerRotationController>;
    private shooterController: Nullable<PlayerShooter> = null;

    private beforeRenderObserver: Nullable<Observer<Scene>> = null;
    private keyboardObserver: Nullable<Observer<KeyboardInfo>> = null;

    private angle: number | undefined;
    private verticalOffset: number | undefined;
    private localForward = Vector3.Forward();

    private debug: boolean = false;
    private rotationPlaneHelper: Mesh | null = null;
    private localAxisLines: {
        forward?: LinesMesh;
        right?: LinesMesh;
    } = {};

    constructor(scene: Scene, player: Mesh | TransformNode, playerCollider: Mesh | null) {
        this.scene = scene;

        this.isInsideCylinder = player.metadata.config.is_inside_ground;
        this.radius = this.getMovingRadius(player);
        this.height = player.metadata.config.ground.size.h;

        this.angle = player.metadata.config.start_position.long;
        this.verticalOffset = player.metadata.config.start_position.h;

        this.player = player;

        this.playerCollider = playerCollider;

        this.controls = player.metadata.config.controls;
        this.controlScheme = getControlScheme(this.controls.hand);

        const spawnPosition = this.getWorldPosition();
        syncColliderPhysics(this.playerCollider, spawnPosition);
        this.player.position.copyFrom(spawnPosition);
        this.player.rotation.y = -Math.PI / 2;

        this.gamepadInputManager = new GamepadInputManager(this.scene);
        this.rotationController = new PlayerRotationController(player, this.gamepadInputManager);
        this.shooterController = new PlayerShooter(this.scene, player, this.gamepadInputManager);
    }

    public setPosition(position: Vector3) {
        console.log("N/A");
    }

    private getCylinderPosition(): Vector3 {
        const groundID = this.player.metadata.config.ground.id;
        const groundNode = this.scene.metadata.grounds[groundID];
        return groundNode.getAbsolutePosition();
    }

    private getMovingRadius(player: Mesh | TransformNode) {
        const radius = player.metadata.config.ground.size.d / 2;
        const hover = player.metadata.config.hover_factor;

        return radius + (this.isInsideCylinder ? -hover : hover);
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

    private calculateMovement(movementSpeed: number = 13): Vector3 {
        let movement = Vector3.Zero();

        const isLocked = this.scene.metadata.controlsLockedRef.current;
        if (isLocked) return movement;

        const tangent = this.getCylindricalTangent();
        const { forward, back, left, right } = this.controlScheme;

        const [invertX, invertY] = this.controls.inverted_xy;
        const invertForwardRight = this.controls.inverted_fr;

        const xMult = invertX ? -1 : 1;
        const yMult = invertY ? -1 : 1;

        const leftStickInput = this.getGamepadLeftStickInput();
        const rightStickInput = this.getGamepadRightStickInput();

        const gamepadInput = this.controls.hand === "right" ? rightStickInput : leftStickInput;

        const isUsingGamepad =
            this.gamepadInputManager.hasGamepads() &&
            (Math.abs(gamepadInput.dx) > 0.1 || Math.abs(gamepadInput.dz) > 0.1);

        let dx: number, dy: number;

        if (isUsingGamepad) {
            dx = gamepadInput.dx * xMult;
            dy = gamepadInput.dz * yMult;

            if (invertForwardRight) {
                const tmp = dx;
                dx = dy;
                dy = tmp;
            }
        } else {
            dx = (this.inputMap[right] ? 1 : 0) - (this.inputMap[left] ? 1 : 0);
            dy = (this.inputMap[forward] ? 1 : 0) - (this.inputMap[back] ? 1 : 0);

            if (invertForwardRight) {
                const tmp = dx;
                dx = dy;
                dy = tmp;
            }

            const magnitude = Math.sqrt(dx * dx + dy * dy);
            if (magnitude > 0) {
                dx = dx / magnitude;
                dy = dy / magnitude;
            }
        }

        const tangentMove = tangent.scale(dx * movementSpeed * xMult);
        const verticalMove = Vector3.Up().scale(dy * movementSpeed * yMult);

        movement = movement.add(tangentMove).add(verticalMove);

        return movement;
    }

    private getCylindricalTangent(): Vector3 {
        const tangentX = -Math.sin(this.angle!);
        const tangentZ = Math.cos(this.angle!);

        return new Vector3(tangentX, 0, tangentZ).normalize();
    }

    private getWorldPosition(): Vector3 {
        const cylinderPos = this.getCylinderPosition();

        const x = Math.cos(this.angle!) * this.radius;
        const y = this.verticalOffset;
        const z = Math.sin(this.angle!) * this.radius;
        const pos = new Vector3(x, y, z);

        const rotatedPos = Vector3.TransformCoordinates(pos, Matrix.RotationY(Math.PI / 2));
        return cylinderPos.add(rotatedPos);
    }

    private updatePlayer(): void {
        if (!this.playerCollider?.physicsImpostor) return;

        const movement = this.calculateMovement();

        this.playerCollider.physicsImpostor.setLinearVelocity(movement);

        const pos = this.playerCollider.getAbsolutePosition();

        const cylinderPos = this.getCylinderPosition();
        const localPos = pos.subtract(cylinderPos);

        const horizontal = new Vector3(localPos.x, 0, localPos.z).normalize().scale(this.radius);

        const clamp = 0.25;
        const clampedY = Math.max(
            -this.height / 2 + clamp,
            Math.min(this.height / 2 - clamp, localPos.y),
        );

        const correctedLocalPos = new Vector3(horizontal.x, clampedY, horizontal.z);
        const correctedPos = cylinderPos.add(correctedLocalPos);

        this.player.position.copyFrom(correctedPos);
        this.playerCollider.position.copyFrom(correctedPos);

        this.angle = Math.atan2(correctedLocalPos.z, correctedLocalPos.x);
        this.verticalOffset = Math.max(
            -this.height / 2,
            Math.min(this.height / 2, correctedLocalPos.y),
        );

        const forward = correctedLocalPos.clone().normalize();

        const targetRotation = Quaternion.RotationAxis(
            Vector3.Up(),
            Math.atan2(forward.x, forward.z),
        );

        const tiltAngle = this.isInsideCylinder ? -Math.PI / 2 : Math.PI / 2;
        const initialTilt = Quaternion.FromEulerAngles(tiltAngle, 0, 0);

        const combinedRot = targetRotation.multiply(initialTilt);

        this.rotationPlaneHelper!.rotationQuaternion = combinedRot;
        this.player.rotationQuaternion = combinedRot;
        this.player.metadata.camera_quaternion = combinedRot;
        this.playerCollider.rotationQuaternion = combinedRot;

        if (this.rotationController) {
            const rotationY = this.rotationController.getCurrentRotation();
            const playerRot = this.player.rotationQuaternion || Quaternion.Identity();
            const mouseRotation = Quaternion.FromEulerAngles(0, rotationY, 0);

            this.player.rotationQuaternion = playerRot.multiply(mouseRotation);
        }

        this.localForward = getLocalDirection(0, this.player.getWorldMatrix());
        this.shooterController?.updateBulletCylinder(
            this.verticalOffset,
            this.localForward,
            this.radius,
        );

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
                "rotation-plane-helper-player",
                {
                    width: 2 * this.radius,
                    height: 0.01,
                    depth: 2 * this.radius,
                },
                this.scene,
            );

            this.rotationPlaneHelper.rotationQuaternion = new Quaternion();
            this.rotationPlaneHelper.isVisible = this.debug ? true : false;
        }

        this.registerKeyboardEvents();

        this.beforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.scene.metadata.gameClock.paused) {
                this.rotationController!.updateRotationCylinder(
                    this.controls.inverted_rot,
                    true,
                    isAimAssistActive(this.scene, this.player?.metadata.config.aim_assist),
                    this.controls.manual_rot,
                );
                this.updatePlayer();
            } else {
                this.stopMovement();
            }
        });
    }

    private updateHelpers(length: number = 32, segments: number = 32): void {
        this.localAxisLines.forward = createCylinderLine(
            length,
            segments,
            this.player.position.clone(),
            this.localForward.clone(),
            this.radius,
            this.localAxisLines.forward || null,
            this.scene,
            "cylinder-forward",
            Color3.Red(),
        );

        this.localAxisLines.right = createCylinderLine(
            length,
            segments,
            this.player.position.clone(),
            getLocalDirection(Math.PI / 2, this.player.getWorldMatrix()),
            this.radius,
            this.localAxisLines.right || null,
            this.scene,
            "cylinder-right",
            Color3.Blue(),
        );
    }

    public dispose(disposeGampadInput: boolean = true) {
        this.debug = false;

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

        if (this.rotationController) {
            this.rotationController.dispose();
            this.rotationController = null;
        }

        if (this.rotationPlaneHelper) {
            this.rotationPlaneHelper.dispose();
            this.rotationPlaneHelper = null;
        }

        this.shooterController?.dispose();

        for (const key of Object.keys(
            this.localAxisLines,
        ) as (keyof typeof this.localAxisLines)[]) {
            if (this.localAxisLines[key]) {
                this.localAxisLines[key]!.dispose();
                this.localAxisLines[key] = undefined;
            }
        }
    }
}

function createCylinderLine(
    segments: number,
    length: number,
    startPos: Vector3,
    dir: Vector3,
    radius: number,
    line: LinesMesh | null,
    scene: Scene,
    name: string,
    color: Color3,
): LinesMesh {
    const points: Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const distance = t * length;

        const offset = dir.scale(distance);
        let tempPos = startPos.add(offset);

        const horizontal = new Vector3(tempPos.x, 0, tempPos.z).normalize().scale(radius);
        const finalPos = new Vector3(horizontal.x, tempPos.y, horizontal.z);

        points.push(finalPos);
    }

    if (!line) {
        line = MeshBuilder.CreateLines(name, { points, updatable: true }, scene);
        line.color = color;
    } else {
        MeshBuilder.CreateLines(name, { points, instance: line });
    }

    return line;
}

function getLocalDirection(angleRad: number, worldMatrix: Matrix): Vector3 {
    const localDir = Vector3.TransformNormal(
        new Vector3(Math.sin(angleRad), 0, Math.cos(angleRad)),
        worldMatrix,
    ).normalize();

    return localDir;
}
