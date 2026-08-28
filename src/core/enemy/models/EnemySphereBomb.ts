import { Vector3, Scene, PhysicsImpostor, MeshBuilder, Mesh } from "@babylonjs/core";

import { Enemy } from "../Enemy";
import { EnemyAssetsManager } from "../EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";

export class EnemySphereBomb extends Enemy {
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
    }

    public createMeshInstance() {
        const assets = EnemyAssetsManager.getAssets(this.scene);

        this.mesh = assets.enemy_sphere_bomb_merged.createInstance(
            `enemy-minion-sphere-bomb-${this.index}`,
        );

        if (this.config.follow_player.enabled) {
            const position = this.config.on_spawn.position;

            this.collider = MeshBuilder.CreateSphere(
                `enemy-collider-sphere-bomb-${this.index}`,
                { diameter: 1.5 },
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
        } else {
            this.mesh.physicsImpostor = new PhysicsImpostor(
                this.mesh,
                PhysicsImpostor.SphereImpostor,
                { mass: 0 },
                this.scene,
            );
        }

        this.mesh.parent = this.node;

        const disc = assets.enemy_sphere_bomb_disc_merged.createInstance(
            `bomb-sphere-disc-${this.index}`,
        );
        disc.metadata = {};
        disc.metadata.disable_side_effects = true;
        this.scene.metadata?.effects?.sphere_bomb_disc_spawn_animation?.apply?.(disc);
        disc.parent = this.node;

        this.node.metadata = {
            ...this.node.metadata,
            hover_factor: {
                plane: 0.75,
                sphere: 0.55,
                cylinder: 0.65,
            },
            bomb_radius: 7.5,
        };

        this.addShadow(this.mesh);
        this.updateCollisions();
    }
}
