import {
    Scene,
    Observer,
    TransformNode,
    Mesh,
    MeshBuilder,
    Vector3,
    StandardMaterial,
    Color3,
    Quaternion,
} from "@babylonjs/core";

import { Nullable } from "types/common";
import { EnemyConfig } from "types/enemy/Enemies.types";
import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";
import { WallConfig } from "types/static/Wall.types";
import {
    CategoryVolume,
    MusicConfig,
    musicConfigToCategoryVolume,
    musicLayersToCategoryVolume,
} from "types/music/MusicConfig.types";
import { PoolsByKilling } from "verses/verse.types";

import { isInsideRotatedBox } from "utils/babylon";
import { deg2rad } from "utils/math";

export class Triggers {
    private scene: Scene;
    private players: TransformNode[];

    private finishPool: number;
    private verseFinished: boolean = false;

    private invTriggers: InvisibleTriggerConfig[];
    private invTriggerMeshes: Mesh[] = [];

    private enemiesObserver: Nullable<Observer<Scene>> = null;

    private elapsedTimeEnemy = 0;
    private readonly intervalEnemy = 0.1;

    private invisibleTriggersObserver: Nullable<Observer<Scene>> = null;

    private elapsedTimeInvisibleTriggers = 0;
    private readonly intervalInvisibleTriggers = 0.1;

    private activeEnemyPools = new Set<number>();
    private triggeredEnemyPools = new Set<number>();

    private triggerEnemyDependencies = new Map<number, number[]>();

    private activatedKillingTriggers = new Set<number>();

    private musicConfig: Nullable<MusicConfig> = null;
    private initialMusicVolume: CategoryVolume = {};

    private debug: boolean = false;

    private boundManualFinish: ((e: KeyboardEvent) => void) | null = null;

    constructor(scene: Scene, invTriggers: InvisibleTriggerConfig[], finishPool: number) {
        this.scene = scene;
        this.players = scene.metadata.players;
        this.finishPool = finishPool;
        this.verseFinished = false;

        this.invTriggers = invTriggers;
        this.createInvisibleTriggers();

        if (process.env.NODE_ENV === "development") {
            this.boundManualFinish = (e: KeyboardEvent) => this.manualFinish(e);
            document.addEventListener("keydown", this.boundManualFinish);
        }

        this.scene.metadata = { ...this.scene.metadata, triggers_class: this };
    }

    private manualFinish(e: KeyboardEvent) {
        if (e.code === "F3") {
            e.preventDefault();
            this.activateEnemyPool([], this.finishPool);
        }
    }

    public createInvisibleTriggers() {
        this.invTriggers.forEach((trg, index) => {
            const { position, scale, rotation, trigger } = trg;

            const mesh = MeshBuilder.CreateBox(`trigger-${index}`);

            mesh.scaling = new Vector3(scale.w, scale.h, scale.d);
            mesh.position.copyFrom(new Vector3(position.x, position.y, position.z));
            mesh.rotationQuaternion = Quaternion.FromEulerAngles(
                deg2rad(rotation.x),
                deg2rad(rotation.y),
                deg2rad(rotation.z),
            );

            if (this.debug) {
                mesh.visibility = 0.3;
                mesh.setEnabled(true);
            } else {
                mesh.visibility = 0.0;
                mesh.setEnabled(false);
            }

            const mat = new StandardMaterial(`trigger-${index}`);
            mat.diffuseColor = Color3.Red();

            mesh.material = mat;

            mesh.metadata = {
                ...mesh.metadata,
                activated: false,
                action: trigger.action,
                pool: trigger.pool,
                disposable: trigger.disposable,
                audio: trigger.audio,
            };
            this.scene.metadata.triggers.push(mesh);

            this.invTriggerMeshes.push(mesh);
        });
    }

    private observeInvisibleTriggers(wConfigs: WallConfig[], eConfigs: EnemyConfig[]) {
        this.players?.forEach((player) => {
            const playerPos = player.position;

            [...this.invTriggerMeshes].forEach((trigger) => {
                if (isInsideRotatedBox(playerPos, trigger)) {
                    if (!trigger.metadata.activated) {
                        this.applyTriggerAction(trigger, wConfigs, eConfigs);
                    }
                }
            });
        });
    }

