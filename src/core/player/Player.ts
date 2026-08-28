import { Scene, Mesh, TransformNode, Vector3, setAndStartTimer, Observer } from "@babylonjs/core";

import { Nullable } from "types/common";
import { PlayerConfig } from "types/player/Player.types";
import { CameraConfig } from "types/engine/Camera.types";

import { PlayerModel } from "./PlayerModel";

import { PlayerEffects } from "./PlayerEffects";
import { PostProcessesPipeline } from "core/effects/PostProcessesPipeline";

import { SelfDestruction } from "./movement/SelfDestruction";

import { PlayerMovementPlane } from "./movement/PlayerMovementPlane";
import { PlayerMovementSphere } from "./movement/PlayerMovementSphere";
import { PlayerMovementCylinder } from "./movement/PlayerMovementCylinder";

import { PlayerCameraFollow } from "./camera/PlayerCameraFollow";
import { PlayerCameraFixed } from "./camera/PlayerCameraFixed";
import { PlayerAudioEngine } from "core/audio/PlayerAudioEngine";

import { addCallbacks } from "utils/babylon";

export class Player {
    private scene: Scene;

    public player: Nullable<TransformNode> = null;

    private playerModel: Nullable<PlayerModel> = null;
    private playerCollider: Nullable<Mesh> = null;

    public effects: Nullable<PlayerEffects> = null;
    private postProcesses: Nullable<PostProcessesPipeline> = null;

    private selfDestruction: Nullable<SelfDestruction> = null;

    private controller:
        | Nullable<PlayerMovementPlane>
        | Nullable<PlayerMovementSphere>
        | Nullable<PlayerMovementCylinder> = null;

    private cameraController: Nullable<PlayerCameraFollow> | Nullable<PlayerCameraFixed> = null;

    protected hp: number = 3;
    protected iframeDuration: number = 1170;
    protected isInvincible: boolean = false;

    private audioEngine: PlayerAudioEngine;

    private wallCollisionsObservable: Nullable<Observer<Scene>> = null;

    constructor(scene: Scene) {
        this.scene = scene;
        this.audioEngine = scene.metadata.audio_engine?.getPlayerAudio();
    }

    public create(config_player: PlayerConfig) {
        this.playerModel = new PlayerModel(this.scene, config_player.type);

        this.player = this.playerModel.build(config_player);

        this.postProcesses =
            config_player.camera.id === 0
                ? this.scene.metadata?.effects.post_processes0
                : this.scene.metadata?.effects.post_processes1;

        this.effects = new PlayerEffects(this.scene, this.player, this.postProcesses);
        this.effects.observe();

        this.player.metadata = {
            ...this.player.metadata,
            config: config_player,
            camera: this.scene.metadata.cameras[config_player.camera.id],
            ground: this.scene.metadata.grounds[config_player.ground.id],
            callbacks: {
                on_damage: (name: string) => this.onDamage(name),
                destroy: (useBomb: boolean, samePlayer: boolean) =>
                    this.handleDestroy(useBomb, samePlayer),
                wiggle_camera: () => this.effects?.wigglePlayerCamera(),
                radial_blur_camera: () => this.effects?.radialBlurCamera(),
                apply_random_effect: () => this.effects?.applyRandomEffect(),
                self_destruct_effects: () => this.selfDestructEffects(),
                trigger_iframes: (duration: number) => this.triggerIframes(duration),
                update_model_to_dual: () => this.updateModelToDual(),
                update_model_to_dark: () => this.updateModelToDark(),
                set_hp: (hp: number) => this.setHp(hp),
            },
            aoe_overheat: { enabled: false, factor: 0 },
        };

        this.scene.metadata.players.push(this.player);

        this.playerCollider = this.playerModel.createCollisionBox();
        this.playerCollider.metadata = {
            ...this.playerCollider.metadata,
            config: config_player,
            camera: this.scene.metadata.cameras[config_player.camera.id],
            ground: this.scene.metadata.grounds[config_player.ground.id],
        };

        this.createPlayerPhysics();
        this.createWallCollisions();
        this.createCameraController();
        this.triggerIframes(1000);

        this.selfDestruction = new SelfDestruction(this.scene, this);

        const isGod = this.player?.metadata?.config?.type === "god";
        const isLight = this.player?.metadata?.config?.type === "light";
        const isDark = this.player?.metadata?.config?.type === "dark";

        if (isGod || isLight) {
            this.updateShooterType("light");
        } else if (isDark) {
            this.updateShooterType("dark");
        }
    }

