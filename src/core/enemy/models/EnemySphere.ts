import { Vector3, Scene, PhysicsImpostor, MeshBuilder, Mesh } from "@babylonjs/core";

import { Enemy } from "../Enemy";
import { EnemyAssetsManager } from "../EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { addCallbacks } from "utils/babylon";

export class EnemySphere extends Enemy {
    private index: number;

    private shieldId: number | null = null;
    private hasShield: boolean;

    constructor(scene: Scene, enemy_config: EnemyConfig, index: number) {
        super(scene, enemy_config, index);

        this.index = index;

        this.shieldId = enemy_config.shield?.pool ?? null;
        this.hasShield = enemy_config.shield?.enabled ?? false;

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

    public createCollider(pos?: Vector3) {
        const position = pos ?? this.config.on_spawn.position;

        let diameter = 0;

        if (this.node.metadata.has_shield === undefined) {
            diameter = this.hasShield ? 4.5 : 1.5;
        } else if (this.node.metadata.has_shield === true) {
            diameter = 4.5;
        } else {
            diameter = 1.5;
        }

        this.collider = MeshBuilder.CreateSphere(
            `enemy-collider-sphere-${this.index}`,
            { diameter: diameter },
            this.scene,
        );
        this.collider.position = new Vector3(position.x, position.y, position.z);
        this.collider.isVisible = false;

        // A massless impostor is never pushed away by contacts, but it also cannot be
        // driven by velocity, so only enemies that actually move are given a mass.
        const isMoving = this.config.follow_player.enabled || !!this.node.metadata?.is_following;

        this.collider.physicsImpostor = new PhysicsImpostor(
            this.collider,
            PhysicsImpostor.SphereImpostor,
            { mass: isMoving ? 100 : 0 },
            this.scene,
        );

        return this.collider;
    }

    public createMeshInstance() {
        const assets = EnemyAssetsManager.getAssets(this.scene);

        this.mesh = assets.enemy_sphere_merged.createInstance(`enemy-minion-core-${this.index}`);
        this.mesh.scaling = new Vector3(1.3, 1.3, 1.3);

        let coreShieldMesh: Mesh | null = null;

        if (this.hasShield) {
            coreShieldMesh = assets.enemy_sphere_shield.createInstance(
                `enemy-core-protection-${this.index}`,
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

        const dontHover = !!this.config.ground.dont_correct_hover;

        this.node.metadata = {
            ...this.node.metadata,
            has_shield: this.hasShield,
            shield: coreShieldMesh,
            shield_id: this.shieldId,
            hover_factor: {
                plane: dontHover ? 0 : 0.75,
                sphere: dontHover ? 0 : 0.55,
                cylinder: dontHover ? 0 : 0.65,
            },
        };

        addCallbacks(this.node, {
            create_collider: (position: Vector3) => this.createCollider(position),
        });

        this.addShadow(this.mesh);
        this.updateCollisions();
    }
}