    private disposeTrigger(trigger: Mesh, disposable: boolean) {
        if (disposable) {
            trigger.material?.dispose();
            trigger.dispose();

            if (Array.isArray(this.invTriggerMeshes)) {
                const index = this.invTriggerMeshes.indexOf(trigger);
                if (index !== -1) this.invTriggerMeshes.splice(index, 1);
            }
        }
    }

    private damagePlayer(pool: number) {
        const players = this.scene.metadata.players;
        if (!players.length) return;

        const player = players[0];
        if (!player) return;

        if (pool === 12345) {
            player?.metadata?.callbacks?.update_model_to_dark?.();
        } else if (pool === 1234) {
            player?.metadata?.callbacks?.update_model_to_dual?.();
        }

        this.scene.metadata?.effects?.player_destroy?.apply?.(player);
        player?.metadata?.callbacks?.self_destruct_effects?.();
    }

    private applyTriggerAction(trigger: Mesh, wConfigs: WallConfig[], eConfigs: EnemyConfig[]) {
        const { action, pool, disposable, reset_killing_count, audio } = trigger.metadata;

        if (action === "camera") {
            return;
        }

        trigger.metadata.activated = true;

        switch (action) {
            case "wall":
                this.updateWallPool(wConfigs, pool);
                break;
            case "enemy":
                this.activateEnemyPool(eConfigs, pool);
                break;
            case "damage":
                this.damagePlayer(pool);
                break;
            case "audio":
                this.playTriggerAudio(audio);
                break;
            default:
                break;
        }

        this.disposeTrigger(trigger, disposable);
    }

    private playTriggerAudio(audio?: { name: string; volume: number }) {
        if (!audio?.name) return;

        const voiceAudio = this.scene.metadata.audio_engine?.getVoiceAudio();
        voiceAudio?.playSound(audio.name, audio.volume ?? 1.0);
    }

    public create(
        eConfigs: EnemyConfig[],
        eStartPools: number[],
        wConfigs: WallConfig[],
        killingTriggers?: PoolsByKilling[],
        musicConfig?: MusicConfig,
    ) {
        this.musicConfig = musicConfig ?? null;
        this.initialMusicVolume = musicConfig ? musicConfigToCategoryVolume(musicConfig) : {};
        this.resetMusicLayers();

        this.buildEnemyDependencies(eConfigs);

        eStartPools.forEach((pool) => {
            this.activateEnemyPool(eConfigs, pool);
        });

        this.enemiesObserver = this.scene.onBeforeRenderObservable.add(() => {
            const gameClock = this.scene.metadata.gameClock;

            const delta = gameClock.getGlobalDeltaTime();
            const paused = gameClock.paused;

            if (paused) return;

            this.elapsedTimeEnemy += delta;

            if (this.elapsedTimeEnemy >= this.intervalEnemy) {
                this.elapsedTimeEnemy = 0;
                this.observeEnemiesTriggers(eConfigs, wConfigs, killingTriggers);
            }
        });

        this.invisibleTriggersObserver = this.scene.onBeforeRenderObservable.add(() => {
            const gameClock = this.scene.metadata.gameClock;

            const delta = gameClock.getGlobalDeltaTime();
            const paused = gameClock.paused;

            if (paused) return;

            this.elapsedTimeInvisibleTriggers += delta;

            if (this.elapsedTimeInvisibleTriggers >= this.intervalInvisibleTriggers) {
                this.elapsedTimeInvisibleTriggers = 0;
                this.observeInvisibleTriggers(wConfigs, eConfigs);
            }
        });
    }

    private buildEnemyDependencies(configs: EnemyConfig[]) {
        this.triggerEnemyDependencies.clear();

        for (const cfg of configs) {
            const { self, to_trigger } = cfg.trigger.pool;
            if (to_trigger === null || to_trigger === undefined) continue;

            const triggers = Array.isArray(to_trigger) ? to_trigger : [to_trigger];

            for (const trg of triggers) {
                if (!this.triggerEnemyDependencies.has(trg)) {
                    this.triggerEnemyDependencies.set(trg, []);
                }

                const arr = this.triggerEnemyDependencies.get(trg)!;
                if (!arr.includes(self)) arr.push(self);
            }
        }
    }

