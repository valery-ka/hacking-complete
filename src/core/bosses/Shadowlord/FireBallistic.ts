import { Axis, Mesh, Scene, Space, TransformNode, Vector3 } from "@babylonjs/core";

import { EnemyAssetsManager } from "../../enemy/EnemyAssetsManager";

import { BaseAttack } from "../AttackManager/BaseAttack";
import { EnemyShooter } from "core/enemy/EnemyShooter";

import { Nullable } from "types/common";
import { EnemyConfig } from "types/enemy/Enemies.types";

import { generateDirections } from "utils/math";

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
        cooldown: 100,
        directions: generateDirections(3),
        spreading: 0.001,
    },
};

export class FireBallistic extends BaseAttack {
    private readonly ATTACK_DURATION = 5;
    private readonly ATTACK_LIFE_TIME = 10;
    private readonly TARGET_OFFSET = new Vector3(0, 0, -50);

    private readonly GRAVITY = -3;
    private readonly FOLLOW_INERTIA = 1.0;
    private readonly ANGULAR_SPEED = 2.0;

    private node: Nullable<TransformNode> = null;
    private shooter: Nullable<EnemyShooter> = null;

    private startOffset = new Vector3(0, 0, 0);
    private disposeOnCollision = false;

    constructor(scene: Scene, parent: TransformNode, startOffset: Vector3) {
        super(scene, parent);

        this.startOffset = startOffset;
    }

    public start() {
        this.fireBallistic();
    }

    private getPlayerToFollow(): TransformNode | null {
        const players = this.scene.metadata.players;
        if (!players.length) return null;

        return players[0];
    }

    private updateBallisticPosition(
        velocity: Vector3,
        gravity: Vector3,
        player: TransformNode,
        positionNode: TransformNode,
        dt: number,
        followInertia: number,
    ) {
        velocity.addInPlace(gravity.scale(dt));

        const currentSpeed = velocity.length();
        const desiredDirection = player
            .getAbsolutePosition()
            .subtract(positionNode.position)
            .normalize();

        const desiredVelocity = desiredDirection.scale(currentSpeed);

        velocity.addInPlace(desiredVelocity.subtract(velocity).scale(followInertia * dt));

        positionNode.position.addInPlace(velocity.scale(dt));
    }

    private updateBallisticRotation(
        velocity: Vector3,
        pitchNode: TransformNode,
        spinNode: TransformNode,
        dt: number,
    ) {
        const direction = velocity.clone().normalize();

        const horizontalLength = Math.sqrt(direction.x * direction.x + direction.z * direction.z);

        pitchNode.rotation.x = Math.atan2(direction.y, horizontalLength) + Math.PI / 2;

        spinNode.rotate(Axis.Y, this.ANGULAR_SPEED * dt, Space.LOCAL);
    }

    private fireBallistic() {
        const spawnPosition = this.parent
            .getAbsolutePosition()
            .clone()
            .addInPlace(this.startOffset);

        this.node = new TransformNode("ballistic-pitch-node", this.scene);
        this.node.position.copyFrom(spawnPosition);

        const spinNode = new TransformNode("ballistic-spin-node", this.scene);
        spinNode.parent = this.node;

        const assets = EnemyAssetsManager.getAssets(this.scene);

        const fireBall = assets.enemy_fireball.createInstance(`shadowlord-fireball`);
        fireBall.parent = spinNode;
        fireBall.metadata = { config: DUMMY_ENEMY_CONFIG };

        this.shooter = new EnemyShooter(this.scene, fireBall);

        const player = this.getPlayerToFollow();

        if (!player) {
            this.dispose();
            return;
        }

        const gravity = new Vector3(0, this.GRAVITY, 0);

        const flightTime = this.ATTACK_DURATION;
        const targetPosition = spawnPosition.clone().addInPlace(this.TARGET_OFFSET);

        const velocity = targetPosition
            .subtract(spawnPosition)
            .subtract(gravity.scale(0.5 * flightTime * flightTime))
            .scale(1 / flightTime);

        let elapsed = 0;

        this.observeCollisions(fireBall);

        const unsubscribe = this.subscribe((dt: number) => {
            if (!this.node) return;

            elapsed += dt;

            if (elapsed >= 1) {
                this.disposeOnCollision = true;
            }

            const progress = Math.min(elapsed / flightTime, 1.0);

            const followInertia = this.FOLLOW_INERTIA * progress;

            this.updateBallisticPosition(velocity, gravity, player, this.node, dt, followInertia);
            this.updateBallisticRotation(velocity, this.node, spinNode, dt);

            if (elapsed >= this.ATTACK_LIFE_TIME) {
                this.unsubscribe(unsubscribe);
                this.dispose();
            }
        });
    }

    private observeCollisions(fireBall: Mesh) {
        const grounds = this.scene.metadata.grounds;
        if (!grounds.length) return;

        this.subscribe(() => {
            if (fireBall.intersectsMesh(grounds[0], true)) {
                if (this.disposeOnCollision) {
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
