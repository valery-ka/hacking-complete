import { Scene, TransformNode, Vector3, Matrix } from "@babylonjs/core";

import { Nullable } from "types/common";
import { EnemyConfig, IEnemyShooter } from "types/enemy/Enemies.types";

import { PlaneBullet } from "../bullet/PlaneBullet";
import { SphereBullet } from "../bullet/SphereBullet";
import { CylinderBullet } from "../bullet/CylinderBullet";

import { EnemyRocket } from "./models/EnemyRocket";

import { getLocalYRotation, getWorldOffset, addCallbacks } from "utils/babylon";

import { EnemyAudioEngine } from "core/audio/EnemyAudioEngine";

const BULLET_TYPES = ["physical", "magical", "chlorine"];

const createRocketConfig = (parent: TransformNode): Nullable<EnemyConfig> => {
    const config = parent?.metadata?.config;
    if (!config) return null;

    const rotY = getLocalYRotation(parent);

    let newPos = config.on_spawn.position;
    if (config.ground.physics === "plane") {
        newPos = getWorldOffset(new Vector3(0, 0, 1), parent.position, parent.rotation);
    }

    return {
        trigger: { pool: { self: 1000, to_trigger: null } },
        enemy_type: "rocket",
        on_spawn: {
            position: newPos,
            rotation_y: rotY,
            hp: 1,
            spawn_animation: false,
        },
        ground: config.ground,
        is_inside_ground: config.is_inside_ground,
        follow_player: { enabled: true, speed: 7.5 },
        triggers_by_player: config.triggers_by_player,
        rotate_to_player: { enabled: true, angular_speed: 5 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
    };
};

const createRocketEnemy = (scene: Scene, config: EnemyConfig) => {
    const { EnemyRocket } = require("./models/EnemyRocket");
    return new EnemyRocket(scene, config);
};

export class EnemyShooter {
    private scene: Scene;
    private enemy: TransformNode;

    private config: EnemyConfig;
    private physics: string;
    private isInsideMovement: boolean;

    private bullets: (PlaneBullet | CylinderBullet | SphereBullet)[] = [];
    private rockets: EnemyRocket[] = [];

    private currentConfig: IEnemyShooter | null = null;
    private initObserver: Nullable<any> = null;
    private bulletsObserver: Nullable<any> = null;
    private rocketsObserver: Nullable<any> = null;

    public shooterEnabled: boolean = true;
    public isMiner: boolean = false;

    private shootState: {
        directions: Vector3[];
        pattern: number[][];
        cooldown: number;
        cooldown_fixed?: number;
        cooldown_dynamic?: number[];
        spreading: number;
        switcher: null | {
            enabled: boolean;
            delay: [number, number];
            isOn: boolean;
            timer: number;
        };
        perDir: {
            currentTypeIndex: number;
            remainingShots: number;
            lastShotTime: number;
            accumulatedTime: number;
        }[];
        canShoot: boolean;
    } | null = null;

    private audioEngine: EnemyAudioEngine;

    constructor(scene: Scene, enemy: TransformNode) {
        this.scene = scene;
        this.enemy = enemy;

        this.config = enemy.metadata.config;
        this.isMiner = this.config.is_miner ?? false;

        this.physics = enemy.metadata.config.ground.physics;
        this.isInsideMovement = enemy.metadata.config.is_inside_ground;

        this.audioEngine = scene.metadata.audio_engine?.getEnemyAudio();

        this.enemy.metadata = { ...this.enemy.metadata, rage_id: this.config.rage?.pool };
        addCallbacks(this.enemy, {
            enable_rage_mode: () => this.switchToRage(),
        });

        this.enableShooter();
    }

    public switchToRage() {
        this.shooterEnabled = true;
        this.startShooter(this.config.rage!, true);
    }

    public enableNormal() {
        this.startShooter(this.config.shooter, false);
    }

    public enableShooter() {
        const initialDelay = this.config.shooter.initial_delay ?? 100;

        let elapsed = 0;

        this.initObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;
            const progress = Math.min(elapsed / (initialDelay / 1000), 1);

            if (progress >= 1) {
                this.startShooter(this.config.shooter);
                this.startRocketLauncher();

                this.initObserver();
                this.initObserver = null;
            }
        });
    }

    private startShooter(config: IEnemyShooter, force = false) {
        if (!config) return;
        if (!config.enabled && !force) return;

        this.currentConfig = config;
        this.updateShootingState(config);

        this.shootState?.perDir.forEach((state) => {
            state.accumulatedTime = config.cooldown ?? 100;
        });

        if (!this.bulletsObserver) {
            this.bulletsObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
                this.updateBulletDeltaTime(dt);
                this.processShooting(dt);
                this.updateCollisions();
            });
        }
    }

    public updateShootingState(params: IEnemyShooter) {
        const directions = (params.directions || [0]).map((angle) => {
            const rotationMatrix = Matrix.RotationY(angle);
            return Vector3.TransformNormal(Vector3.Forward(), rotationMatrix).normalize();
        });

        const pattern = params.pattern || directions.map(() => [1]);
        const perDir = directions.map((_, idx) => ({
            currentTypeIndex: 0,
            remainingShots: pattern[idx]?.[0] ?? 1,
            lastShotTime: 0,
            accumulatedTime: 0,
        }));

        this.shootState = {
            directions,
            pattern,
            perDir,

            canShoot: true,
            cooldown: params.cooldown ?? 100,
            cooldown_fixed: params.cooldown ?? 100,
            cooldown_dynamic: params.cooldown_dynamic,
            spreading: params.spreading ?? 0.1,

            switcher: params.switch_shooter
                ? {
                    enabled: params.switch_shooter.enabled,
                    delay: [...(params.switch_shooter.delay ?? [200, 500])],
                    isOn: true,
                    timer: 0,
                }
                : null,
        };
    }

    public triggerShot(): boolean {
        const st = this.shootState;
        if (!st || !this.currentConfig) return false;

        const wm = this.enemy.getWorldMatrix();
        let anyShotFired = false;

        st.directions.forEach((localDir, i) => {
            const state = st.perDir[i];
            if (!state) return;

            const patternRow = st.pattern[i] || [1];

            while (patternRow[state.currentTypeIndex] === 0) {
                state.currentTypeIndex = (state.currentTypeIndex + 1) % BULLET_TYPES.length;
            }

            const bulletType = BULLET_TYPES[state.currentTypeIndex];

            this.fireBullet(
                bulletType as "physical" | "magical" | "chlorine",
                localDir,
                wm,
                st.spreading,
            );

            state.remainingShots--;

            if (state.remainingShots <= 0) {
                do {
                    state.currentTypeIndex = (state.currentTypeIndex + 1) % BULLET_TYPES.length;
                    state.remainingShots = patternRow[state.currentTypeIndex] ?? 0;
                } while (state.remainingShots === 0);
            }

            state.accumulatedTime = 0;

            anyShotFired = true;
        });

        return anyShotFired;
    }

    private processShooting(dt: number) {
        const st = this.shootState;
        if (!st || !this.currentConfig) return;

        const sw = st.switcher;
        if (sw?.enabled) {
            sw.timer += dt * 1000;
            const currentDelay = sw.isOn ? sw.delay[0] : sw.delay[1];

            if (sw.timer >= currentDelay) {
                sw.timer = 0;
                sw.isOn = !sw.isOn;
                st.canShoot = sw.isOn;
            }
        }

        if (st.cooldown_dynamic) {
            const count = this.scene.metadata.killing_counter;
            const len = st.cooldown_dynamic.length;

            const dyn = st.cooldown_dynamic[len - 1 - count] ?? st.cooldown_dynamic[0];

            if (st.switcher) {
                st.switcher.delay[1] = dyn;
            } else {
                st.cooldown = dyn;
            }
        }

        const wm = this.enemy.getWorldMatrix();

        st.directions.forEach((localDir, i) => {
            const state = st.perDir[i];
            if (!st.canShoot || !this.shooterEnabled) return;

            state.accumulatedTime = (state.accumulatedTime ?? 0) + dt;

            if (state.accumulatedTime < st.cooldown / 1000) return;

            const patternRow = st.pattern[i] || [1];

            while (patternRow[state.currentTypeIndex] === 0) {
                state.currentTypeIndex = (state.currentTypeIndex + 1) % BULLET_TYPES.length;
            }

            const bulletType = BULLET_TYPES[state.currentTypeIndex];

            this.fireBullet(
                bulletType as "physical" | "magical" | "chlorine",
                localDir,
                wm,
                st.spreading,
            );

            state.accumulatedTime = 0;
            state.remainingShots--;

            if (state.remainingShots <= 0) {
                do {
                    state.currentTypeIndex = (state.currentTypeIndex + 1) % BULLET_TYPES.length;
                    state.remainingShots = patternRow[state.currentTypeIndex] ?? 0;
                } while (state.remainingShots === 0);
            }
        });
    }

    private startRocketLauncher() {
        const params = this.config.rocket_launcher;
        if (!params?.enabled) return;

        const cooldown = params.cooldown || 1000;
        let accumulatedTime = cooldown;

        const shootRocket = (dt: number) => {
            accumulatedTime += dt;

            if (accumulatedTime < cooldown / 1000) return;

            const rocketConfig = createRocketConfig(this.enemy);
            if (!rocketConfig) return;

            const rocket = createRocketEnemy(this.scene, rocketConfig);
            this.rockets.push(rocket);

            accumulatedTime = 0;
        };

        this.rocketsObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
            shootRocket(dt);
            this.updateCollisions();
        });
    }

    private fireBullet(
        type: "physical" | "magical" | "chlorine",
        localDir: Vector3,
        worldMatrix: Matrix,
        spreading: number,
    ) {
        if (this.enemy.isDisposed()) return;

        this.audioEngine?.playSound("enemy_bullet_fire", 1.0, this.enemy);

        const worldDirection = Vector3.TransformNormal(localDir, worldMatrix).normalize();

        const spreadAngle = (Math.random() - 0.5) * 2 * spreading;
        const spreadMatrix = Matrix.RotationY(spreadAngle);
        const spreadDirection = Vector3.TransformNormal(worldDirection, spreadMatrix).normalize();

        // могло сломать, но на первый взгляд нет
        // const startPosition = this.enemy.position.add(worldDirection.scale(1.0));
        const startPosition = this.enemy.getAbsolutePosition().add(worldDirection.scale(1.0));

        if (this.physics === "plane") {
            this.fireBulletPlane(type, spreadDirection, startPosition);
        } else if (this.physics === "cylinder") {
            this.fireBulletCylinder(type, spreadDirection);
        } else if (this.physics === "sphere") {
            this.fireBulletSphere(type, spreadDirection);
        } else if (this.physics === "none") {
            this.fireBulletNone(type, spreadDirection, startPosition);
        } else {
            console.warn("Unknown physics");
        }
    }

    private updateBulletDeltaTime(dt: number) {
        if (this.scene.metadata.gameClock.paused) return;

        const clampedDeltaTime = Math.min(dt, 0.05);

        this.bullets = this.bullets.filter((b) => b.isActive);
        this.bullets.forEach((b) => b.update(clampedDeltaTime));
    }

    private updateCollisions() {
        this.scene.metadata.collisions.player_bullets.update(this.scene);
        this.scene.metadata.collisions.enemy_bullets.update(this.scene);
    }

    public hasActiveBullets(): boolean {
        return this.bullets.some((b) => b.isActive);
    }

    public disposeBullets() {
        this.bullets.forEach((b) => b.dispose());
        this.bullets = [];
    }

    public dispose(effect: boolean = true) {
        this.disposeBullets();

        this.rockets.forEach((b) => {
            b.isInvincible = false;
            b.handleDestroy(true, false, effect);
        });
        this.rockets = [];

        if (this.bulletsObserver) {
            this.bulletsObserver();
            this.bulletsObserver = null;
        }

        if (this.rocketsObserver) {
            this.rocketsObserver();
            this.rocketsObserver = null;
        }

        if (this.initObserver) {
            this.initObserver();
            this.initObserver = null;
        }
    }
    // General end
    //

    //
    private fireBulletNone(
        type: "physical" | "magical" | "chlorine",
        direction: Vector3,
        startPosition: Vector3,
    ) {
        const bullet = new PlaneBullet(
            this.scene,
            startPosition,
            direction,
            type,
            this.isMiner ? 6.25 : 12.5,
            this.isMiner ? 1 : 0,
            255,
            this.enemy.name,
            this.isMiner,
        );
        this.bullets.push(bullet);
    }
    //

    //
    // Plane start

    private getHoverOnPlane() {
        const size = this.config.ground.size;
        const height = typeof size === "number" ? size / 2 : size.h / 2;
        const hover = 0.45;

        const finalHover = height + hover;

        return this.isInsideMovement ? -finalHover : finalHover;
    }

    private fireBulletPlane(
        type: "physical" | "magical" | "chlorine",
        direction: Vector3,
        startPosition: Vector3,
    ) {
        const ignore = this.config?.metadata?.ignore_hover;
        if (!ignore) {
            startPosition.y = this.getHoverOnPlane();
        }
        const bullet = new PlaneBullet(
            this.scene,
            startPosition,
            direction,
            type,
            this.isMiner ? 1 : 12.5,
            1,
            255,
            this.enemy.name,
        );
        this.bullets.push(bullet);
    }
    // Plane end
    //

    //
    // Cylinder start
    private getCylinderRadius() {
        const size = this.config.ground.size;
        const radius = typeof size === "number" ? size / 2 : size.d / 2;
        const hover = 0.45;

        const finalRadius = this.isInsideMovement ? radius - hover : radius + hover;

        return finalRadius;
    }

    private fireBulletCylinder(type: "physical" | "magical" | "chlorine", direction: Vector3) {
        const verticalOffset = this.enemy.position.y;

        const position = this.enemy.position.clone().add(direction.scale(0.5));

        const radius = this.getCylinderRadius();

        const bullet = new CylinderBullet(
            this.scene,
            position,
            direction,
            radius,
            verticalOffset,
            type,
            1,
            255,
            this.isMiner ? 1 : 13,
            this.enemy.name,
        );
        this.bullets.push(bullet);
    }
    // Cylinder end
    //

    //
    // Sphere start
    private getSpherePosition(): Vector3 {
        const groundID = this.enemy.metadata.config.ground.id;
        const groundNode = this.scene.metadata.grounds[groundID];
        return groundNode.getAbsolutePosition();
    }

    private getSphereRadius() {
        const size = this.config.ground.size;
        const radius = typeof size === "number" ? size / 2 : size.d / 2;
        const hover = 0.45;
        const insideCorrection = 0.55;

        const finalRadius = this.isInsideMovement
            ? radius - hover - insideCorrection
            : radius + hover;

        return finalRadius;
    }

    private fireBulletSphere(type: "physical" | "magical" | "chlorine", direction: Vector3) {
        const position = this.enemy.position.clone().add(direction.scale(1.0));

        const radius = this.getSphereRadius();
        const spherePos = this.getSpherePosition();

        const bullet = new SphereBullet(
            this.scene,
            position,
            direction,
            radius,
            spherePos,
            type,
            1,
            255,
            this.enemy.name,
            this.isMiner ? 1 : 14,
        );
        this.bullets.push(bullet);
    }
    // Sphere end
    //
}
