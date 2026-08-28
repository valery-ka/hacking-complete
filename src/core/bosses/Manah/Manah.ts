import { Vector3, Scene, PhysicsImpostor, MeshBuilder, Mesh, Observer, SoundState } from "@babylonjs/core";
import { Rectangle } from "@babylonjs/gui";

import { Enemy } from "../../enemy/Enemy";
import { EnemyAssetsManager } from "../../enemy/EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { Nullable } from "types/common";

import { addCallbacks } from "utils/babylon";

import { MusicController } from "../MusicController/MusicController";
import { AttackManager } from "../AttackManager/AttackManager";

import { MANAH_HP_MUSIC } from "./ManahMusicConfig";

const SHADOWLORD_INCREMENT = 1;

const PHASE_1_ORIGINAL_SONG_ONE_SHOT = "sounds/music/77-77-1/Game/instruments/original/one_shot/Fate.ogg";
const PHASE_1_ORIGINAL_SONG_FULL = "sounds/music/77-77-1/Game/instruments/original/full/Fate.ogg";

const PHASE_1_8_BIT_SONG_ONE_SHOT = "sounds/music/77-77-1/Game/instruments/8_bit/one_shot/Fate.ogg";
const PHASE_1_8_BIT_SONG_FULL = "sounds/music/77-77-1/Game/instruments/8_bit/full/Fate.ogg";

const PHASE_2_ORIGINAL_SONG_FULL = "sounds/music/77-77-2/Game/vocals/original/full/Fate.ogg";
const PHASE_2_8_BIT_SONG_FULL = "sounds/music/77-77-2/Game/vocals/8_bit/full/Fate.ogg";

const MANAH_PHASE_TWO_REACHED_KEY = "manah_phase_two_reached";

const PHASE_1_SONG_PATHS = [
    PHASE_1_ORIGINAL_SONG_ONE_SHOT,
    PHASE_1_ORIGINAL_SONG_FULL,
    PHASE_1_8_BIT_SONG_ONE_SHOT,
    PHASE_1_8_BIT_SONG_FULL,
];

const VOLUME = 0.33;

