import { Scene, PhysicsImpostor, MeshBuilder, Mesh, TransformNode } from "@babylonjs/core";

import { Enemy } from "../Enemy";
import { EnemyAssetsManager } from "../EnemyAssetsManager";

import { EnemyConfig } from "types/enemy/Enemies.types";
import { Nullable } from "types/common";

let rocketID = 0;

// находится тут, потому что в целом поведение сильно пересекается с обычными врагами
export class EnemyRocket extends Enemy {
    private _lifeTimeObserver: Nullable<any> = null;
    private _collisionObserver: Nullable<any> = null;
    private _markedForDispose = false;
    private _playerOverheat = 0;
    private _trailId: Nullable<number> = null;
    private _registered = false;

    constructor(scene: Scene, enemy_config: EnemyConfig) {
        super(scene, enemy_config, rocketID);

        const delay = enemy_config.on_spawn.delay ?? 0.05;
        const gameClock = this.scene.metadata.gameClock;

        let elapsed = 0;

        const unsubscribe = gameClock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= delay) {
                unsubscribe();

                if (this.node.isDisposed()) return;

                this.observeLifeTime();
                this.observeCollision();

                this.createMeshInstance();
                this.initializeEnemyBehaviour();
                this.onSpawn(250);
            }
        });
    }

    private observeLifeTime() {
        const MAX_AGE = 20;
        let elapsed = 0;

        this._lifeTimeObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= 0.1 && !this._registered) {
                this.mesh.setEnabled(true);
            }

            if (elapsed >= 0.2 && !this._registered) {
                const trailManager = this.scene.metadata.effects.rocket_trail_manager;
                this._trailId = trailManager.registerRocket(this.node);
                this._registered = true;
            }

            if (elapsed >= MAX_AGE || !this.node.metadata) {
                this._markedForDispose = true;
            }

            if (this._markedForDispose) {
                if (this._trailId !== null) {
                    const trailManager = this.scene.metadata.effects.rocket_trail_manager;
                    trailManager.unregisterRocket(this._trailId);
                    this._trailId = null;
                }

                if (this._lifeTimeObserver) {
                    this._lifeTimeObserver();
                    this._lifeTimeObserver = null;
                }
                if (this._collisionObserver) {
                    this._collisionObserver();
                    this._collisionObserver = null;
                }

                this.isInvincible = false;
                this.handleDestroy(true);
            }
        });
    }

    private onCollision(mesh: Mesh) {
        const parent = mesh.parent;
        if (!parent) return;

        if (this._playerOverheat >= 8) {
            parent.metadata.callbacks.on_damage("rocket-hit");
            this._playerOverheat = 0;
        } else if (!parent?.metadata?.invincible) {
            this._playerOverheat++;
        }
    }

    private observeCollision() {
        this._playerOverheat = 0;

        const players = this.scene.metadata.players;
        const collidableMeshes = players
            ?.map((player: TransformNode) => player.getChildMeshes())
            .flat();
        if (!collidableMeshes) return;

        let collisionTimer = 0;
        const intervalSec = 0.2;

        this._collisionObserver = this.scene.metadata.gameClock.subscribe((dt: number) => {
            collisionTimer += dt;
            if (collisionTimer < intervalSec) return;

            collisionTimer = 0;
            let anyCollision = false;

            for (const mesh of collidableMeshes as Mesh[]) {
                if (mesh.intersectsMesh(this.mesh)) {
                    anyCollision = true;
                    this.onCollision(mesh);
                }
            }

            if (!anyCollision) this._playerOverheat = 0;
        });
    }

    public createMeshInstance() {
        const assets = EnemyAssetsManager.getAssets(this.scene);

        this.mesh = assets.rocket_mesh_merged.createInstance(`enemy-rocket-${rocketID}`);
        this.mesh.setEnabled(false);

        this.collider = MeshBuilder.CreateSphere(`enemy-collider-rocket-${rocketID}`, {
            diameter: 1,
            segments: 16,
        });
        this.collider.isVisible = false;
        this.collider.physicsImpostor = new PhysicsImpostor(
            this.collider,
            PhysicsImpostor.SphereImpostor,
            { mass: 1.0 },
            this.scene,
        );

        this.mesh.parent = this.node;

        this.node.metadata = {
            ...this.node.metadata,
            hover_factor: {
                plane: 0.25,
                sphere: 0.0,
                cylinder: 0.25,
            },
        };

        this.addShadow(this.mesh);
        this.updateCollisions();

        rocketID++;
    }
}
