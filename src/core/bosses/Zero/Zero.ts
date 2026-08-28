import {
    Vector3,
    Scene,
    PhysicsImpostor,
    MeshBuilder,
    Mesh,
    Observer,
    AbstractSound,
    Light,
    SpotLight,
    Color4,
} from "@babylonjs/core";
import { Rectangle } from "@babylonjs/gui";

import { Enemy } from "../../enemy/Enemy";
import { EnemyAssetsManager } from "../../enemy/EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { Nullable, Undefinable } from "types/common";

import { addCallbacks } from "utils/babylon";

import { MusicController } from "../MusicController/MusicController";

import { AttackManager } from "../AttackManager/AttackManager";
import { EnemySphere } from "core/enemy/models/EnemySphere";
import { BellAttack } from "./BellAttack";

import {
    FIVE_DELAYS,
    FOUR_DELAYS,
    ONE_DELAYS,
    THREE_DELAYS,
    TWO_DELAYS,
    ZERO_END_DELAYS,
    ZERO_START_DELAYS,
    SECOND_WAVE_SHOOTING_STATE,
} from "./ZeroConfig";

const SHADOWLORD_INCREMENT = 1;

const ZERO_FIRST_SONG = "sounds/music/71-71/Game/instruments/8_bit/one_shot/Final_Song.ogg";
const ZERO_SECOND_SONG = "sounds/music/71-71/Game/instruments/8_bit/full/Final_Song.ogg";

const LIGHT_START_POSITION = { x: 0, y: 31, z: 0 };
const LIGHT_END_POSITION = { x: 0, y: 0, z: 0 };

const CLEAR_COLOR_START = { r: 0.31, g: 0.3, b: 0.25, a: 1.0 };
const CLEAR_COLOR_END = { r: 0, g: 0, b: 0, a: 1.0 };

// Добавить свет по сторонам

export class Zero extends Enemy {
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
    private currentZeroSequence!: BellAttack;

    private musicObserver: Nullable<Observer<AbstractSound>> = null;
    private secondSong: Undefinable<AbstractSound> = undefined;

    private musicController: MusicController;

    private lightAnimationObserver: any;
    private lightToControl: Nullable<Light>;

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
                this.shooter.shooterEnabled = false;
                this.startShooterSequence();

