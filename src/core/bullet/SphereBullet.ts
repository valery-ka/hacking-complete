import { Scene, Vector3, Quaternion } from "@babylonjs/core";

import { Bullet } from "./Bullet";

export class SphereBullet extends Bullet {
    private tangent: Vector3;
    private sphereRadius: number;
    private spherePos: Vector3;
    private speed: number = 14;

    constructor(
        scene: Scene,
        position: Vector3,
        direction: Vector3,
        sphereRadius: number,
        spherePos: Vector3,
        type: "light" | "dark" | "physical" | "magical" | "chlorine" = "light",
        source: number,
        playerId: number,
        enemyName?: string,
        speed: number = 14,
    ) {
        super(scene, position, type, source, playerId, enemyName);

        this.sphereRadius = sphereRadius;
        this.spherePos = spherePos;

        const up = position.subtract(spherePos).normalize();
        const posOnSphere = up.scale(sphereRadius);

        this.tangent = direction.subtract(up.scale(Vector3.Dot(direction, up))).normalize();

        this.lifetime = this.source ? this.lifetime * 2.2 : this.lifetime;

        this.speed = speed;

        this.node.position.copyFrom(spherePos.add(posOnSphere));
    }

    private updatePosition(deltaTime: number) {
        const move = this.tangent.scale(this.speed * deltaTime);
        const relativePos = this.node.position.subtract(this.spherePos);
        const newRelativePos = relativePos.add(move).normalize().scale(this.sphereRadius);

        this.node.position.copyFrom(this.spherePos.add(newRelativePos));
    }

    private updateRotation() {
        const relativePos = this.node.position.subtract(this.spherePos);
        const up = relativePos.clone().normalize();
        this.tangent = this.tangent.subtract(up.scale(Vector3.Dot(this.tangent, up))).normalize();

        this.node.rotationQuaternion = Quaternion.FromLookDirectionLH(this.tangent, up);
    }

    public reflect() {
        console.log("reflection sphere");
    }

    public update(deltaTime: number) {
        if (!this.isActive) return;
        this.updatePosition(deltaTime);
        this.updateRotation();

        this.checkCollision();
        this.checkBulletLifetime(deltaTime);
    }
}