    private createWallCollisions() {
        this.wallCollisionsObservable = this.scene.onBeforeRenderObservable.add(() => {
            if (!this.playerCollider) return;

            const lawaWalls = this.scene.metadata.walls.filter((w: Mesh) =>
                w.name.includes("lawa"),
            );

            lawaWalls.forEach((wall: Mesh) => {
                if (this.playerCollider?.intersectsMesh(wall)) {
                    this.onDamage(wall.name);
                }
            });
        });
    }

    private createPlayerPhysics() {
        const physics = this.player?.metadata.config.ground.physics;

        switch (physics) {
            case "plane":
                this.createPlanePhysics();
                break;

            case "cylinder":
                this.createCylinderPhysics();
                break;

            case "sphere":
                this.createSpherePhysics();
                break;

            default:
                break;
        }

        addCallbacks(this.player!, {
            set_player_position: (position: Vector3) => this.controller?.setPosition(position),
        });
    }

    private createPlanePhysics() {
        this.controller = new PlayerMovementPlane(this.scene, this.player, this.playerCollider);
        this.controller.attachControls();
    }

    private createCylinderPhysics() {
        this.controller = new PlayerMovementCylinder(this.scene, this.player!, this.playerCollider);
        this.controller.attachControls();
    }

    private createSpherePhysics() {
        this.controller = new PlayerMovementSphere(this.scene, this.player!, this.playerCollider);
        this.controller.attachControls();
    }

    private createCameraController() {
        const cameraType = this.player?.metadata.config.camera.type;

        switch (cameraType) {
            case "follow":
                this.createFollowCameraController();
                break;
            case "fixed":
                this.createFixedCameraController();
                break;
            default:
                break;
        }

        addCallbacks(this.player!, {
            set_camera_config: (config: CameraConfig, updateSpeed: number) =>
                this.cameraController?.setCameraTargetConfig(config, updateSpeed),
        });
    }

    private createFollowCameraController() {
        this.cameraController = new PlayerCameraFollow(this.scene, this.player);
        this.cameraController.attachCamera();
    }

    private createFixedCameraController() {
        this.cameraController = new PlayerCameraFixed(this.scene, this.player);
        this.cameraController.attachCamera();
    }

    private static readonly SELF_DESTRUCT_BOSS_DAMAGE = 5;

    private checkBombEffect(radius: number, position: Vector3, damagedBosses?: Set<number>) {
        const bombRadius = radius;

        const radiusSq = bombRadius * bombRadius;

        const enemiesToDestroy: TransformNode[] = [];

        this.scene.metadata.enemies.forEach((enemy: TransformNode) => {
            const enemyPosition = enemy.getAbsolutePosition();
            const distanceSq = Vector3.DistanceSquared(position, enemyPosition);

            if (!enemy.metadata.spawned || distanceSq > radiusSq || enemy.metadata.has_shield) {
                return;
            }

            // Bosses (not_explodable, without bomb_radius) take fixed damage once per explosion
            if (enemy.metadata.not_explodable) {
                if (!enemy.metadata.bomb_radius && damagedBosses && !damagedBosses.has(enemy.uniqueId)) {
                    damagedBosses.add(enemy.uniqueId);
                    enemy.metadata?.callbacks?.on_damage(
                        undefined,
                        Player.SELF_DESTRUCT_BOSS_DAMAGE,
                        true,
                    );
                }
                return;
            }

            enemiesToDestroy.push(enemy);
        });

        enemiesToDestroy.forEach((enemy) => {
            enemy.metadata?.callbacks?.destroy(true);
        });
    }

