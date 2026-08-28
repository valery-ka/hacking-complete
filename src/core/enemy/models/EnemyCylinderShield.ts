import { Vector3, Scene, PhysicsImpostor, MeshBuilder } from "@babylonjs/core";

import { Enemy } from "../Enemy";
import { EnemyAssetsManager } from "../EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";

export class EnemyCylinderShield extends Enemy {
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

        this.mesh = assets.enemy_cylinder_shield_merged.createInstance(
            `enemy-minion-cylinder-protected-${this.index}`,
        );

        if (this.config.follow_player.enabled) {
            const position = this.config.on_spawn.position;

            this.collider = MeshBuilder.CreateCylinder(
                `enemy-collider-cylinder-protected-${this.index}`,
                { diameter: 1, height: 1.5, tessellation: 20 },
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

        const shieldSize = { width: 0.9, height: 1.5, depth: 1.1 };
        const leftShield = MeshBuilder.CreateBox("shield", shieldSize);
        leftShield.position.x = -0.85;
        leftShield.isVisible = false;
        leftShield.parent = this.mesh;

        const rightShield = MeshBuilder.CreateBox("shield", shieldSize);
        rightShield.position.x = 0.85;
        rightShield.isVisible = false;
        rightShield.parent = this.mesh;

        this.mesh.parent = this.node;

        this.node.metadata = {
            ...this.node.metadata,
            hover_factor: {
                plane: 0.75,
                sphere: 0.75,
                cylinder: 0.75,
            },
        };

        this.addShadow(this.mesh);

        this.updateCollisions();
    }
}
