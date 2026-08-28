import { Vector3, Scene, PhysicsImpostor, MeshBuilder } from "@babylonjs/core";

import { Enemy } from "../Enemy";
import { EnemyAssetsManager } from "../EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";

export class EnemyArrowShield2 extends Enemy {
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

        this.mesh = MeshBuilder.CreateBox(`enemy-minion-arrow-protected-${this.index}`, {
            width: 1.1,
            depth: 0.8,
            height: 1.1,
        });
        this.mesh.isVisible = false;

        if (this.config.follow_player.enabled) {
            const position = this.config.on_spawn.position;

            this.collider = MeshBuilder.CreateBox(
                `enemy-collider-arrow-protected-${this.index}`,
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

        const model = assets.enemy_arrow_shield_2_merged.createInstance(`model-2-${this.index}`);
        model.parent = this.node;

        const shield_1 = MeshBuilder.CreateBox("shield-1", { width: 1.4, height: 1.2, depth: 0.9 });
        shield_1.position.z = 0.9;
        shield_1.isVisible = false;
        shield_1.parent = this.mesh;

        const shield_2 = MeshBuilder.CreateBox("shield-2", { width: 1.4, height: 1.2, depth: 0.9 });
        shield_2.position.z = -0.9;
        shield_2.isVisible = false;
        shield_2.parent = this.mesh;

        this.mesh.parent = this.node;

        this.node.metadata = {
            ...this.node.metadata,
            hover_factor: {
                plane: 0.65,
                sphere: 0.55,
                cylinder: 0.75,
            },
        };
        this.addShadow(model);

        this.updateCollisions();
    }
}
