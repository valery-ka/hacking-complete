import { Scene, TransformNode } from "@babylonjs/core";

import { EnemyConfig } from "types/enemy/Enemies.types";

import { EnemySphere } from "./models/EnemySphere";
import { EnemySphereBomb } from "./models/EnemySphereBomb";
import { EnemyCylinder } from "./models/EnemyCylinder";
import { EnemyCylinderBomb } from "./models/EnemyCylinderBomb";
import { EnemyCylinderShield } from "./models/EnemyCylinderShield";
import { EnemyArrow } from "./models/EnemyArrow";
import { EnemyArrowShield } from "./models/EnemyArrowShield";
import { EnemyArrowShield2 } from "./models/EnemyArrowShield2";
import { EnemyArrowShield3 } from "./models/EnemyArrowShield3";
import { EnemyBox } from "./models/EnemyBox";
import { EnemyRabbit } from "./models/EnemyRabbit";
import { EnemyCheer } from "./models/EnemyCheer";
import { EnemyKamikaze } from "./models/EnemyKamikaze";
import { EnemyRocket } from "./models/EnemyRocket";

export class EnemiesPool {
    private scene: Scene;
    private enemies: EnemySphere[] &
        EnemySphereBomb[] &
        EnemyCylinder[] &
        EnemyCylinderBomb[] &
        EnemyCylinderShield[] &
        EnemyArrow[] &
        EnemyArrowShield[] &
        EnemyArrowShield2[] &
        EnemyArrowShield3[] &
        EnemyBox[] &
        EnemyRabbit[] &
        EnemyCheer[] &
        EnemyKamikaze[] &
        EnemyRocket[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
        this.scene.metadata = {
            ...this.scene.metadata,
            enemies_pool_class: this,
            killing_counter: 0,
        };
    }

    public create(configs: EnemyConfig[], pool?: number) {
        configs.forEach((enemy_config, index) => {
            const { enemy_type } = enemy_config;

            if (enemy_config.trigger.pool.self === pool) {
                if (enemy_type === "sphere") {
                    const enemyInstance = new EnemySphere(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "sphere-bomb") {
                    const enemyInstance = new EnemySphereBomb(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "cylinder") {
                    const enemyInstance = new EnemyCylinder(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "cylinder-bomb") {
                    const enemyInstance = new EnemyCylinderBomb(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "cylinder-shield") {
                    const enemyInstance = new EnemyCylinderShield(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "arrow") {
                    const enemyInstance = new EnemyArrow(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "arrow-shield") {
                    const enemyInstance = new EnemyArrowShield(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "arrow-shield-2") {
                    const enemyInstance = new EnemyArrowShield2(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "arrow-shield-3") {
                    const enemyInstance = new EnemyArrowShield3(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "box") {
                    const enemyInstance = new EnemyBox(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "rabbit") {
                    const enemyInstance = new EnemyRabbit(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "cheer") {
                    const enemyInstance = new EnemyCheer(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "kamikaze") {
                    const enemyInstance = new EnemyKamikaze(this.scene, enemy_config, index);
                    this.enemies.push(enemyInstance);
                } else if (enemy_type === "rocket") {
                    const enemyInstance = new EnemyRocket(this.scene, enemy_config);
                    this.enemies.push(enemyInstance);
                }
            }

            if (enemy_config?.shield?.pool === pool && pool !== undefined) {
                this.destroyShield(pool);
            }

            if (enemy_config?.rage?.pool === pool && pool !== undefined) {
                this.enableRageMode(pool);
            }

            if (enemy_config?.change_behavior?.follow_player_pool === pool && pool !== undefined) {
                this.startFollowingPlayer(pool);
            }

            if (
                enemy_config?.change_behavior?.rotate_to_player_pool === pool &&
                pool !== undefined
            ) {
                this.startRotatingToPlayer(pool);
            }

            if (enemy_config?.change_behavior?.auto_rotation_pool === pool && pool !== undefined) {
                this.startAutoRotation(pool);
            }
        });
    }

    private startFollowingPlayer(pool: number) {
        const enemies = this.scene?.metadata?.enemies;
        if (!enemies) return;

        const enemiesToProcess = enemies.filter(
            (enemy: TransformNode) =>
                enemy &&
                enemy.metadata &&
                pool === enemy.metadata?.change_behavior?.follow_player_pool,
        );

        enemiesToProcess.forEach((enemy: TransformNode) => {
            enemy.metadata?.callbacks?.follow_player();
        });
    }

    private startRotatingToPlayer(pool: number) {
        const enemies = this.scene?.metadata?.enemies;
        if (!enemies) return;

        const enemiesToProcess = enemies.filter(
            (enemy: TransformNode) =>
                enemy &&
                enemy.metadata &&
                pool === enemy.metadata?.change_behavior?.rotate_to_player_pool,
        );

        enemiesToProcess.forEach((enemy: TransformNode) => {
            enemy.metadata?.callbacks?.rotate_to_player();
        });
    }

    private startAutoRotation(pool: number) {
        const enemies = this.scene?.metadata?.enemies;
        if (!enemies) return;

        const enemiesToProcess = enemies.filter(
            (enemy: TransformNode) =>
                enemy &&
                enemy.metadata &&
                pool === enemy.metadata?.change_behavior?.auto_rotation_pool,
        );

        enemiesToProcess.forEach((enemy: TransformNode) => {
            enemy.metadata?.callbacks?.auto_rotation();
        });
    }

    private enableRageMode(pool: number) {
        const enemies = this.scene?.metadata?.enemies;
        if (!enemies) return;

        const enemiesToProcess = enemies.filter(
            (enemy: TransformNode) => enemy && enemy.metadata && pool === enemy.metadata.rage_id,
        );

        enemiesToProcess.forEach((enemy: TransformNode) => {
            enemy.metadata?.callbacks?.enable_rage_mode();
        });
    }

    private destroyShield(pool: number) {
        const enemies = this.scene?.metadata?.enemies;
        if (!enemies) return;

        const enemiesToProcess = enemies.filter(
            (enemy: TransformNode) => enemy && enemy.metadata && pool === enemy.metadata.shield_id,
        );

        enemiesToProcess.forEach((enemy: TransformNode) => {
            const shield = enemy.metadata.shield;
            const core = shield?.parent;

            if (!shield || !core) return;

            const effect = this.scene.metadata?.effects?.core_shield_destroy;
            effect?.apply(core);

            shield.metadata?.animation_unsubscribe?.();
            shield.dispose();

            core.metadata.has_shield = false;
            core.metadata?.callbacks?.update_collider(true);

            enemy.metadata.shield = null;
            enemy.metadata.shield_id = null;
        });
    }

    public dispose() {
        this.enemies.forEach((enemy) => enemy.dispose());
        this.enemies = [];
    }
}