    private observeEnemiesTriggers(
        eConfigs: EnemyConfig[],
        wConfigs: WallConfig[],
        killingTriggers?: PoolsByKilling[],
    ) {
        const enemies = this.scene.metadata?.enemies || [];
        const enemiesPool = this.scene.metadata?.enemies_pool_class;
        if (!enemiesPool) return;

        for (const [nextId, requiredPools] of this.triggerEnemyDependencies.entries()) {
            if (this.triggeredEnemyPools.has(nextId)) continue;

            const allRequiredActivated = requiredPools.every((poolId) =>
                this.triggeredEnemyPools.has(poolId),
            );
            if (!allRequiredActivated) continue;

            const allCleared = requiredPools.every((poolId) => {
                return !enemies.some((enemyNode: TransformNode) => {
                    const cfg = enemyNode.metadata?.config as EnemyConfig;
                    return cfg.trigger.pool.self === poolId;
                });
            });

            if (allCleared) {
                this.activateEnemyPool(eConfigs, nextId);
                this.updateWallPool(wConfigs, nextId);
            }
        }

        const killCount = this.scene.metadata.killing_counter ?? 0;

        killingTriggers?.forEach((trigger, index) => {
            if (this.activatedKillingTriggers.has(index)) return;
            if (killCount < trigger.count) return;

            this.activateEnemyPool(eConfigs, trigger.pool);
            this.updateWallPool(wConfigs, trigger.pool);

            this.activatedKillingTriggers.add(index);
        });
    }

    public activateEnemyPool(configs: EnemyConfig[], poolId: number) {
        if (poolId === this.finishPool) {
            this.verseFinished = true;
            this.scene.metadata.callbacks.swicth_verse();
        }

        const enemiesPool = this.scene.metadata?.enemies_pool_class;
        if (!enemiesPool) return;

        this.activeEnemyPools.add(poolId);
        this.triggeredEnemyPools.add(poolId);

        if (!this.verseFinished) {
            enemiesPool.create(configs, poolId);
            this.updateMusicPool(poolId);
            this.scene.metadata.callbacks?.apply_environment_for_pool?.(poolId);
        }
    }

    private resetMusicLayers() {
        if (!Object.keys(this.initialMusicVolume).length) return;

        this.applyMusicVolume(this.initialMusicVolume);
    }

    private updateMusicPool(poolId: number) {
        const poolConfig = this.musicConfig?.by_pools?.find((entry) => entry.pool === poolId);
        if (!poolConfig) return;

        this.applyMusicVolume(
            musicLayersToCategoryVolume(poolConfig.layers),
            poolConfig.duration,
        );
    }

    private applyMusicVolume(volume: CategoryVolume, duration: number = 0) {
        this.scene.metadata.callbacks?.update_music_layers_volume?.(volume, duration);
    }

    private updateWallPool(configs: WallConfig[], poolId: number) {
        const wallsClass = this.scene.metadata?.walls_class;
        if (!wallsClass) return;

        if (!this.verseFinished) {
            wallsClass.updateWalls(configs, poolId);
        }
    }

    public dispose() {
        if (this.enemiesObserver) {
            this.scene.onBeforeRenderObservable.remove(this.enemiesObserver);
            this.enemiesObserver = null;
        }
        if (this.invisibleTriggersObserver) {
            this.scene.onBeforeRenderObservable.remove(this.invisibleTriggersObserver);
            this.invisibleTriggersObserver = null;
        }

        this.invTriggerMeshes.forEach((trg) => {
            trg.material?.dispose();
            trg.dispose();
        });

        this.invTriggerMeshes = [];

        this.activeEnemyPools.clear();
        this.triggeredEnemyPools.clear();
        this.triggerEnemyDependencies.clear();
        this.activatedKillingTriggers.clear();

        this.musicConfig = null;
        this.initialMusicVolume = {};

        if (this.boundManualFinish) {
            document.removeEventListener("keydown", this.boundManualFinish);
            this.boundManualFinish = null;
        }
    }
}
