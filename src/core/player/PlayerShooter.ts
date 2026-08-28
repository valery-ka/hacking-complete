import {
    Scene,
    TransformNode,
    Vector3,
    Observer,
    PointerInfo,
    PointerEventTypes,
} from "@babylonjs/core";

import { Nullable } from "types/common";

import { PlaneBullet } from "../bullet/PlaneBullet";
import { SphereBullet } from "../bullet/SphereBullet";
import { CylinderBullet } from "../bullet/CylinderBullet";
import { GamepadInputManager } from "./movement/GamepadInputManager";

import { PlayerAudioEngine } from "core/audio/PlayerAudioEngine";

const LMB = 0;
const RMB = 2;

export class PlayerShooter {
    private scene: Scene;
    private player: TransformNode;
    private playerID: number;

    private bullets: (PlaneBullet | CylinderBullet | SphereBullet)[] = [];

    // Разделяем кулдауны для разных типов пуль
    private lastFireTimeLight = 0;
    private lastFireTimeDark = 0;
    private fireCooldown = 0.1;

    private isLeftMouseDown = false;
    private isRightMouseDown = false;
    private pointerObserver: Nullable<Observer<PointerInfo>> = null;

    private gamepadInputManager: GamepadInputManager;

    private audioEngine: PlayerAudioEngine;

    constructor(scene: Scene, player: TransformNode, gamepadManager: GamepadInputManager) {
        this.scene = scene;
        this.player = player;
        this.playerID = player.metadata.config.id;
        this.gamepadInputManager = gamepadManager;
        this.attachPointerControls();

        this.scene.metadata.players_shooter_classes.push(this);

        this.audioEngine = scene.metadata.audio_engine?.getPlayerAudio();
    }

