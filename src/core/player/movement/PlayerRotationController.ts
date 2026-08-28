import { Mesh, Quaternion, Vector3, TransformNode, Matrix } from "@babylonjs/core";

import { GamepadInputManager } from "./GamepadInputManager";

const AUTO_AIM_RADIUS = 25;

export class PlayerRotationController {
    private canvas!: HTMLCanvasElement;

    public targetRotationY: number = 0;
    private currentRotationY: number = 0;
    private mouseDeltaX: number = 0;

    private gamepadInputManager: GamepadInputManager;

    private pointerMoveListener: ((e: PointerEvent) => void) | null = null;
    private pointerLockChangeListener: (() => void) | null = null;
    private clickListener: (() => void) | null = null;

    constructor(
        private player: Mesh | TransformNode,
        private gamepadManager: GamepadInputManager,
        private turnSensitivity: number = 0.0025,
        private rotationSmoothing: number = 0.25,
    ) {
        this.gamepadInputManager = gamepadManager;

        this.currentRotationY = this.player.rotation.y;
        this.targetRotationY = this.player.rotation.y;

        this.setupPointerEvents();
    }

    private setupPointerEvents() {
        this.canvas = this.player.getScene().metadata.canvas as HTMLCanvasElement;
        if (!this.canvas) return;

        this.pointerMoveListener = (e: PointerEvent) => {
            if (
                document.pointerLockElement === this.canvas &&
                !this.player._scene.metadata.gameClock.paused
            ) {
                this.mouseDeltaX += e.movementX;
            }
        };
        this.canvas.addEventListener("pointermove", this.pointerMoveListener);

        this.clickListener = () => {
            if (document.pointerLockElement !== this.canvas) {
                this.canvas.requestPointerLock();
            }
        };
        this.canvas.addEventListener("click", this.clickListener);

        this.pointerLockChangeListener = () => {
            if (document.pointerLockElement !== this.canvas) {
                this.mouseDeltaX = 0;
            }
        };
        document.addEventListener("pointerlockchange", this.pointerLockChangeListener);
    }

    private getGamepadCombinedStickInput(
        ignoreLeft: boolean = false,
        hand: "left" | "right" = "left",
    ): { dx: number; dz: number } {
        if (!this.gamepadInputManager.hasGamepads()) {
            return { dx: 0, dz: 0 };
        }

        const rightStick = this.gamepadInputManager.getRightStick();
        const leftStick = this.gamepadInputManager.getLeftStick();

        // const rightActive =
        //     (Math.abs(rightStick.x) > 0.1 || Math.abs(rightStick.y) > 0.1) && hand === "right";
        // const leftActive =
        //     (Math.abs(leftStick.x) > 0.1 || Math.abs(leftStick.y) > 0.1) && hand === "left";

        const rightActive = Math.abs(rightStick.x) > 0.1 || Math.abs(rightStick.y) > 0.1;
        const leftActive = Math.abs(leftStick.x) > 0.1 || Math.abs(leftStick.y) > 0.1;

        if (rightActive) {
            return { dx: rightStick.x, dz: rightStick.y };
        } else if (leftActive && !ignoreLeft) {
            return { dx: leftStick.x, dz: leftStick.y };
        } else {
            return { dx: 0, dz: 0 };
        }
    }

    private getClosestEnemyInRadius(radius: number = AUTO_AIM_RADIUS) {
        const scene = this.player.getScene();
        const enemies = scene.metadata.enemies;

        let closestEnemy: TransformNode | null = null;
        let minDistance = radius;

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const autoaimable = enemy.metadata.config.autoaimable;

            if (!enemy.metadata.spawned || autoaimable === false || enemy.metadata.has_shield)
                continue;

            if (autoaimable !== true) {
                const enemyGround = enemy.metadata.config.is_inside_ground;
                const playerGround = this.player.metadata.config.is_inside_ground;

                if (enemy.name.includes("box") || enemyGround !== playerGround) continue;
            }

            const dist = this.player.position.subtract(enemy.position).length();

            if (dist < minDistance) {
                minDistance = dist;
                closestEnemy = enemy;
            }
        }

