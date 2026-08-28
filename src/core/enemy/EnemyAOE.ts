import {
    Color3,
    Mesh,
    MeshBuilder,
    Observer,
    Scene,
    ShaderMaterial,
    TransformNode,
    Vector3,
} from "@babylonjs/core";
import { Enemy } from "./Enemy";

import { IAoe } from "types/enemy/Enemies.types";
import { Nullable } from "types/common";

export class EnemyAOE {
    private scene: Scene;
    private enemy: Enemy;
    private aoeConfig?: IAoe;

    private aoeMesh: Nullable<Mesh> = null;
    private beforeRenderObserver: Nullable<Observer<Scene>> = null;

    private isAoeEnabled: boolean = false;

    constructor(scene: Scene, enemy: Enemy) {
        this.scene = scene;
        this.enemy = enemy;
        this.aoeConfig = enemy.config.aoe;

        this.createAOEMesh();
        this.observePlayers();
        this.observeOverheat();
    }

    get aoeType() {
        return this.aoeConfig?.type;
    }

    get aoeRadius() {
        return this.aoeConfig?.radius;
    }

    private getAOEMeshMaterial() {
        switch (this.aoeType) {
            case "steal-fps":
                return createShaderMaterialStealFPS(this.scene);
            case "speed-down-player":
                return createShaderMaterialSpeedDownPlayer(this.scene);
            case "speed-up-world":
                return createShaderMaterialSpeedUpWorld(this.scene);
            case "player-shoot-overheat":
                return createShaderMaterialPlayerShootOverheat(this.scene);
        }
    }

    private createAOEMesh(): void {
        if (!this.aoeType || !this.aoeRadius) return;

        this.aoeMesh = MeshBuilder.CreateDisc(
            `enemy-aoe-${this.aoeType}`,
            {
                radius: this.aoeRadius,
                sideOrientation: Mesh.DOUBLESIDE,
            },
            this.scene,
        );

        this.aoeMesh.position.y = -0.7;
        this.aoeMesh.rotation.x = -Math.PI / 2;

        this.aoeMesh.parent = this.enemy.node;

        const material = this.getAOEMeshMaterial();
        if (material) {
            this.aoeMesh.material = material;
        }
    }

    private isPlayerInRadius(player: TransformNode, radiusSq: number): boolean {
        const aoeCenter = this.enemy.node.getAbsolutePosition();

        const distanceSq = Vector3.DistanceSquared(aoeCenter, player.getAbsolutePosition());

        if (distanceSq <= radiusSq) {
            return true;
        }

        return false;
    }

    private isAnyPlayerInRadius(radiusSq: number): boolean {
        const players = this.scene.metadata.players;
        if (!players.length) return false;

        const aoeCenter = this.enemy.node.getAbsolutePosition();

        for (const player of players) {
            const distanceSq = Vector3.DistanceSquared(aoeCenter, player.getAbsolutePosition());

            if (distanceSq <= radiusSq) {
                return true;
            }
        }

        return false;
    }

    private enableAOE(): void {
        if (this.isAoeEnabled) return;

        const gameClock = this.scene.metadata.gameClock;
        const engine = this.scene.getEngine();

        switch (this.aoeType) {
            case "speed-up-world":
                gameClock.setSpeed();
                break;

            case "speed-down-player":
                gameClock.setPlayerSpeed();
                break;

            case "steal-fps":
                engine.maxFPS = 16;
                break;
        }

        this.isAoeEnabled = true;
    }

    private disableAOE(): void {
        if (!this.isAoeEnabled) return;

        const gameClock = this.scene.metadata.gameClock;
        const engine = this.scene.getEngine();

        switch (this.aoeType) {
            case "speed-up-world":
                gameClock.resetSpeed();
                break;

            case "speed-down-player":
                gameClock.resetPlayerSpeed();
                break;

            case "steal-fps":
                engine.maxFPS = undefined;
                break;
        }

        this.isAoeEnabled = false;
    }

    private enableOverheat(player: TransformNode): void {
        if (this.isAoeEnabled) return;

        player.metadata.aoe_overheat.enabled = true;

        this.isAoeEnabled = true;
    }

    private disableOverheat(player: TransformNode): void {
        if (!this.isAoeEnabled) return;

        player.metadata.aoe_overheat.enabled = false;

        this.isAoeEnabled = false;
    }

    private disposeOverheat(): void {
        if (this.aoeType !== "player-shoot-overheat") return;

        const players = this.scene.metadata.players;

        players.forEach((player: TransformNode) => {
            if (player.metadata?.aoe_overheat) {
                player.metadata.aoe_overheat.enabled = false;
                player.metadata.aoe_overheat.factor = 0;
            }
        });
    }

