import { Vector3, Scene, PhysicsImpostor, MeshBuilder, TransformNode } from "@babylonjs/core";

import { Enemy } from "../Enemy";
import { EnemyAssetsManager } from "../EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";

const CHECK_RADIUS = 5;
const SOUND_INTERVAL = 0.4;

export class EnemyKamikaze extends Enemy {
    private index: number;

    constructor(scene: Scene, enemy_config: EnemyConfig, index: number) {
        super(scene, enemy_config, index);

        this.index = index;

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
                this.onSpawn(0);

                this.observeKamikaze();
            }
        });
    }

    public createMeshInstance() {
        const assets = EnemyAssetsManager.getAssets(this.scene);

        this.mesh = assets.enemy_kamikaze_merged.createInstance(
            `enemy-minion-kamikaze-${this.index}`,
        );

        if (this.config.follow_player.enabled) {
            const position = this.config.on_spawn.position;

            this.collider = MeshBuilder.CreateBox(
                `enemy-collider-kamikaze-${this.index}`,
                { size: 1.5 },
                this.scene,
            );
            this.collider.position = new Vector3(position.x, position.y, position.z);
            this.collider.isVisible = false;
            this.collider.physicsImpostor = new PhysicsImpostor(
                this.collider,
                PhysicsImpostor.SphereImpostor,
                { mass: 2.5 },
                this.scene,
            );
        } else {
            this.mesh.physicsImpostor = new PhysicsImpostor(
                this.mesh,
                PhysicsImpostor.SphereImpostor,
                { mass: 0 },
                this.scene,
            );
        }

        const zOffset = this.runningAway ? -0.6 : 0.6;

        this.mesh.position.z = zOffset;
        this.mesh.parent = this.node;

        const isMiner = this.config.is_miner;
        const minerIncrement = isMiner ? 4 : 0;

        this.node.metadata = {
            ...this.node.metadata,
            hover_factor: {
                plane: 0.65,
                sphere: 0.55,
                cylinder: 0.55,
            },
            bomb_radius: 7.5 + minerIncrement,
        };

        this.addShadow(this.mesh);

        this.updateCollisions();
    }

    private checkPlayersInRadius() {
        const kamikazePosition = this.node.getAbsolutePosition();

        const isMiner = this.config.is_miner;
        const minerMultiplier = isMiner ? 2 : 1;

        const radiusSq = CHECK_RADIUS * CHECK_RADIUS * minerMultiplier;

        const playersToDamage: TransformNode[] = [];

        this.scene.metadata.players.forEach((player: TransformNode) => {
            const enemyPosition = player.getAbsolutePosition();
            const distanceSq = Vector3.DistanceSquared(kamikazePosition, enemyPosition);

            if (distanceSq <= radiusSq) {
                playersToDamage.push(player);
            }
        });

        playersToDamage.forEach((player) => {
            player?.metadata?.callbacks?.on_damage?.();
        });

        if (playersToDamage.length > 0) {
            this.handleDestroy(true, true);
        }
    }

    private playWhileAliveSound() {
        const whileAlive = this.config.sounds?.while_alive;
        const sounds = whileAlive?.sound;

        if (!sounds || sounds.length === 0) return;

        const sound = sounds[Math.floor(Math.random() * sounds.length)];

        if (whileAlive.engine === "voice") {
            this.voiceEngine?.playSound(sound, 1.0, this.node);
        } else {
            this.audioEngine?.playSound(sound, 1.0, this.node);
        }
    }

    private observeKamikaze() {
        this.playWhileAliveSound();

        let elapsed = 0;

        const unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            if (this.node.isDisposed()) {
                unsubscribe();
                return;
            }

            this.checkPlayersInRadius();

            elapsed += dt;

            if (elapsed >= SOUND_INTERVAL) {
                elapsed -= SOUND_INTERVAL;
                this.playWhileAliveSound();
            }
        });
    }
}
