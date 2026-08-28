import { Scene, Vector3, Quaternion } from "@babylonjs/core";

import { Bullet } from "./Bullet";

export class CylinderBullet extends Bullet {
    private direction: Vector3;

    private tangent: Vector3;
    private radius: number;
    private verticalOffset: number;

    private speed: number;

    constructor(
        scene: Scene,
        position: Vector3,
        direction: Vector3,
        radius: number,
        offset: number,
        type: "light" | "dark" | "physical" | "magical" | "chlorine" = "light",
        source: number,
        playerId: number,
        speed: number = 26,
        enemyName?: string,
    ) {
        super(scene, position, type, source, playerId, enemyName);

        this.direction = direction.normalize();

        this.radius = radius;
        this.verticalOffset = offset;

        this.speed = speed;

        const radial = new Vector3(position.x, 0, position.z).normalize();
        this.tangent = this.direction
            .subtract(radial.scale(Vector3.Dot(this.direction, radial)))
            .normalize();

        this.lifetime = this.source ? this.lifetime * 5 : this.lifetime;
    }

    private updatePosition(deltaTime: number) {
        const move = this.tangent.scale(this.speed * deltaTime);

        this.verticalOffset += move.y;
        const posXZ = new Vector3(this.node.position.x + move.x, 0, this.node.position.z + move.z)
            .normalize()
            .scale(this.radius);
        this.node.position.set(posXZ.x, this.verticalOffset, posXZ.z);
    }

    private updateRotation(deltaTime: number) {
        const move = this.tangent.scale(this.speed * deltaTime);

        const radial = new Vector3(this.node.position.x, 0, this.node.position.z).normalize();
        this.tangent = this.tangent
            .subtract(radial.scale(Vector3.Dot(this.tangent, radial)))
            .normalize();

        const horizontalMove = new Vector3(move.x, 0, move.z);
        let tangent = new Vector3(-radial.z, 0, radial.x);
        if (tangent.dot(horizontalMove) < 0) {
            tangent = tangent.scale(-1);
        }

        const tangentWithY = tangent
            .scale(horizontalMove.length())
            .add(new Vector3(0, move.y, 0))
            .normalize();

        this.node.rotationQuaternion = Quaternion.FromLookDirectionLH(tangentWithY, radial);
    }

    public reflect() {
        console.log("reflection cylinder");
    }

    public update(deltaTime: number) {
        if (!this.isActive) return;
        this.updatePosition(deltaTime);
        this.updateRotation(deltaTime);

        this.checkCollision();
        this.checkBulletLifetime(deltaTime);
    }
}