    //
    // General start
    private attachPointerControls() {
        this.pointerObserver = this.scene.onPointerObservable.add((pointerInfo) => {
            const event = pointerInfo.event;
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERDOWN:
                    if (event.button === LMB) this.isLeftMouseDown = true;
                    if (event.button === RMB) this.isRightMouseDown = true;
                    break;
                case PointerEventTypes.POINTERUP:
                    if (event.button === LMB) this.isLeftMouseDown = false;
                    if (event.button === RMB) this.isRightMouseDown = false;
                    break;
            }
        });
    }

    private canFire(type: "light" | "dark"): boolean {
        const now = performance.now() / 1000;
        const isLocked = this.scene.metadata.controlsLockedRef.current;

        if (isLocked) return false;

        const gameClock = this.scene.metadata.gameClock;
        const currentCooldown = this.fireCooldown / gameClock.playerSpeed;

        const allowedType = this.player.metadata.config.shooter_bullets;
        if (allowedType !== "god" && type !== allowedType) {
            return false;
        }

        if (type === "light") {
            if (now - this.lastFireTimeLight < currentCooldown) return false;
            this.lastFireTimeLight = now;
        } else if (type === "dark") {
            if (now - this.lastFireTimeDark < currentCooldown) return false;
            this.lastFireTimeDark = now;
        }

        this.audioEngine?.playSound("player_bullet_fire", 1.0, this.player);

        if (this.player.metadata.aoe_overheat.enabled) {
            this.player.metadata.aoe_overheat.factor += 0.15;
        }

        return true;
    }

    private updateBulletDeltaTime() {
        const gameClock = this.scene.metadata.gameClock;

        const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;
        const clampedDeltaTime = Math.min(deltaTime, 0.05);

        this.bullets = this.bullets.filter((b) => b.isActive);
        this.bullets.forEach((b) => b.update(clampedDeltaTime * gameClock.playerSpeed));
    }

    public disposeBullets() {
        this.bullets.forEach((b) => b.dispose());
        this.bullets = [];
    }

    public dispose() {
        if (this.pointerObserver) {
            this.scene.onPointerObservable.remove(this.pointerObserver);
            this.pointerObserver = null;
        }
        this.disposeBullets();
    }
    // General end
    //

    //
    // Plane start
    private fireBulletPlane(type: "light" | "dark", horizontalOffset: number = 0) {
        if (!this.canFire(type)) return;

        const forward = new Vector3(0, 0, 1);
        const direction = Vector3.TransformNormal(
            forward,
            this.player.getWorldMatrix(),
        ).normalize();

        const right = new Vector3(1, 0, 0);
        const worldRight = Vector3.TransformNormal(right, this.player.getWorldMatrix()).normalize();

        const forwardOffset = direction.scale(0.6);
        const horizontalOffsetVec = worldRight.scale(horizontalOffset);
        const start = this.player.position.clone().add(forwardOffset).add(horizontalOffsetVec);

        const bullet = new PlaneBullet(this.scene, start, direction, type, 25, 0, this.playerID);
        this.bullets.push(bullet);
    }

    public updateBulletPlane() {
        const leftBumperPressed = this.gamepadInputManager.isButtonPressed(4);
        const rightBumperPressed = this.gamepadInputManager.isButtonPressed(5);

        const isGod = this.player.metadata.config.shooter_bullets === "god";

        if (this.isLeftMouseDown || leftBumperPressed) {
            this.fireBulletPlane("light", isGod ? -0.4 : 0);
        }

        if (this.isRightMouseDown || rightBumperPressed) {
            this.fireBulletPlane("dark", isGod ? 0.4 : 0);
        }

        this.updateBulletDeltaTime();
    }
    // Plane end
    //

    //
    // Cylinder start
    private fireBulletCylinder(
        type: "light" | "dark",
        verticalOffset: number,
        direction: Vector3,
        radius: number,
    ) {
        if (!this.canFire(type)) return;

        const startVerticalOffset = this.player.position.y + verticalOffset;

        const position = this.player.position.clone().add(direction.scale(0.6));

        const verticalOffsetOffset = position.y - startVerticalOffset;

        const bullet = new CylinderBullet(
            this.scene,
            position,
            direction,
            radius,
            startVerticalOffset + verticalOffsetOffset,
            type,
            0,
            this.playerID,
        );
        this.bullets.push(bullet);
    }

    public updateBulletCylinder(verticalOffset: number, direction: Vector3, radius: number) {
        const leftBumperPressed = this.gamepadInputManager.isButtonPressed(4);
        const rightBumperPressed = this.gamepadInputManager.isButtonPressed(5);

        if (this.isLeftMouseDown || leftBumperPressed) {
            this.fireBulletCylinder("light", verticalOffset, direction, radius);
        }

        if (this.isRightMouseDown || rightBumperPressed) {
            this.fireBulletCylinder("dark", verticalOffset, direction, radius);
        }

        this.updateBulletDeltaTime();
    }
    // Cylinder end
    //

    //
    // Sphere start
    private getSpherePosition(): Vector3 {
        const groundID = this.player.metadata.config.ground.id;
        const groundNode = this.scene.metadata.grounds[groundID];
        return groundNode.getAbsolutePosition();
    }

    private fireBulletSphere(type: "light" | "dark", radius: number, backward: boolean = false) {
        if (!this.canFire(type)) return;

        const spherePos = this.getSpherePosition();

        const forward = new Vector3(0, 0, backward ? -1 : 1);
        const direction = Vector3.TransformNormal(
            forward,
            this.player.getWorldMatrix(),
        ).normalize();

        const start = this.player.position.clone().add(direction.scale(0.5));

        const bullet = new SphereBullet(
            this.scene,
            start,
            direction,
            radius,
            spherePos,
            type,
            0,
            this.playerID,
        );
        this.bullets.push(bullet);
    }

    public updateBulletSphere(radius: number, backward: boolean = false) {
        const leftBumperPressed = this.gamepadInputManager.isButtonPressed(4);
        const rightBumperPressed = this.gamepadInputManager.isButtonPressed(5);

        if (this.isLeftMouseDown || leftBumperPressed) {
            this.fireBulletSphere("light", radius, backward);
        }

        if (this.isRightMouseDown || rightBumperPressed) {
            this.fireBulletSphere("dark", radius, backward);
        }

        this.updateBulletDeltaTime();
    }
    // Sphere end
    //
}