        return closestEnemy;
    }

    private normalizeAngle(angle: number): number {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }

    private applySmoothing(deltaTime: number) {
        const t = 1 - Math.pow(1 - this.rotationSmoothing, deltaTime / 16.6667);
        this.currentRotationY += (this.targetRotationY - this.currentRotationY) * t;
    }

    /** Frame duration relative to 60 FPS, so per-frame rotation steps stay frame-rate independent. */
    private getFrameScale(): number {
        return this.player.getScene().getEngine().getDeltaTime() / 16.6667;
    }

    private isRotationLocked(): boolean {
        if (!this.player.metadata?.config?.controls?.lock_rotation) return false;

        this.mouseDeltaX = 0;
        return true;
    }

    public updateRotationPlane(
        inverted: boolean = false,
        id: number = 0,
        useAimAssist: boolean = false,
        hand: "left" | "right",
    ) {
        const scene = this.player.getScene();
        const isLocked = scene.metadata.controlsLockedRef.current;
        if (isLocked || this.isRotationLocked()) return;

        const camera = scene.metadata.cameras[id] ?? scene.metadata.cameras[0];
        const cameraConfig = camera.metadata.config;
        const fixPlayerView = cameraConfig.fix_player_view;

        const enemy = this.getClosestEnemyInRadius();
        const gamepadInput = this.getGamepadCombinedStickInput(fixPlayerView, hand);
        const isUsingGamepadRotation =
            this.gamepadInputManager.hasGamepads() &&
            (Math.abs(gamepadInput.dx) > 0.1 || Math.abs(gamepadInput.dz) > 0.1);

        const direction = inverted ? -1 : 1;

        const dtGamePad = scene.getEngine().getDeltaTime() / 1000;

        const gameClock = scene.metadata.gameClock;
        const playerClockSpeed = gameClock.playerSpeed;

        if (enemy && useAimAssist) {
            const toEnemy = enemy.position.subtract(this.player.position);
            toEnemy.y = 0;

            if (!toEnemy.equals(Vector3.Zero())) {
                toEnemy.normalize();
                const targetAngle = Math.atan2(toEnemy.x, toEnemy.z);

                let angleDiff = this.normalizeAngle(targetAngle - this.targetRotationY);

                const maxRotationChange = this.rotationSmoothing * 2 * this.getFrameScale();
                const clampedRotationChange = Math.max(
                    Math.min(angleDiff, maxRotationChange),
                    -maxRotationChange,
                );

                this.targetRotationY += clampedRotationChange * playerClockSpeed;
            }

            this.mouseDeltaX = 0;
        } else if (isUsingGamepadRotation) {
            if (fixPlayerView) {
                const yawInput = gamepadInput.dx;
                const gamepadSensitivityFactor = 1000;

                const rotationSpeed = this.turnSensitivity * gamepadSensitivityFactor;

                const rotationDelta = yawInput * rotationSpeed * dtGamePad * direction;

                this.targetRotationY += rotationDelta * playerClockSpeed;
            } else {
                const yawInput = gamepadInput.dx;

                const camForward = camera.getForwardRay().direction.clone();
                camForward.y = 0;
                camForward.normalize();

                const camRight = Vector3.Cross(Vector3.Up(), camForward).normalize();
                const camRightScale = inverted ? -yawInput : yawInput;

                const lookDirection = camForward
                    .scale(-gamepadInput.dz)
                    .add(camRight.scale(camRightScale));

                if (!lookDirection.equals(Vector3.Zero())) {
                    const worldAngle = Math.atan2(lookDirection.x, lookDirection.z);

                    const angleDiff = this.normalizeAngle(worldAngle - this.targetRotationY);

                    const rotationSpeed = this.rotationSmoothing * 165;
                    const maxRotationChange = rotationSpeed * dtGamePad;

                    const clampedRotationChange = Math.max(
                        Math.min(angleDiff, maxRotationChange),
                        -maxRotationChange,
                    );

                    this.targetRotationY += clampedRotationChange * playerClockSpeed;
                }

                this.mouseDeltaX = 0;
            }
        } else {
            const turnSpeed = fixPlayerView ? this.turnSensitivity / 2 : this.turnSensitivity;
            this.targetRotationY += this.mouseDeltaX * turnSpeed * direction * playerClockSpeed;
            this.mouseDeltaX = 0;
        }

        const dt = scene.getEngine().getDeltaTime();
        this.applySmoothing(dt);

        if (this.player) {
            this.player.rotation.y = this.currentRotationY;
        }
    }

    protected getCylinderNormal(): Vector3 {
        const pos = this.player.getAbsolutePosition();
        return new Vector3(pos.x, 0, pos.z).normalize();
    }

    protected getCylinderTangent(normal?: Vector3): Vector3 {
        const n = normal || this.getCylinderNormal();
        return new Vector3(-n.z, 0, n.x);
    }

    public updateRotationCylinder(
        inverted: boolean = false,
        manualInversion: boolean = false,
        useAimAssist: boolean = false,
        manualCorrection: number = 0,
    ) {
        const scene = this.player.getScene();
        const isLocked = scene.metadata.controlsLockedRef.current;
        if (isLocked || this.isRotationLocked()) return;

        const enemy = this.getClosestEnemyInRadius();
        const gamepadInput = this.getGamepadCombinedStickInput();
        const isUsingGamepadRotation =
            this.gamepadInputManager.hasGamepads() &&
            (Math.abs(gamepadInput.dx) > 0.1 || Math.abs(gamepadInput.dz) > 0.1);

        const direction = inverted ? -1 : 1;

        const fixManualCorrection = this.player.metadata.config.controls.fix_cylinder_rotation;

        if (enemy && useAimAssist) {
            const up = this.getCylinderNormal();
            const tangent = inverted
                ? this.getCylinderTangent(up)
                : this.getCylinderTangent(up).scale(-1);
            const forward = Vector3.Cross(tangent, up).normalize();

            const toEnemy = enemy.position.subtract(this.player.position).normalize();
            const projected = toEnemy.subtract(up.scale(Vector3.Dot(toEnemy, up))).normalize();

            const y = Vector3.Dot(Vector3.Cross(forward, projected), up);
            const x = Vector3.Dot(forward, projected);

            const targetYawRaw = Math.atan2(y, fixManualCorrection ? -x : x);

            const targetYaw = targetYawRaw * direction;
            let angleDiff = this.normalizeAngle(targetYaw - this.targetRotationY);

            const maxRotationChange = this.rotationSmoothing * 2 * this.getFrameScale();
            const clampedRotationChange = Math.max(
                Math.min(angleDiff, maxRotationChange),
                -maxRotationChange,
            );

            this.targetRotationY += clampedRotationChange;
            this.mouseDeltaX = 0;
        } else if (isUsingGamepadRotation) {
            const rawInv = manualInversion ? -1 : 1;
            // !!!!!!!!!!!!!!!
            const rawAngle = Math.atan2(
                gamepadInput.dx * rawInv,
                -gamepadInput.dz * rawInv * direction,
            );
            const correctedRot = rawAngle + manualCorrection;

            let angleDiff = this.normalizeAngle(correctedRot - this.targetRotationY);
            const newTargetRotation = this.targetRotationY + angleDiff;
            const rotationChange = this.normalizeAngle(newTargetRotation - this.targetRotationY);

            const maxRotationChange = this.rotationSmoothing * 2 * this.getFrameScale();
            const clampedRotationChange = Math.max(
                Math.min(rotationChange, maxRotationChange),
                -maxRotationChange,
            );

            this.targetRotationY += clampedRotationChange;
            this.mouseDeltaX = 0;
        } else {
            this.targetRotationY += this.mouseDeltaX * this.turnSensitivity * direction;
            this.mouseDeltaX = 0;
        }

        const dt = scene.getEngine().getDeltaTime();
        this.applySmoothing(dt);

        if (this.player) {
            this.player.rotation.y = this.currentRotationY;
        }
    }

    private getSpherePosition(): Vector3 {
        const groundNode = this.player.metadata.ground;
        return groundNode.getAbsolutePosition();
    }

    protected getSphereUp(): Vector3 {
        const spherePos = this.getSpherePosition();
        const relativePos = this.player.position.subtract(spherePos);
        return relativePos.normalize();
    }

    protected getSphereTangent(up?: Vector3): Vector3 {
        const u = up || this.getSphereUp();
        let tangent: Vector3;

        if (Math.abs(u.y) > 0.999) {
            tangent = Vector3.Cross(u, Vector3.Forward());
            if (tangent.lengthSquared() < 1e-6) {
                tangent = Vector3.Cross(u, Vector3.Right());
            }
        } else {
            tangent = Vector3.Cross(u, Vector3.Up());
        }

        return tangent.normalize();
    }

    public getCurrentSphereYaw(): number {
        const up = this.getSphereUp();
        const forward = this.player.forward || Vector3.Forward();

        const projected = forward.subtract(up.scale(Vector3.Dot(forward, up))).normalize();
        const tangent = this.getSphereTangent(up);
        const refForward = Vector3.Cross(tangent, up).normalize();

        return Math.atan2(
            Vector3.Dot(Vector3.Cross(refForward, projected), up),
            Vector3.Dot(refForward, projected),
        );
    }

    private applySphereRotation(yaw: number): void {
        const up = this.getSphereUp();
        const tangent = this.getSphereTangent(up);
        const forward = Vector3.Cross(tangent, up).normalize();

        const rotationMat = Matrix.RotationAxis(up, yaw);
        const finalForward = Vector3.TransformCoordinates(forward, rotationMat).normalize();

        this.player.rotationQuaternion = Quaternion.FromLookDirectionRH(finalForward, up);
    }

    public updateRotationSphere(
        inverted: boolean = false,
        manualInversion: boolean = false,
        useAimAssist: boolean = false,
    ) {
        const scene = this.player.getScene();
        const isLocked = scene.metadata.controlsLockedRef.current;
        if (isLocked || this.isRotationLocked()) return;

        const enemy = this.getClosestEnemyInRadius();
        const gamepadInput = this.getGamepadCombinedStickInput();
        const isUsingGamepadRotation =
            this.gamepadInputManager.hasGamepads() &&
            (Math.abs(gamepadInput.dx) > 0.1 || Math.abs(gamepadInput.dz) > 0.1);

        const direction = inverted ? -1 : 1;

        if (enemy && useAimAssist) {
            const up = this.getSphereUp();
            const tangent = this.getSphereTangent(up).scale(inverted ? -1 : 1);
            const forward = Vector3.Cross(tangent, up).normalize();

            const toEnemy = enemy.position.subtract(this.player.position).normalize();
            const projected = toEnemy.subtract(up.scale(Vector3.Dot(toEnemy, up))).normalize();

            const targetYawRaw = Math.atan2(
                Vector3.Dot(Vector3.Cross(forward, projected), up),
                Vector3.Dot(forward, projected),
            );

            const targetYaw = targetYawRaw;
            let angleDiff = this.normalizeAngle(targetYaw - this.targetRotationY);

            const maxRotationChange = this.rotationSmoothing * 2 * this.getFrameScale();
            const clampedRotationChange = Math.max(
                Math.min(angleDiff, maxRotationChange),
                -maxRotationChange,
            );

            this.targetRotationY += clampedRotationChange;
            this.mouseDeltaX = 0;
        } else if (isUsingGamepadRotation) {
            const rawInv = manualInversion ? -1 : 1;
            const rawAngle = Math.atan2(gamepadInput.dx, -gamepadInput.dz * rawInv);

            let angleDiff = this.normalizeAngle(rawAngle - this.targetRotationY);
            const newTargetRotation = this.targetRotationY + angleDiff;
            const rotationChange = this.normalizeAngle(newTargetRotation - this.targetRotationY);

            const maxRotationChange = this.rotationSmoothing * 2 * this.getFrameScale();
            const clampedRotationChange = Math.max(
                Math.min(rotationChange, maxRotationChange),
                -maxRotationChange,
            );

            this.targetRotationY += clampedRotationChange;
            this.mouseDeltaX = 0;
        } else {
            this.targetRotationY += this.mouseDeltaX * this.turnSensitivity * direction;
            this.mouseDeltaX = 0;
        }

        const dt = scene.getEngine().getDeltaTime();
        this.applySmoothing(dt);

        if (this.player && useAimAssist) {
            this.applySphereRotation(this.currentRotationY);
        }
    }

    public getRotationQuaternion(
        insideMovement: boolean,
        localForward: Vector3,
        up: Vector3 = Vector3.Up(),
    ) {
        const baseRotation = Quaternion.FromLookDirectionRH(localForward, up);
        const mouseRotation = Quaternion.RotationYawPitchRoll(
            insideMovement ? -this.currentRotationY : this.currentRotationY,
            0,
            0,
        );

        return { baseRotation: baseRotation, finalRotation: baseRotation.multiply(mouseRotation) };
    }

    public getCurrentRotation(): number {
        return this.currentRotationY;
    }

    public dispose() {
        if (this.canvas && this.pointerMoveListener) {
            this.canvas.removeEventListener("pointermove", this.pointerMoveListener);
            this.pointerMoveListener = null;
        }
        if (this.canvas && this.clickListener) {
            this.canvas.removeEventListener("click", this.clickListener);
            this.clickListener = null;
        }
        if (this.pointerLockChangeListener) {
            document.removeEventListener("pointerlockchange", this.pointerLockChangeListener);
            this.pointerLockChangeListener = null;
        }
    }
}
