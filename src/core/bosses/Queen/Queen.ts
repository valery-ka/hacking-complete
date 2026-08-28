import { Vector3, Scene, PhysicsImpostor, MeshBuilder, Mesh, Observer } from "@babylonjs/core";
import { Rectangle } from "@babylonjs/gui";

import { Enemy } from "../../enemy/Enemy";
import { EnemyAssetsManager } from "../../enemy/EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { Nullable } from "types/common";

import { addCallbacks } from "utils/babylon";

import { MusicController } from "../MusicController/MusicController";

import { AttackManager } from "../AttackManager/AttackManager";
import { WhiteAttack } from "./WhiteAttack";
import { DarkAttack } from "./DarkAttack";

import { WHITE_BULLETS, DARK_BULLETS } from "./QueenConfig";

import { isEasyDifficulty } from "utils/autoAim";

const QUEEN_SONG = "sounds/music/83/Game/instruments/original/full/Queen.ogg";

const SHADOWLORD_INCREMENT = 1;

export class Queen extends Enemy {
    private index: number;

    private shieldId: number | null = null;
    private hasShield: boolean;

    private killingObserver: Nullable<Observer<Scene>> = null;
    private shieldObserver: any = null;
    private spawnUnsubscribe: Nullable<() => void> = null;
    private isCleanedUp = false;

    private hpBarContainer: Rectangle;
    private readonly TOTAL_HP: number;

    private attackManager: AttackManager;
    private musicController: MusicController;

    private whiteFiresCount: number = 0;
    private whiteAttackFinished: boolean = false;

    private darkFiresCount: number = 0;
    private darkAttackFinished: boolean = false;

    constructor(scene: Scene, enemy_config: EnemyConfig, index: number) {
        super(scene, enemy_config, index);

        this.index = index;

        this.shieldId = enemy_config.shield?.pool ?? null;
        this.hasShield = enemy_config.shield?.enabled ?? false;

        this.attackManager = new AttackManager(this.scene);

        this.musicController = new MusicController(
            this.scene.metadata.audio_engine.getMusicAudio(),
            this.scene,
        );

        // Must be registered before spawn delay — restart/dispose can happen first.
        addCallbacks(this.node, {
            dispose_childrens: () => this.removeObservers(),
        });

        const delay = enemy_config.on_spawn.delay ?? 0.05;
        const gameClock = this.scene.metadata.gameClock;

        let elapsed = 0;

        this.spawnUnsubscribe = gameClock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= delay) {
                this.spawnUnsubscribe?.();
                this.spawnUnsubscribe = null;

                if (this.isCleanedUp || this.node.isDisposed()) return;

                this.createMeshInstance();
                this.initializeEnemyBehaviour();

                this.initializeEnemyShooter();
                this.shooter.shooterEnabled = false;
                this.startShooterSequence();

                this.onSpawn();
            }
        });

        this.TOTAL_HP = WHITE_BULLETS.length + DARK_BULLETS.length + this.hp;

        this.hpBarContainer = this.scene.metadata.hp_bar;

        this.observeHP();
        this.updatePlayerModel();

        this.stopAllMusic();
        this.playQueenSong();
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

        this.mesh = assets.enemy_sphere_merged.createInstance(`enemy-minion-queen`);
        this.mesh.scaling = new Vector3(1.3 * SHADOWLORD_INCREMENT, 1.3 * SHADOWLORD_INCREMENT, 1.3 * SHADOWLORD_INCREMENT);

        let coreShieldMesh: Mesh | null = null;

        if (this.hasShield) {
            coreShieldMesh = assets.enemy_sphere_shield.createInstance(
                `enemy-queen-protection-${this.index}`,
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
                plane: 0.75,
                sphere: 0.75,
                cylinder: 0.75,
            },
        };

        addCallbacks(this.node, {
            create_collider: (position: Vector3) => this.createCollider(position),
        });

        this.addShadow(this.mesh);
        this.updateCollisions();
    }

    // Music
    private playQueenSong() {
        this.musicController.playMusic(QUEEN_SONG, 0.85);
    }

    private stopAllMusic() {
        this.musicController.stopAllMusic();
    }

    // Queen logic
    private minimizeImpostor() {
        this.collider.scaling = new Vector3(1 / 3, 1 / 3, 1 / 3);
        this.collider.physicsImpostor?.forceUpdate();
    }

    private hideShield() {
        this.node.metadata.has_shield = false;
        this.node.metadata.shield.position.copyFrom(new Vector3(10e5, 10e5, 10e5));

        const effect = this.scene.metadata?.effects?.core_shield_destroy;
        effect?.apply(this.node);

        this.minimizeImpostor();
    }

    private observeHP() {
        const engine = this.scene.getEngine();
        const container = this.hpBarContainer;

        container.metadata.animate_show();

        this.killingObserver = this.scene.onBeforeRenderObservable.add(() => {
            const count = this.whiteFiresCount + this.darkFiresCount;

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

    private hideHPBar() {
        const container = this.hpBarContainer;
        if (container) {
            const engine = this.scene.getEngine();
            container.metadata.update_hp_bar(container, 0, this.TOTAL_HP, engine);
            container.metadata.animate_hide();
        }
    }

    private removeObservers() {
        if (this.isCleanedUp) return;
        this.isCleanedUp = true;

        this.hideHPBar();

        if (this.spawnUnsubscribe) {
            this.spawnUnsubscribe();
            this.spawnUnsubscribe = null;
        }

        if (this.killingObserver) {
            this.scene.onBeforeRenderObservable.remove(this.killingObserver);
            this.killingObserver = null;
        }

        if (this.shieldObserver) {
            this.shieldObserver();
            this.shieldObserver = null;
        }

        // Kill in-flight White/Dark bullets + their GameClock observers immediately on restart.
        this.attackManager.disposeAll();
        this.shooter?.dispose();

        this.stopAllMusic();
        this.musicController.dispose();
    }

    // Attack logic
    private checkIsFinished() {
        if (this.whiteAttackFinished && this.darkAttackFinished) {
            this.hideShield();
        }
    }

    private startShooterSequence() {
        const delay = 0.3;

        const white = this.attackManager.add(
            new WhiteAttack(this.scene, this.node, this.whiteFiresCount, (newCount: number) => {
                this.whiteFiresCount = newCount;
            }), delay
        );
        white.setFinishedCallback(() => {
            this.whiteAttackFinished = true;
            this.checkIsFinished();
        });

        const dark = this.attackManager.add(
            new DarkAttack(this.scene, this.node, this.darkFiresCount, (newCount: number) => {
                this.darkFiresCount = newCount;
            }), delay
        );

        dark.setFinishedCallback(() => {
            this.darkAttackFinished = true;
            this.checkIsFinished();
        });
    }

    // Player
    private updatePlayerModel() {
        const players = this.scene.metadata.players;
        if (!players.length) return;

        const player = players[0];
        if (!player) return;

        player?.metadata?.callbacks?.update_model_to_dual?.();

        if (isEasyDifficulty()) {
            player?.metadata?.callbacks?.set_hp?.(10);
        }
    }
}