    private handleDestroy(useBomb: boolean = false, samePlayer: boolean = false) {
        this.selfDestruction?.deactivation();

        let enemiesDead: boolean = false;

        if (useBomb || !samePlayer) {
            const bombPosition = this.player!.getAbsolutePosition();
            const damagedBosses = new Set<number>();

            setAndStartTimer({
                timeout: 67,
                contextObservable: this.scene.onBeforeRenderObservable,
                onEnded: () => {
                    this.checkBombEffect(10, bombPosition, damagedBosses);
                },
            });

            setAndStartTimer({
                timeout: 134,
                contextObservable: this.scene.onBeforeRenderObservable,
                onEnded: () => {
                    this.checkBombEffect(6.67, bombPosition, damagedBosses);
                },
            });

            setAndStartTimer({
                timeout: 200,
                contextObservable: this.scene.onBeforeRenderObservable,
                onEnded: () => {
                    this.checkBombEffect(3.33, bombPosition, damagedBosses);
                },
            });
        }

        const playerIsDeadRef = this.scene.metadata.playerIsDeadRef;
        playerIsDeadRef.current = true;

        const destroyEffect = this.scene.metadata?.effects?.player_destroy;
        destroyEffect?.apply(this.player);

        const showRestartUI = this.scene.metadata?.callbacks?.show_restart_ui;

        this.dispose(false);

        setAndStartTimer({
            timeout: 300,
            contextObservable: this.scene.onBeforeRenderObservable,
            onEnded: () => {
                const checkEnemies = this.scene.metadata.controlsLockedRef.current;
                enemiesDead = checkEnemies;

                if (this.postProcesses && !enemiesDead) {
                    this.postProcesses.cancelRandomPostProcesses();
                    this.postProcesses.enableGlitch02PostProcess();
                    this.postProcesses.enableDistortionEffect();
                }
            },
        });

        setAndStartTimer({
            timeout: useBomb ? 1500 : 1000,
            contextObservable: this.scene.onBeforeRenderObservable,
            onEnded: () => {
                const isMultiplayer = this.scene.metadata.players.length > 1;

                if (enemiesDead || (isMultiplayer && samePlayer)) return;

                showRestartUI?.();
            },
        });
    }

    private updateShooterType(type: "light" | "dark" | "god") {
        this.player!.metadata.config.shooter_bullets = type;
    }

    private checkHP() {
        const isGod = this.player?.metadata?.config?.type === "god";

        switch (this.hp) {
            case 2:
                this.player?.metadata.hp3.setEnabled(false);
                this.player?.metadata.hp2.setEnabled(true);

                this.audioEngine?.playSound("player_physical_damage", 1.0, this.player!);

                this.postProcesses?.enableShatteringPostProcess();
                this.postProcesses?.enableGlitch00PostProcess();

                if (isGod) {
                    this.updateShooterType("dark");
                    this.effects?.updateTrailMaterial("dark");
                }

                setAndStartTimer({
                    timeout: 100,
                    contextObservable: this.scene.onBeforeRenderObservable,
                    onEnded: () => {
                        if (this.postProcesses) {
                            this.postProcesses?.disableGlitch00PostProcess();
                            this.postProcesses?.disableShatteringPostProcess();
                        }
                    },
                });

                break;
            case 1:
                this.player?.metadata.hp2.setEnabled(false);
                this.player?.metadata.hp1.setEnabled(true);

                this.audioEngine?.playSound("player_physical_damage", 1.0, this.player!);

                this.postProcesses?.enableShatteringPostProcess();
                this.postProcesses?.enableGlitch00PostProcess();

                if (isGod) {
                    this.updateShooterType("god");
                    this.effects?.updateTrailMaterial("dual");
                }

                setAndStartTimer({
                    timeout: 100,
                    contextObservable: this.scene.onBeforeRenderObservable,
                    onEnded: () => {
                        if (this.postProcesses) {
                            this.postProcesses?.disableGlitch00PostProcess();
                            this.postProcesses?.disableShatteringPostProcess();
                        }
                    },
                });

                break;
            case 0:
                this.scene.metadata.players.forEach((player: TransformNode) => {
                    player.metadata.callbacks.destroy(false, player.name === this.player?.name);
                });
                break;
            default:
                this.postProcesses?.enableShatteringPostProcess();
                this.postProcesses?.enableGlitch00PostProcess();

                this.audioEngine?.playSound("player_physical_damage", 1.0, this.player!);

                setAndStartTimer({
                    timeout: 100,
                    contextObservable: this.scene.onBeforeRenderObservable,
                    onEnded: () => {
                        if (this.postProcesses) {
                            this.postProcesses?.disableGlitch00PostProcess();
                            this.postProcesses?.disableShatteringPostProcess();
                        }
                    },
                });

                break;
        }
    }

