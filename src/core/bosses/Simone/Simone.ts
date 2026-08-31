import { Vector3, Scene, PhysicsImpostor, MeshBuilder, Mesh, Observer } from "@babylonjs/core";
import { Rectangle } from "@babylonjs/gui";

import { Enemy } from "../../enemy/Enemy";
import { EnemyAssetsManager } from "../../enemy/EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { Nullable } from "types/common";

import { addCallbacks } from "utils/babylon";

import { MusicController } from "../MusicController/MusicController";

import { AttackManager } from "../AttackManager/AttackManager";
import { LanceAttack } from "./LanceAttack";
import { DonutAttack } from "./DonutAttack";
import { BellAttack } from "./BellAttack";
import { SIMONE_HP_MUSIC } from "./SimoneMusicConfig";

const SIMONE_INCREMENT = 2;

export class Simone extends Enemy {
    private index: number;

    private shieldId: number | null = null;
    private hasShield: boolean;

    private killingObserver: Nullable<Observer<Scene>> = null;
    private shieldObserver: any = null;

    private lastCount: number;
    private currentCount: number;
    private hpBarContainer: Rectangle;
    private readonly SHIELD_TOTAL_HP: number;

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
                this.shooter.shooterEnabled = false;

                this.onSpawn();
            }
        });

        this.SHIELD_TOTAL_HP = 58;
        this.lastCount = this.SHIELD_TOTAL_HP;
        this.currentCount = this.SHIELD_TOTAL_HP;
        this.hpBarContainer = this.scene.metadata.hp_bar;

        this.observeHP();
        this.updateMusicLayers(this.SHIELD_TOTAL_HP);
    }

    public createCollider(pos?: Vector3) {
        const position = pos ?? this.config.on_spawn.position;

        let diameter = 0;

        if (this.node.metadata.has_shield === undefined) {
            diameter = this.hasShield ? 4.5 * SIMONE_INCREMENT : 1.5 * SIMONE_INCREMENT;
        } else if (this.node.metadata.has_shield === true) {
            diameter = 4.5 * SIMONE_INCREMENT;
        } else {
            diameter = 1.5 * SIMONE_INCREMENT;
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

        this.mesh = assets.enemy_sphere_merged.createInstance(`enemy-minion-simone`);
        this.mesh.scaling = new Vector3(1.3 * SIMONE_INCREMENT, 1.3 * SIMONE_INCREMENT, 1.3 * SIMONE_INCREMENT);

        let coreShieldMesh: Mesh | null = null;

        if (this.hasShield) {
            coreShieldMesh = assets.enemy_sphere_shield.createInstance(
                `enemy-core-protection-${this.index}`,
            );
            coreShieldMesh!.scaling = coreShieldMesh!.scaling.multiplyByFloats(
                SIMONE_INCREMENT,
                SIMONE_INCREMENT,
                SIMONE_INCREMENT,
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
                plane: 1.5,
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

    // Simone logic
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
                this.SHIELD_TOTAL_HP,
                engine,
            );

            if (shouldHide) {
                this.removeObservers();
                this.hideHPBar();
            }
        });
    }

    private onHPChanged(hp: number) {
        this.performHPBasedAttacks(hp);
        this.updateMusicLayers(hp);
        this.updatePlayerCamera(hp);
    }

    private updateMusicLayers(hp: number) {
        const entry = SIMONE_HP_MUSIC.find((config) => config.hp === hp);
        if (!entry) return;

        this.musicController.setLayersVolume(entry.layers, 1.0);
    }

    private handleLaserCollision(mesh: Mesh) {
        const parent = mesh.parent;
        if (!parent) return;

        parent.metadata.callbacks.on_damage();
    }

    private performHPBasedAttacks(hp: number) {
        switch (hp) {
            case 52:
                this.attackManager.add(
                    new DonutAttack(this.scene, this.node, (mesh) =>
                        this.handleLaserCollision(mesh), false
                    ),
                );
                break;
            case 5:
                this.voiceEngine?.playSound("simone_laugh_3", 1.0, this.node);

                this.showShield();
                this.runToPlayer();
                this.applyCameraPostProcess();

                this.attackManager.add(
                    new DonutAttack(this.scene, this.node, (mesh) =>
                        this.handleLaserCollision(mesh)
                    ),
                );

                let elapsed_3 = 0;
                const TIME_3 = 4;

                this.clearShieldObserver();
                this.shieldObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
                    elapsed_3 += dt;

                    if (elapsed_3 / TIME_3 >= 1) {
                        this.voiceEngine?.playSound("simone_ugh_1", 1.0, this.node);
                        this.hideShield();
                        this.runAwayFromPlayer();
                        this.clearShieldObserver();
                    }
                });
                break;
            case 46:
                this.attackManager.add(
                    new LanceAttack(this.scene, this.node, (mesh) =>
                        this.handleLaserCollision(mesh), false
                    ),
                );
                break;
            case 20:
                this.voiceEngine?.playSound("simone_laugh_1", 1.0, this.node);

                this.attackManager.add(
                    new LanceAttack(this.scene, this.node, (mesh) =>
                        this.handleLaserCollision(mesh)
                    ),
                );

                let elapsed_1 = 0;
                const TIME_1 = 6;

                this.clearShieldObserver();
                this.shieldObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
                    elapsed_1 += dt;

                    if (elapsed_1 / TIME_1 >= 1) {
                        this.voiceEngine?.playSound("simone_ugh_1", 1.0, this.node);
                        this.hideShield();
                        this.runAwayFromPlayer();
                        this.clearShieldObserver();
                    }
                });

                break;
            case 40:
                this.attackManager.add(new BellAttack(this.scene, this.node, this.shooter, false));
                break;
            case 12:
                this.voiceEngine?.playSound("simone_laugh_2", 1.0, this.node);

                this.showShield();
                this.runToPlayer();
                this.applyCameraPostProcess();

                this.attackManager.add(new BellAttack(this.scene, this.node, this.shooter));

                let elapsed_2 = 0;
                const TIME_2 = 3.5;

                this.clearShieldObserver();
                this.shieldObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
                    elapsed_2 += dt;

                    if (elapsed_2 / TIME_2 >= 1) {
                        this.voiceEngine?.playSound("simone_ugh_2", 1.0, this.node);
                        this.hideShield();
                        this.runAwayFromPlayer();
                        this.clearShieldObserver();
                    }
                });
                break;
            default:
                break;
        }
    }

    private updatePlayerCamera(hp: number) {
        const players = this.scene.metadata.players;
        if (!players?.length) return;

        const player1 = players[0];
        if (!player1) return;

        const camConfigs = this.scene.metadata.configs.camera;

        if (hp <= 38 && hp > 35) {
            const cfg1 = camConfigs[1];
            if (cfg1 && player1?.metadata?.callbacks?.set_camera_config) {
                player1.metadata.callbacks.set_camera_config(cfg1, 0.001);
            }
        } else if (hp <= 24 && hp > 21) {
            const cfg0 = camConfigs[0];
            if (cfg0 && player1?.metadata?.callbacks?.set_camera_config) {
                player1.metadata.callbacks.set_camera_config(cfg0, 0.002);
            }
        }
    }

    private hideHPBar() {
        const container = this.hpBarContainer;
        if (container) {
            const engine = this.scene.getEngine();
            container.metadata.update_hp_bar(container, 0, this.SHIELD_TOTAL_HP, engine);
            container.metadata.animate_hide();
        }
    }

    private minimizeImpostor() {
        this.collider.scaling = new Vector3(1 / 3, 1 / 3, 1 / 3);
        this.collider.physicsImpostor?.forceUpdate();
    }

    private resetImpostor() {
        this.collider.scaling = new Vector3(1, 1, 1);
        this.collider.physicsImpostor?.forceUpdate();
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

    private runAwayFromPlayer() {
        this.movement.setMoveSpeed(-2);
    }

    private runToPlayer() {
        this.movement.setMoveSpeed(2);
    }

    private clearShieldObserver() {
        if (this.shieldObserver) {
            this.shieldObserver();
            this.shieldObserver = null;
        }
    }

    private removeObservers() {
        this.hideHPBar();

        if (this.killingObserver) {
            this.scene.onBeforeRenderObservable.remove(this.killingObserver);
            this.killingObserver = null;
        }

        this.clearShieldObserver();

        this.attackManager.disposeAll();
        this.musicController.dispose();
    }

    // Player
    private applyCameraPostProcess() {
        const players = this.scene.metadata.players;
        if (!players.length) return;

        const player = players[0];
        if (!player) return;

        player.metadata.callbacks.self_destruct_effects();
    }
}