export class Manah extends Enemy {
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
            this.scene,
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
                this.onSpawn();
            }
        });

        this.TOTAL_HP = 45;
        this.lastCount = this.TOTAL_HP;
        this.currentCount = this.TOTAL_HP;
        this.hpBarContainer = this.scene.metadata.hp_bar;

        this.observeHP();

        this.initializeMusic();
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

        this.mesh = assets.enemy_sphere_merged.createInstance(`enemy-minion-manah`);
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
                plane: 0.75,
                sphere: 0.55,
                cylinder: 0.65,
            },
        };

        addCallbacks(this.node, {
            create_collider: (position: Vector3) => this.createCollider(position),
            dispose_childrens: () => this.removeObservers(),
        });

        this.addShadow(this.mesh);
        this.updateCollisions();
    }

    // Music
    private initializeMusic() {
        const reachedPhaseTwo = !!this.scene.metadata[MANAH_PHASE_TWO_REACHED_KEY];

        if (reachedPhaseTwo) {
            this.scene.metadata[MANAH_PHASE_TWO_REACHED_KEY] = false;
            this.stopAllMusic();
            this.playPhaseOneMusic();
            return;
        }

        if (this.isPhaseOneMusicActive()) {
            return;
        }

        this.stopAllMusic();
        this.playPhaseOneMusic();
    }

    private isPhaseOneMusicActive(): boolean {
        const musicEngine = this.scene.metadata.audio_engine.getMusicAudio();
        if (!musicEngine) return false;

        return PHASE_1_SONG_PATHS.some((path) => {
            const sound = musicEngine.getSound(path);
            if (!sound) return false;

            return (
                sound.state === SoundState.Started ||
                sound.state === SoundState.Paused ||
                sound.state === SoundState.Starting
            );
        });
    }

    private stopAllMusic() {
        this.musicController.stopAllMusic();
    }

    private playPhaseOneMusic() {
        const musicEngine = this.scene.metadata.audio_engine.getMusicAudio();

        if (musicEngine) {
            musicEngine.playMusic(PHASE_1_ORIGINAL_SONG_ONE_SHOT, VOLUME, PHASE_1_ORIGINAL_SONG_FULL, VOLUME, this.scene.onBeforeRenderObservable, true, false);
            musicEngine.playMusic(PHASE_1_8_BIT_SONG_ONE_SHOT, 0.0, PHASE_1_8_BIT_SONG_FULL, 0.0, this.scene.onBeforeRenderObservable, true, false);
        }
    }

    private playPhaseTwoMusic() {
        this.scene.metadata[MANAH_PHASE_TWO_REACHED_KEY] = true;

        const musicEngine = this.scene.metadata.audio_engine.getMusicAudio();

        if (musicEngine) {
            musicEngine.playMusic("", VOLUME, PHASE_2_ORIGINAL_SONG_FULL, VOLUME, this.scene.onBeforeRenderObservable, false, true);
            musicEngine.playMusic("", VOLUME, PHASE_2_8_BIT_SONG_FULL, VOLUME, this.scene.onBeforeRenderObservable, false, true);
        }
    }

    private updateMusicLayers(hp: number) {
        const entry = MANAH_HP_MUSIC.find((config) => config.hp === hp);
        if (!entry) return;

        this.musicController.setLayersVolume(entry.layers, entry.duration);
    }

    // Manah logic
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

    private onHPChanged(hp: number) {
        this.updateMusicLayers(hp);

        if (hp === this.TOTAL_HP - 10) {
            this.hideShield();
            this.collider.scaling = new Vector3(1 / 3, 1 / 3, 1 / 3);
            this.collider.physicsImpostor?.forceUpdate();
            this.shooter.shooterEnabled = true;
        } else if (hp === this.TOTAL_HP - 14) {
            this.showShield();
            this.applyCameraPostProcess();
            this.enableDefaultMaterialToScene();
            this.updatePlayerCamera(1);
            this.scene.metadata.killing_counter++;

            this.shooter.shooterEnabled = false;
        } else if (hp === this.TOTAL_HP - 25) {
            this.hideShield();
            this.disableDefaultMaterialToScene();
            this.movement.setAngularSpeed(1);

            this.shooter.shooterEnabled = true;
        } else if (hp === this.TOTAL_HP - 29) {
            this.stopAllMusic();
            this.playPhaseTwoMusic();

            this.showShield();
            this.applyCameraPostProcess();
            this.enableWireframeMaterialToScene();
            this.updatePlayerCamera(2);
            this.scene.metadata.killing_counter++;

            this.shooter.shooterEnabled = false;
        } else if (hp === this.TOTAL_HP - 40) {
            this.hideShield();
            this.disableWireframeMaterialToScene();
            this.movement.setMoveSpeed(2);

            this.shooter.shooterEnabled = true;
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

    private removeObservers() {
        this.hideHPBar();

        if (this.killingObserver) {
            this.scene.onBeforeRenderObservable.remove(this.killingObserver);
            this.killingObserver = null;
        }

        if (this.shieldObserver) {
            this.shieldObserver();
        }

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
    private applyCameraPostProcess() {
        const players = this.scene.metadata.players;
        if (!players.length) return;

        const player = players[0];
        if (!player) return;

        player.metadata.callbacks.self_destruct_effects();
    }

    private updatePlayerCamera(config: number) {
        const players = this.scene.metadata.players;
        if (!players?.length) return;

        const player1 = players[0];
        if (!player1) return;

        const camConfigs = this.scene.metadata.configs.camera;

        if (config === 1) {
            const cfg1 = camConfigs[1];
            if (cfg1 && player1.metadata.callbacks?.set_camera_config) {
                player1.metadata.callbacks.set_camera_config(cfg1, 0.001);
            }
        } else if (config === 2) {
            const cfg2 = camConfigs[2];
            if (cfg2 && player1.metadata.callbacks?.set_camera_config) {
                player1.metadata.callbacks.set_camera_config(cfg2, 0.002);
            }
        }
    }

    // Effects
    private enableDefaultMaterialToScene() {
        this.scene?.metadata?.callbacks?.apply_default_material?.();
    }

    private disableDefaultMaterialToScene() {
        this.scene?.metadata?.callbacks?.restore_material?.();
    }

    private enableWireframeMaterialToScene() {
        this.scene?.metadata?.callbacks?.apply_wireframe?.(true);
    }

    private disableWireframeMaterialToScene() {
        this.scene?.metadata?.callbacks?.apply_wireframe?.(false);
    }
}