                this.onSpawn();
            }
        });

        const zeroHP = this.hp;
        const sistersHP = this.getSistersHP();

        this.TOTAL_HP = zeroHP + sistersHP;
        this.lastCount = this.TOTAL_HP;
        this.currentCount = this.TOTAL_HP;
        this.hpBarContainer = this.scene.metadata.hp_bar;

        this.observeHP();

        this.stopAllMusic();
        this.lightToControl = this.getLightToControl();
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
            { mass: 0 },
            this.scene,
        );

        return this.collider;
    }

    public createMeshInstance() {
        const assets = EnemyAssetsManager.getAssets(this.scene);

        this.mesh = assets.enemy_sphere_merged.createInstance(`enemy-minion-zero`);
        this.mesh.scaling = new Vector3(1.3 * SHADOWLORD_INCREMENT, 1.3 * SHADOWLORD_INCREMENT, 1.3 * SHADOWLORD_INCREMENT);

        let coreShieldMesh: Mesh | null = null;

        if (this.hasShield) {
            coreShieldMesh = assets.enemy_sphere_shield.createInstance(
                `enemy-zero-reflector-${this.index}`,
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
            dispose_childrens: () => this.removeObservers(),
        });

        this.addShadow(this.mesh);
        this.updateCollisions();
    }

    // Light
    private getLightToControl() {
        return this.scene.getLightByName("spot-light-zero-light");
    }

    private animateLight() {
        if (!(this.lightToControl instanceof SpotLight)) return;

        const light = this.lightToControl;
        const gameClock = this.scene.metadata.gameClock;

        let elapsed = 0;
        const duration = 170;

        const start = new Vector3(
            LIGHT_START_POSITION.x,
            LIGHT_START_POSITION.y,
            LIGHT_START_POSITION.z,
        );
        const end = new Vector3(LIGHT_END_POSITION.x, LIGHT_END_POSITION.y, LIGHT_END_POSITION.z);

        const clearStart = new Color4(
            CLEAR_COLOR_START.r,
            CLEAR_COLOR_START.g,
            CLEAR_COLOR_START.b,
            CLEAR_COLOR_START.a,
        );
        const clearEnd = new Color4(
            CLEAR_COLOR_END.r,
            CLEAR_COLOR_END.g,
            CLEAR_COLOR_END.b,
            CLEAR_COLOR_END.a,
        );

        light.position.copyFrom(start);
        this.scene.clearColor.copyFrom(clearStart);

        this.lightAnimationObserver = gameClock.subscribe((dt: number) => {
            elapsed += dt;
            const t = Math.min(elapsed / duration, 1);

            Vector3.LerpToRef(start, end, t, light.position);
            Color4.LerpToRef(clearStart, clearEnd, t, this.scene.clearColor);

            if (t >= 1 && this.lightAnimationObserver) {
                this.lightAnimationObserver();
                this.lightAnimationObserver = null;
            }
        });
    }

    // Music
    private playZeroFirstSong() {
        this.musicController.playMusic(ZERO_FIRST_SONG, 0.45);
    }

    private playZeroSecondSong() {
        const musicEngine = this.scene.metadata.audio_engine.getMusicAudio();

        // Radio mode skips audible boss tracks, but the fight still ends on this song's length.
        if (musicEngine?.isRadioModeEnabled()) {
            this.secondSong = musicEngine.getSound(ZERO_SECOND_SONG);
            if (this.secondSong) {
                this.secondSong.play();
                this.secondSong.volume = 0;
                this.musicObserver = this.secondSong.onEndedObservable.add(() => {
                    this.handleDestroy(true, false, true);
                    this.removeObservers();
                    this.hideHPBar();
                });
            }
            return;
        }

        this.secondSong = this.musicController.playMusic(ZERO_SECOND_SONG, 0.45);

        if (this.secondSong) {
            this.musicObserver = this.secondSong.onEndedObservable.add(() => {
                this.handleDestroy(true, false, true);
                this.removeObservers();
                this.hideHPBar();
            });
        }
    }

    private stopAllMusic() {
        this.musicController.stopAllMusic();
    }

    // Zero logic
    private observeHP() {
        const engine = this.scene.getEngine();
        const container = this.hpBarContainer;

        container.metadata.animate_show();

        this.killingObserver = this.scene.onBeforeRenderObservable.add(() => {
            const zeroHP = this.hp;
            const sistersHP = this.getSistersHP();

            const currentHP = zeroHP + sistersHP;

            const count = this.TOTAL_HP - currentHP;
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

    private onHPChanged(hp: number) {
        if (hp === this.TOTAL_HP - 125) {
            this.stopAllMusic();
            this.playZeroSecondSong();

            this.currentZeroSequence.dispose();
            this.shooter.updateShootingState(SECOND_WAVE_SHOOTING_STATE);

            this.attackManager.add(
                new BellAttack(this.scene, this.node, this.shooter, ZERO_END_DELAYS, true, () => {
                    this.hideShield();
                    this.animateLight();
                    this.disposeSideLights();
                    this.disposeSistersWalls();
                }), 18.75
            );
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

        // Freeze light/clearColor where they are — no restore on either death path
        if (this.lightAnimationObserver) {
            this.lightAnimationObserver();
            this.lightAnimationObserver = null;
        }

        if (this.shieldObserver) {
            this.shieldObserver();
            this.shieldObserver = null;
        }

        this.attackManager.disposeAll();

        if (this.musicObserver && this.secondSong) {
            this.secondSong.onEndedObservable.remove(this.musicObserver);
            this.musicObserver = null;
            this.secondSong = undefined;
        }

        this.musicController.dispose();
    }

    // Sisters
    private getSistersHP(): number {
        const enemiesInPool = this.scene.metadata.enemies_pool_class.enemies;

        let sistersHP = 0;

        enemiesInPool.forEach((enemy: Enemy) => {
            if (enemy instanceof EnemySphere) {
                sistersHP += enemy.hp;
            }
        });

        return sistersHP;
    }

    private getSisterNode(name: string): EnemySphere | null {
        const enemiesInPool = this.scene.metadata.enemies_pool_class.enemies;

        for (const enemy of enemiesInPool) {
            if (enemy instanceof EnemySphere) {
                if (enemy.config.metadata.sister === name) {
                    return enemy;
                }
            }
        }

        return null;
    }

    private disposeSistersWalls() {
        const nodeNamesToDisspose = ["ground-cylinder-1", "ground-cylinder-2", "ground-cylinder-3", "ground-cylinder-4", "ground-cylinder-5", "barrier-cylinder-transparent-1", "barrier-cylinder-transparent-2", "barrier-cylinder-transparent-3", "barrier-cylinder-transparent-4", "barrier-cylinder-transparent-5"];
        for (const nodeName of nodeNamesToDisspose) {
            const node = this.scene.getMeshByName(nodeName);
            if (node) {
                node.dispose();
            }
        }
    }

    private disposeSideLights() {
        const lightNames = [
            "directional-light-side-z-plus",
            "directional-light-side-z-minus",
            "directional-light-side-x-plus",
            "directional-light-side-x-minus",
        ];

        for (const lightName of lightNames) {
            const light = this.scene.getLightByName(lightName);
            if (!light) continue;

            light.dispose();

            const lights = this.scene.metadata?.lights;
            if (Array.isArray(lights)) {
                const index = lights.indexOf(light);
                if (index !== -1) {
                    lights.splice(index, 1);
                }
            }
        }
    }

    // Attack logic
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

    private startShooterSequence() {
        const delay = 7.75;

        this.currentZeroSequence = this.attackManager.add(
            new BellAttack(this.scene, this.node, this.shooter, ZERO_START_DELAYS, true),
            delay
        );
        this.playZeroFirstSong();

        const five = this.getSisterNode("five");
        if (five) {
            this.attackManager.add(
                new BellAttack(this.scene, five.node, five.shooter, FIVE_DELAYS), delay
            );
        }

        const four = this.getSisterNode("four");
        if (four) {
            this.attackManager.add(
                new BellAttack(this.scene, four.node, four.shooter, FOUR_DELAYS), delay
            );
        }

        const three = this.getSisterNode("three");
        if (three) {
            this.attackManager.add(
                new BellAttack(this.scene, three.node, three.shooter, THREE_DELAYS), delay
            );
        }

        const two = this.getSisterNode("two");
        if (two) {
            this.attackManager.add(new BellAttack(this.scene, two.node, two.shooter, TWO_DELAYS), delay);
        }

        const one = this.getSisterNode("one");
        if (one) {
            this.attackManager.add(new BellAttack(this.scene, one.node, one.shooter, ONE_DELAYS), delay);
        }

    }
}
