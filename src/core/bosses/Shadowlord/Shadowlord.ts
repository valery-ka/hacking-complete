import { Vector3, Scene, PhysicsImpostor, MeshBuilder, Mesh, Observer } from "@babylonjs/core";
import { Rectangle } from "@babylonjs/gui";

import { Enemy } from "../../enemy/Enemy";
import { EnemyAssetsManager } from "../../enemy/EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { Nullable } from "types/common";

import { addCallbacks } from "utils/babylon";

import { MusicController } from "../MusicController/MusicController";

import { AttackManager } from "../AttackManager/AttackManager";
import { FireBallistic } from "./FireBallistic";
import { FireHoming } from "./FireHoming";
import { SHADOWLORD_HP_MUSIC } from "./ShadowlordMusicConfig";

const SHADOWLORD_INCREMENT = 1;

export class Shadowlord extends Enemy {
    private index: number;

    private shieldId: number | null = null;
    private hasShield: boolean;

    private killingObserver: Nullable<Observer<Scene>> = null;
    private shieldObserver: any = null;

    private lastCount: number;
    private currentCount: number;
    private hpBarContainer: Rectangle;
    private readonly TOTAL_HP: number;

    private attackManager: AttackManager;
    private musicController: MusicController;

    constructor(scene: Scene, enemy_config: EnemyConfig, index: number) {
        super(scene, enemy_config, index);

        this.index = index;

        this.shieldId = enemy_config.shield?.pool ?? null;
        this.hasShield = enemy_config.shield?.enabled ?? false;

        this.attackManager = new AttackManager(this.scene);

        this.musicController = new MusicController(
            this.scene.metadata.audio_engine.getMusicAudio(),
        );

        const delay = enemy_config.on_spawn.delay ?? 0.05;
        const gameClock = this.scene.metadata.gameClock;

        let elapsed = 0;

        const unsubscribe = gameClock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= delay) {
                unsubscribe();

                if (this.node.isDisposed()) return;

                this.createMeshInstance();
                this.initializeEnemyBehaviour();
                this.initializeEnemyShooter();
                this.setShooterEnabled(false);
                this.onSpawn();
            }
        });

        this.TOTAL_HP = 44;
        this.lastCount = this.TOTAL_HP;
        this.currentCount = this.TOTAL_HP;
        this.hpBarContainer = this.scene.metadata.hp_bar;

        this.observeHP();
        this.updateMusicLayers(this.TOTAL_HP);
    }

    public createCollider(pos?: Vector3) {
        const position = pos ?? this.config.on_spawn.position;

        let diameter = 0;

        if (this.node.metadata.has_shield === undefined) {
            diameter = this.hasShield ? 4.5 * SHADOWLORD_INCREMENT : 1.5 * SHADOWLORD_INCREMENT;
        } else if (this.node.metadata.has_shield === true) {
            diameter = 4.5 * SHADOWLORD_INCREMENT;
        } else {
            diameter = 1.5 * SHADOWLORD_INCREMENT;
        }

        this.collider = MeshBuilder.CreateSphere(
            `enemy-collider-sphere-${this.index}`,
            { diameter: diameter },
            this.scene,
        );
        this.collider.position = new Vector3(position.x, position.y, position.z);
        this.collider.isVisible = false;
        this.collider.physicsImpostor = new PhysicsImpostor(
            this.collider,
            PhysicsImpostor.SphereImpostor,
            { mass: 100 },
            this.scene,
        );

        return this.collider;
    }

    public createMeshInstance() {
        const assets = EnemyAssetsManager.getAssets(this.scene);

        this.mesh = assets.enemy_sphere_merged.createInstance(`enemy-minion-shadowlord`);
        this.mesh.scaling = new Vector3(1.3 * SHADOWLORD_INCREMENT, 1.3 * SHADOWLORD_INCREMENT, 1.3 * SHADOWLORD_INCREMENT);

        let coreShieldMesh: Mesh | null = null;

        if (this.hasShield) {
            coreShieldMesh = assets.enemy_sphere_shield.createInstance(
                `enemy-core-protection-${this.index}`,
            );
            coreShieldMesh!.scaling = coreShieldMesh!.scaling.multiplyByFloats(
                SHADOWLORD_INCREMENT,
                SHADOWLORD_INCREMENT,
                SHADOWLORD_INCREMENT,
            );
            coreShieldMesh!.metadata = {};
            coreShieldMesh!.metadata.disable_side_effects = true;
        }

        if (this.config.follow_player.enabled) {
            this.createCollider();
        } else {
            this.mesh.physicsImpostor = new PhysicsImpostor(
                this.mesh,
                PhysicsImpostor.SphereImpostor,
                { mass: 0 },
                this.scene,
            );

            if (coreShieldMesh) {
                coreShieldMesh.physicsImpostor = new PhysicsImpostor(
                    coreShieldMesh,
                    PhysicsImpostor.SphereImpostor,
                    { mass: 0 },
                    this.scene,
                );
            }
        }

        this.mesh.parent = this.node;
        if (coreShieldMesh) {
            coreShieldMesh.parent = this.node;
        }

        this.node.metadata = {
            ...this.node.metadata,
            has_shield: this.hasShield,
            shield: coreShieldMesh,
            shield_id: this.shieldId,
            not_explodable: true,
            hover_factor: {
                plane: 1.8,
                sphere: 1.3,
                cylinder: 1.4,
            },
        };

        addCallbacks(this.node, {
            create_collider: (position: Vector3) => this.createCollider(position),
            dispose_childrens: () => this.removeObservers(),
        });

        this.addShadow(this.mesh);
        this.updateCollisions();
    }

    // Shadowlord logic
    private observeHP() {
        const engine = this.scene.getEngine();
        const container = this.hpBarContainer;

        container.metadata.animate_show();

        const startHP = this.hp;

        this.killingObserver = this.scene.onBeforeRenderObservable.add(() => {
            const deltaHP = startHP - this.hp;

            const count = this.scene.metadata.killing_counter + deltaHP;
            const currentCount = this.currentCount - count;

            if (currentCount !== this.lastCount) {
                this.onHPChanged(currentCount);
                this.lastCount = currentCount;
            }

            const shouldHide = container.metadata.update_hp_bar(
                container,
                count,
                this.TOTAL_HP,
                engine,
            );

            if (shouldHide) {
                this.removeObservers();
                this.hideHPBar();
            }
        });
    }

    private showShield() {
        this.node.metadata.has_shield = true;
        this.node.metadata.shield.position.copyFrom(new Vector3(0, 0, 0));

        this.resetImpostor();
    }

    private hideShield() {
        this.node.metadata.has_shield = false;
        this.node.metadata.shield.position.copyFrom(new Vector3(10e5, 10e5, 10e5));

        const effect = this.scene.metadata?.effects?.core_shield_destroy;
        effect?.apply(this.node);

        this.minimizeImpostor();
    }

    private updateMusicLayers(hp: number) {
        const entry = SHADOWLORD_HP_MUSIC.find((config) => config.hp === hp);
        if (!entry) return;

        this.musicController.setLayersVolume(entry.layers, entry.duration);
    }

    private onHPChanged(hp: number) {
        this.updateMusicLayers(hp);

        if (hp === this.TOTAL_HP - 14) {
            this.startPingPong();
            this.setShooterEnabled(true);
        } else if (hp === this.TOTAL_HP - 19) {
            this.stopFollowPlayer();
            this.stopPingPong();
            this.startFollowRotation();
        } else if (hp === this.TOTAL_HP - 24) {
            this.stopFollowPlayer();
            this.stopFollowRotation();
            this.startFollowPlayer();
        } else if (hp === this.TOTAL_HP - 29) {
            this.shooter.disposeBullets();

            this.stopFollowPlayer();
            this.setShooterEnabled(false);
            this.resetPosition();
            this.setToGround();
            this.resetPlayerPosition();

            this.attackManager.add(new FireHoming(this.scene, this.node, true), 1);
            this.attackManager.add(new FireHoming(this.scene, this.node, false), 1);

            let elapsed = 0;
            const TIME_WAVE_1 = 6;

            this.clearShieldObserver();
            this.shieldObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
                elapsed += dt;

                if (elapsed / TIME_WAVE_1 >= 1) {
                    this.voiceEngine?.playSound("robovoice_1", 1.0, this.node);
                    this.hideShield();
                    this.clearShieldObserver();
                }
            });
        } else if (hp === this.TOTAL_HP - 34) {
            this.voiceEngine?.playSound("robovoice_2", 1.0, this.node);
            this.showShield();
            this.resetPlayerPosition();

            this.attackManager.add(
                new FireBallistic(this.scene, this.node, new Vector3(0, 0, 0)),
                1,
            );

            this.attackManager.add(
                new FireBallistic(this.scene, this.node, new Vector3(-5, 0, 0)),
                2,
            );
            this.attackManager.add(
                new FireBallistic(this.scene, this.node, new Vector3(5, 0, 0)),
                2,
            );

            let elapsed = 0;
            const TIME_WAVE_2 = 7;

            this.clearShieldObserver();
            this.shieldObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
                elapsed += dt;

                if (elapsed / TIME_WAVE_2 >= 1) {
                    this.voiceEngine?.playSound("robovoice_3", 1.0, this.node);
                    this.hideShield();
                    this.clearShieldObserver();
                }
            });
        } else if (hp === this.TOTAL_HP - 39) {
            this.voiceEngine?.playSound("robovoice_4", 1.0, this.node);
            this.showShield();
            this.resetPlayerPosition();

            this.attackManager.add(
                new FireBallistic(this.scene, this.node, new Vector3(-5, 0, 0)),
                1,
            );
            this.attackManager.add(
                new FireBallistic(this.scene, this.node, new Vector3(5, 0, 0)),
                1,
            );

            this.attackManager.add(new FireHoming(this.scene, this.node, true), 3);
            this.attackManager.add(new FireHoming(this.scene, this.node, false), 3);

            let elapsed = 0;
            const TIME_WAVE_3 = 8;

            this.clearShieldObserver();
            this.shieldObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
                elapsed += dt;

                if (elapsed / TIME_WAVE_3 >= 1) {
                    this.voiceEngine?.playSound("robovoice_5", 1.0, this.node);
                    this.hideShield();
                    this.clearShieldObserver();
                }
            });
        }
    }

    private hideHPBar() {
        const container = this.hpBarContainer;
        if (container) {
            const engine = this.scene.getEngine();
            container.metadata.update_hp_bar(container, 0, this.TOTAL_HP, engine);
            container.metadata.animate_hide();
        }
    }

    private clearShieldObserver() {
        if (this.shieldObserver) {
            this.shieldObserver();
            this.shieldObserver = null;
        }
    }

    private removeObservers() {
        this.voiceEngine?.playSound("robovoice_6", 1.0, this.node);

        this.hideHPBar();

        if (this.killingObserver) {
            this.scene.onBeforeRenderObservable.remove(this.killingObserver);
            this.killingObserver = null;
        }

        this.clearShieldObserver();

        this.attackManager.disposeAll();
        this.musicController.dispose();
    }

    private minimizeImpostor() {
        this.collider.scaling = new Vector3(1 / 3, 1 / 3, 1 / 3);
        this.collider.physicsImpostor?.forceUpdate();
    }

    private resetImpostor() {
        this.collider.scaling = new Vector3(1, 1, 1);
        this.collider.physicsImpostor?.forceUpdate();
    }

    // Player
    private resetPlayerPosition() {
        const players = this.scene.metadata.players;
        if (!players.length) return;

        const player = players[0];
        if (!player || !player.metadata) return;

        player.metadata.callbacks.set_player_position(new Vector3(0, 0, -17));

        this.applyCameraPostProcess();
        this.triggerPlayerIframes();
    }

    private triggerPlayerIframes() {
        const players = this.scene.metadata.players;
        if (!players.length) return;

        const player = players[0];
        if (!player) return;

        player.metadata.callbacks.trigger_iframes(1000);
    }

    private applyCameraPostProcess() {
        const players = this.scene.metadata.players;
        if (!players.length) return;

        const player = players[0];
        if (!player) return;

        player.metadata.callbacks.self_destruct_effects();
    }

    // Positioning
    private resetPosition() {
        const position = this.config.on_spawn.position;
        this.movement.setPosition(new Vector3(position.x, position.y, position.z));
    }

    private setShooterEnabled(enabled: boolean) {
        this.shooter.shooterEnabled = enabled;
    }

    private setToGround() {
        this.node.metadata.hover_factor = { plane: 0.75, sphere: 1.3, cylinder: 1.4 };
    }

    private startFollowRotation() {
        this.movement.setFollowRotationSpeed({
            enabled: true,
            follow: { from: 0, to: 10 },
            rotation: { from: 0, to: Infinity },
        });
        this.movement.toggleFollowRotationSpeed(0.01);
    }

    private stopFollowRotation() {
        this.movement.setFollowRotationSpeed({
            enabled: false,
            follow: { from: 0, to: 10 },
            rotation: { from: 0, to: Infinity },
        });
        this.movement.toggleFollowRotationSpeed();
    }

    private startFollowPlayer() {
        this.movement.setMoveSpeed(5);
        this.movement.setAngularSpeed(Math.PI / 2);
    }

    private stopFollowPlayer() {
        this.movement.setMoveSpeed(0);
        this.movement.setAngularSpeed(0);
    }

    private startPingPong() {
        this.node.rotation.y = -2;

        this.movement.setMoveSpeed(10);
        this.movement.setAngularSpeed(0);
        this.movement.setPingPongEnabled(true);
        this.movement.startPingPongPlane();
    }

    private stopPingPong() {
        this.movement.setPingPongEnabled(false);
    }
}