    public onDamage(damagedBy: string) {
        // return;
        if (this.isInvincible) return;

        this.hp--;

        this.checkHP();

        const effect = this.scene.metadata?.effects?.player_damage;
        effect?.apply(this.player);

        const isLocked = this.player?.getScene().metadata.controlsLockedRef.current;
        if (isLocked) {
            return;
        }

        this.triggerIframes();
    }

    private triggerIframes(time?: number) {
        if (!this.player) return;

        const clock = this.scene.metadata.gameClock;
        if (!clock) return;

        this.isInvincible = true;
        this.player.metadata = {
            ...this.player.metadata,
            invincible: true,
        };

        const duration = (time ?? this.iframeDuration) / 1000;
        let elapsed = 0;

        const unsubscribe = clock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= duration) {
                if (!this.player) {
                    unsubscribe();
                    return;
                }

                this.isInvincible = false;
                this.player.metadata = {
                    ...this.player.metadata,
                    invincible: false,
                };

                unsubscribe();
            }
        });
    }

    public selfDestructEffects() {
        this.postProcesses?.enableNegativePostProcess();
        this.postProcesses?.enableGlitch01PostProcess();
        this.postProcesses?.enableShatteringPostProcess();

        setAndStartTimer({
            timeout: 100,
            contextObservable: this.scene.onBeforeRenderObservable,
            onEnded: () => {
                if (this.postProcesses) {
                    this.postProcesses?.disableGlitch01PostProcess();
                    this.postProcesses?.enableGlitch00PostProcess();
                }
            },
        });

        setAndStartTimer({
            timeout: 200,
            contextObservable: this.scene.onBeforeRenderObservable,
            onEnded: () => {
                if (this.postProcesses) {
                    this.postProcesses?.disableNegativePostProcess();
                    this.postProcesses?.disableGlitch00PostProcess();
                    this.postProcesses?.enablePixelationPostProcess();
                }
            },
        });

        setAndStartTimer({
            timeout: 300,
            contextObservable: this.scene.onBeforeRenderObservable,
            onEnded: () => {
                if (this.postProcesses) {
                    this.postProcesses?.disablePixelationPostProcess();
                    this.postProcesses?.disableShatteringPostProcess();
                }
            },
        });
    }

    public selfDestruct() {
        this.handleDestroy(true);
        this.selfDestructEffects();
    }

    private disposeTimer() {
        const timer = this.scene?.metadata?.timer;
        if (!timer) return;

        timer.timerText.dispose();
        timer.ui.dispose();
        timer.unsubscribe();
    }

    public updateModelToDark() {
        this.playerModel?.updateAllToDark();
        this.updateShooterType("dark");
        this.effects?.updateTrailMaterial("dark");
    }

    public updateModelToDual() {
        this.playerModel?.updateAllToDual();
        this.updateShooterType("god");
        this.effects?.updateTrailMaterial("dual");
    }

    public setHp(hp: number) {
        this.hp = hp;
    }

    public dispose(disposeCamera: boolean = true) {
        this.disposeTimer();

        this.controller?.dispose(disposeCamera);

        this.effects?.dispose();
        this.effects = null;

        this.playerCollider?.dispose();
        this.playerCollider = null;

        this.player?.dispose();
        this.player = null;

        this.playerModel?.dispose();
        this.playerModel = null;

        if (disposeCamera) {
            this.cameraController?.dispose();
            this.cameraController = null;
            this.controller = null;
            this.postProcesses = null;
        }

        this.selfDestruction?.dispose();

        if (this.wallCollisionsObservable) {
            this.scene.onBeforeRenderObservable.remove(this.wallCollisionsObservable);
            this.wallCollisionsObservable = null;
        }
    }
}
