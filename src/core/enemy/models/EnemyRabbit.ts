import { Vector3, Scene, PhysicsImpostor, MeshBuilder, TransformNode } from "@babylonjs/core";

import { Enemy } from "../Enemy";
import { EnemyAssetsManager } from "../EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";

import { addCallbacks } from "utils/babylon";

const ROT = new Vector3(-0.6154798887, -0.261799, 0.785398);

export class EnemyRabbit extends Enemy {
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

                this.onSpawn();
            }
        });

        addCallbacks(this.node, {
            on_rabbit_damaged: () => this.onRabbitDamaged(),
        });
    }

    public createMeshInstance() {
        const assets = EnemyAssetsManager.getAssets(this.scene);

        this.mesh = assets.enemy_box_merged.createInstance(`enemy-rabbit-${this.index}`);

        const size = 5;

        this.mesh.scaling = new Vector3(size, size, size);
        this.mesh.rotation = new Vector3(-0.6154798887, -0.261799, 0.785398);

        this.mesh.physicsImpostor = new PhysicsImpostor(
            this.mesh,
            PhysicsImpostor.BoxImpostor,
            { mass: 0 },
            this.scene,
        );

        const hitBox = MeshBuilder.CreateBox("enemy-rabbit-hit-box");
        hitBox.scaling = new Vector3(1.5, 1.5, 1.5);
        hitBox.position.y = -3;
        hitBox.isVisible = false;
        hitBox.parent = this.node;

        this.mesh.parent = this.node;

        this.node.metadata = {
            ...this.node.metadata,
            hover_factor: {
                plane: size / 2,
                sphere: size / 2 - 0.2,
                cylinder: size / 2,
            },
            bomb_radius: 15,
            not_explodable: true,
        };

        this.addShadow(this.mesh);
        this.updateCollisions();
    }

    public onRabbitDamaged() {
        this.onDamage(this.node, ROT, 50);

        if (this.hp === 0) {
            this.applyRadualBlur();
            this.applyPlayerCameraWiggle();
        }
    }

    private applyRadualBlur() {
        const players = this.scene.metadata.players;

        if (players) {
            players.forEach((player: TransformNode) => {
                player.metadata?.callbacks?.radial_blur_camera();
            });
        }
    }

    private applyPlayerCameraWiggle() {
        const players = this.scene.metadata.players;

        if (players) {
            players.forEach((player: TransformNode) => {
                player.metadata?.callbacks?.wiggle_camera();
            });
        }
    }
}