    private observePlayers(): void {
        if (!this.aoeType || !this.aoeRadius) return;

        if (this.aoeType === "player-shoot-overheat") return;

        const radiusSq = this.aoeRadius * this.aoeRadius;

        this.beforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
            const isAOEActive = this.isAnyPlayerInRadius(radiusSq);

            if (isAOEActive) {
                this.enableAOE();
            } else {
                this.disableAOE();
            }
        });
    }

    private observeOverheat(): void {
        if (!this.aoeType || !this.aoeRadius) return;

        if (this.aoeType !== "player-shoot-overheat") return;

        const radiusSq = this.aoeRadius * this.aoeRadius;
        const players = this.scene.metadata.players;
        const gameClock = this.scene.metadata.gameClock;
        const material = this.aoeMesh?.material as ShaderMaterial;

        this.beforeRenderObserver = this.scene.onBeforeRenderObservable.add(() => {
            players.forEach((player: TransformNode) => {
                const isPlayerInRadius = this.isPlayerInRadius(player, radiusSq);

                if (isPlayerInRadius) {
                    this.enableOverheat(player);
                } else {
                    this.disableOverheat(player);
                }

                if (gameClock.paused || !player.metadata?.aoe_overheat) return;

                const deltaTime = gameClock.getGlobalDeltaTime();
                const cooldownSpeed = 0.75;

                if (player.metadata.aoe_overheat.factor >= 1) {
                    player.metadata.callbacks.on_damage();
                    this.scene.metadata.effects.sphere_bomb_destroy_effect?.apply(player);

                    if (player.metadata?.aoe_overheat) {
                        player.metadata.aoe_overheat.factor = 0;
                        material.setFloat("alpha2", 0);
                    }
                }

                if (player.metadata?.aoe_overheat) {
                    const factor = Math.max(
                        0,
                        player.metadata.aoe_overheat.factor - cooldownSpeed * deltaTime,
                    );
                    player.metadata.aoe_overheat.factor = factor;
                    material.setFloat("alpha2", factor);
                }
            });
        });
    }

    public dispose(): void {
        if (this.beforeRenderObserver) {
            this.scene.onBeforeRenderObservable.remove(this.beforeRenderObserver);
            this.beforeRenderObserver = null;
        }

        this.disableAOE();
        this.disposeOverheat();

        if (this.aoeMesh) {
            this.aoeMesh.material?.dispose();
            this.aoeMesh.dispose();
            this.aoeMesh = null;
        }
    }
}

const createShaderMaterialStealFPS = (scene: Scene): ShaderMaterial => {
    const material = new ShaderMaterial(
        "aoe-steal-fps",
        scene,
        {
            vertex: "defaultEnemy",
            fragment: "coreDestroySquares",
        },
        {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "progress", "smoothFlag", "effectSeed", "color"],
            needAlphaBlending: true,
        },
    );

    material.setInt("smoothFlag", 0);
    material.setFloat("progress", 0.25);
    material.setVector3("color", new Vector3(0.0, 0.0, 0.0));

    return material;
};

const createShaderMaterialSpeedDownPlayer = (scene: Scene): ShaderMaterial => {
    const material = new ShaderMaterial(
        "aoe-speed-down-player",
        scene,
        {
            vertex: "defaultEnemy",
            fragment: "aoeDiscGameClock",
        },
        {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "progress", "color"],
            needAlphaBlending: true,
        },
    );

    material.setColor3("color", new Color3(0.9, 0.87, 0.79));
    return material;
};

const createShaderMaterialSpeedUpWorld = (scene: Scene): ShaderMaterial => {
    const material = new ShaderMaterial(
        "aoe-speed-up-world",
        scene,
        {
            vertex: "defaultEnemy",
            fragment: "aoeDiscGameClock",
        },
        {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "progress", "color"],
            needAlphaBlending: true,
        },
    );

    material.setColor3("color", new Color3(0.24, 0.23, 0.19));
    return material;
};

const createShaderMaterialPlayerShootOverheat = (scene: Scene): ShaderMaterial => {
    const material = new ShaderMaterial(
        "aoe-player-shoot-overheat",
        scene,
        {
            vertex: "defaultEnemy",
            fragment: "aoeDiscOverheat",
        },
        {
            attributes: ["position", "uv"],
            uniforms: ["worldViewProjection", "alpha1", "alpha2"],
            needAlphaBlending: true,
        },
    );

    material.setFloat("alpha1", 1.0);
    material.setFloat("alpha2", 0.0);

    return material;
};
