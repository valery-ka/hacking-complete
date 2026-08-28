import { Mesh, Scene, Vector3, TransformNode } from "@babylonjs/core";

import { COLLISION_RULES } from "./BulletCollisionManager";
import { sanitizeMetadata } from "utils/babylon";

export abstract class Bullet {
    protected scene: Scene;
    protected source: number;
    protected mesh!: Mesh;
    protected node!: TransformNode;

    protected lifetime: number = 2;
    protected age: number = 0;

    public isActive: boolean = true;

    constructor(
        scene: Scene,
        position: Vector3,
        type: "light" | "dark" | "magical" | "physical" | "chlorine" = "light",
        source: number = 0,
        playerId: number,
        enemyName?: string,
    ) {
        this.scene = scene;
        this.source = source;

        this.createNode(position);
        this.createMesh(type);

        this.node.metadata = {
            ...this.node.metadata,
            playerId: playerId,
            enemyName: enemyName,
            reflected: false,
        };
    }

    //
    // Callback start
    public onWallHit() {
        const effect = this.scene.metadata?.effects?.player_bullet_hits_wall;
        if (effect) {
            effect.apply(this.node);
        }
    }

    public onShieldHit() {
        const effect = this.scene.metadata?.effects?.player_bullet_hits_shield;
        if (effect) {
            effect.apply(this.node);
        }
    }

    public onBulletsHit() {
        const effect = this.scene.metadata?.effects?.player_and_enemy_bullets_collide;
        if (effect) {
            effect.apply(this.node);
        }
    }
    // Callback end
    //

    protected createNode(position: Vector3) {
        this.node = new TransformNode("bullet-node", this.scene);
        this.node.position.copyFrom(position);
    }

    protected createMesh(type: string) {
        if (this.mesh) {
            this.clearMetadata();
            this.mesh.dispose();
        }

        const bulletAssets = this.scene.metadata.bullet_assets;

        if (type === "light") {
            this.mesh = bulletAssets.light_bullet.createInstance("player-bullet-mesh-light");
        } else if (type === "dark") {
            this.mesh = bulletAssets.dark_bullet.createInstance("player-bullet-mesh-dark");
        } else if (type === "physical") {
            this.mesh = bulletAssets.physical_bullet.createInstance("enemy-bullet-mesh-physical");
        } else if (type === "magical") {
            this.mesh = bulletAssets.magical_bullet.createInstance("enemy-bullet-mesh-magical");
        } else {
            this.mesh = bulletAssets.chlorine_bullet.createInstance("enemy-bullet-mesh-chlorine");
        }

        this.mesh.parent = this.node;

        this.mesh.metadata = {
            ...this.mesh.metadata,
            callbacks: {
                on_wall_hit: () => this.onWallHit(),
                on_shield_hit: () => this.onShieldHit(),
                on_bullets_hit: () => this.onBulletsHit(),
                reflect: (reflector: Mesh) => this.reflect(reflector),
                dispose: () => this.dispose(),
            },
        };

        this.node.metadata = {
            ...this.node.metadata,
            type: type,
        };
    }

    public abstract update(deltaTime: number): void;

    public abstract reflect(reflector: Mesh): void;

    public checkBulletLifetime(deltaTime: number) {
        this.age += deltaTime;
        if (this.age >= this.lifetime) this.dispose();
    }

    public checkCollision() {
        const managers = [
            this.scene.metadata.collisions.player_bullets,
            this.scene.metadata.collisions.enemy_bullets,
        ];

        const collisionManager = managers[this.source];
        if (!collisionManager) return false;

        const collidableMeshes = collisionManager.getCollidableMeshes();
        const bulletPos = this.node.getAbsolutePosition();

        for (const mesh of collidableMeshes) {
            if (mesh.intersectsPoint(bulletPos)) {
                this.onCollision(mesh);
                return true;
            }
        }

        return false;
    }

    private onCollision(mesh: Mesh) {
        const nameA = this.mesh.name;
        const nameB = mesh.name;

        const rule = COLLISION_RULES.find(
            (r) => (r.a === "*" || nameA.includes(r.a)) && (r.b === "*" || nameB.includes(r.b)),
        );

        if (rule) rule.action(this.mesh, mesh);
    }

    private clearMetadata() {
        if (this.node?.metadata) {
            sanitizeMetadata(this.node.metadata);
        }
        if (this.mesh?.metadata) {
            sanitizeMetadata(this.mesh.metadata);
        }
    }

    public dispose() {
        this.isActive = false;
        this.clearMetadata();
        this.mesh.dispose();
        this.node.dispose();
    }
}
