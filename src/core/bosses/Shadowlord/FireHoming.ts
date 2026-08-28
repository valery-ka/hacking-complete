import { Mesh, Nullable, Scene, TransformNode, Vector3 } from "@babylonjs/core";

import { EnemyAssetsManager } from "../../enemy/EnemyAssetsManager";

import { BaseAttack } from "../AttackManager/BaseAttack";
import { EnemyShooter } from "core/enemy/EnemyShooter";

import { EnemyConfig } from "types/enemy/Enemies.types";

const DUMMY_ENEMY_CONFIG: EnemyConfig = {
    trigger: { pool: { self: 0, to_trigger: 0 } },
    enemy_type: "sphere",
    on_spawn: { position: { x: 0, y: 0, z: 0 }, rotation_y: 0, hp: 0 },
    ground: { id: 0, physics: "none", size: 0 },
    is_inside_ground: false,
    follow_player: { enabled: false },
    triggers_by_player: [false, false],
    rotate_to_player: { enabled: false },
    auto_rotation: { enabled: false },
    animation: { enabled: false },
    shooter: {
        enabled: true,
        initial_delay: 10,
        cooldown: 75,
        directions: [0, Math.PI / 8, Math.PI / 4, (3 * Math.PI) / 8, Math.PI / 2],
        pattern: [
            [0, 1, 0],
            [1, 2, 0],
            [1, 1, 0],
            [2, 1, 0],
            [1, 0, 0],
        ],
        spreading: 0.001,
    },
    is_miner: true,
};

export class FireHoming extends BaseAttack {
    private readonly ATTACK_LIFE_TIME = 10;

    private readonly SPEED = 5;

    private node: Nullable<TransformNode> = null;
    private shooter: Nullable<EnemyShooter> = null;

    private inverted: boolean;

    constructor(scene: Scene, parent: TransformNode, inverted: boolean) {
        super(scene, parent);

        this.inverted = inverted;
    }

    public start() {
        this.fireHoming();
    }

    private getPlayerToFollow(): TransformNode | null {
        const players = this.scene.metadata.players;
        if (!players.length) return null;

        return players[0];
    }

    private fireHoming() {
        const spawnPosition = this.parent.getAbsolutePosition().clone();

        this.node = new TransformNode("homing-node", this.scene);

        this.node.position.copyFrom(spawnPosition);
        // this.node.position.y -= 0.25;

        this.node.rotation.x = -Math.PI / 2;
        this.node.rotation.z = Math.PI / 2;

        const assets = EnemyAssetsManager.getAssets(this.scene);

        const fireBall = assets.enemy_fireball.createInstance(`shadowlord-fireball`);
        fireBall.parent = this.node;
        fireBall.metadata = { config: DUMMY_ENEMY_CONFIG };

        this.shooter = new EnemyShooter(this.scene, fireBall);

        const player = this.getPlayerToFollow();

        if (!player) {
            this.dispose();
            return;
        }

        let elapsed = 0;

        this.observeCollisions(fireBall);

        const direction = this.inverted ? Vector3.Left() : Vector3.Right();

        const unsubscribe = this.subscribe((dt: number) => {
            if (!this.node) return;

            elapsed += dt;

            this.node.position.addInPlace(direction.scale(this.SPEED * dt));

            if (elapsed >= this.ATTACK_LIFE_TIME) {
                this.unsubscribe(unsubscribe);

                this.dispose();
            }
        });
    }

    private observeCollisions(fireBall: Mesh) {
        const walls = this.scene.metadata.walls;
        if (!walls?.length) return;

        this.subscribe(() => {
            for (const wall of walls as Mesh[]) {
                if (wall.intersectsMesh(fireBall, true)) {
                    if (wall.name.includes("invisible")) return;
                    this.node?.dispose();
                }
            }
        });
    }

    public override dispose() {
        super.dispose();

        this.node?.dispose();
        this.shooter?.dispose();
    }
}
