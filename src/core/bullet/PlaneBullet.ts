import { Scene, Vector3, Quaternion, TransformNode, Mesh } from "@babylonjs/core";

import { Bullet } from "./Bullet";

export class PlaneBullet extends Bullet {
    private direction: Vector3;
    private speed: number;

    private readonly MAX_FOLLOW_SPEED = 12.5;
    private readonly FOLLOW_INERTIA = 1.0;
    private readonly FOLLOW_ACCELERATION = 12.5;

    private followPlayer: boolean;

    constructor(
        scene: Scene,
        position: Vector3,
        direction: Vector3,
        type: "light" | "dark" | "magical" | "physical" | "chlorine" = "light",
        speed: number = 25,
        source: number,
        playerId: number,
        enemyName?: string,
        followPlayer: boolean = false,
    ) {
        super(scene, position, type, source, playerId, enemyName);

        this.speed = speed;

        if (enemyName === "enemy-node-5-zero") {
            this.speed = 12.0;
        }

        this.direction = direction.normalize();

        this.lifetime = this.source ? this.lifetime * 2 : this.lifetime;
        this.followPlayer = followPlayer;
    }

    private getPlayerToFollow(): TransformNode | null {
        const players = this.scene.metadata.players;
        if (!players.length) return null;

        return players[0];
    }

    private updateFollowDirection(deltaTime: number) {
        if (!this.followPlayer) return;

        const player = this.getPlayerToFollow();

        if (!player) return;

        const desiredDirection = player
            .getAbsolutePosition()
            .subtract(this.node.position)
            .normalize();

        this.direction.addInPlace(
            desiredDirection.subtract(this.direction).scale(this.FOLLOW_INERTIA * deltaTime),
        );
        this.direction.normalize();

        this.speed = Math.min(
            this.speed + this.FOLLOW_ACCELERATION * deltaTime,
            this.MAX_FOLLOW_SPEED,
        );
    }

    private updatePosition(deltaTime: number) {
        this.node.position.addInPlace(this.direction.scale(this.speed * deltaTime));
    }

    private updateRotation() {
        const from = Vector3.Forward();
        const to = this.direction;
        const quat = new Quaternion();
        Quaternion.FromUnitVectorsToRef(from, to, quat);
        this.node.rotationQuaternion = quat;
    }

    public reflect(reflector: Mesh) {
        if (this.node.metadata.reflected) return;

        this.createMesh("dark");

        this.node.metadata.reflected = true;

        const bulletPosition = this.node.getAbsolutePosition();
        const reflectorPosition = reflector.getAbsolutePosition();

        const normal = bulletPosition.subtract(reflectorPosition);
        normal.y = 0;
        normal.normalize();

        this.direction = Vector3.Reflect(this.direction, normal).normalize();

        this.scene.metadata?.effects.player_bullet_hits_shield?.apply(reflector);
        this.scene.metadata.audio_engine
            ?.getEnemyAudio()
            .playSound("enemy_shield_hit", 1.0, reflector);
    }

    public update(deltaTime: number) {
        if (!this.isActive) return;

        this.updateFollowDirection(deltaTime);
        this.updatePosition(deltaTime);
        this.updateRotation();

        this.checkCollision();

        this.checkBulletLifetime(deltaTime);
    }
}
