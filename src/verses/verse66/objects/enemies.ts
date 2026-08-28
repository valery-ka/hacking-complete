import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";

import { generateDirections } from "utils/math";

function getRandomCooldown(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createArrowEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow",
        on_spawn: {
            position: { long: position.long, h: 0 },
            rotation_y,
            hp: 2,
        },
        ground: { id: position.h! < 0 ? 1 : 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true },
        triggers_by_player: [position.h! > 0, position.h! < 0],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1000, 2000),
            cooldown: getRandomCooldown(1000, 2000),
            switch_shooter: { enabled: false },
            pattern: position.h! < 0 ? [[0, 1, 0]] : [[1, 0, 0]],
            spreading: 0.001,
            directions: [0],
        },
    };
}

function createArrowShieldEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow-shield",
        on_spawn: {
            position: { long: position.long, h: 0 },
            rotation_y,
            hp: 2,
        },
        ground: { id: position.h! < 0 ? 1 : 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true },
        triggers_by_player: [position.h! > 0, position.h! < 0],
        rotate_to_player: { enabled: true, angular_speed: 1 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1000, 2000),
            cooldown: getRandomCooldown(1000, 2000),
            switch_shooter: { enabled: false },
            pattern: position.h! < 0 ? [[0, 1, 0]] : [[1, 0, 0]],
            spreading: 0.001,
            directions: [0],
        },
    };
}

function createCylinderEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "cylinder",
        on_spawn: {
            position: { long: position.long, h: 0 },
            rotation_y,
            hp: 3,
        },
        ground: { id: position.h! < 0 ? 1 : 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [position.h! > 0, position.h! < 0],
        rotate_to_player: { enabled: true, angular_speed: 10.0 },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1000, 2000),
            cooldown: 1000,
            switch_shooter: { enabled: false },
            pattern: [
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
            ],
            spreading: 0.001,
            directions: generateDirections(2),
        },
    };
}

export const enemies: EnemyConfig[] = [
    createArrowEnemyConfig({ long: 1.0, h: 0.5 * 3.5 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 1.25, h: 0.5 * 3.5 }, Math.PI, 0, 5),
    createCylinderEnemyConfig({ long: 1.5, h: 0.5 * 3.5 }, Math.PI, 0, 5),

    createArrowEnemyConfig({ long: 1.0, h: 0.5 * -3.5 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 1.25, h: 0.5 * -3.5 }, Math.PI, 0, 5),
    createCylinderEnemyConfig({ long: 1.5, h: 0.5 * -3.5 }, Math.PI, 0, 5),
    //
    //
    //
    createArrowEnemyConfig({ long: 2.5, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 2.7, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 2.9, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 3.1, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 3.3, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 3.5, h: 0.5 * 6 }, Math.PI, 1, 5),
    //
    createArrowEnemyConfig({ long: 2.5, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 2.7, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 2.9, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 3.1, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 3.3, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 3.5, h: 0.5 * -6 }, Math.PI, 1, 5),
    //
    createArrowEnemyConfig({ long: 3.9, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.1, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.3, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.5, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.7, h: 0.5 * 6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.9, h: 0.5 * 6 }, Math.PI, 1, 5),
    //
    createArrowEnemyConfig({ long: 3.9, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.1, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.3, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.5, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.7, h: 0.5 * -6 }, Math.PI, 1, 5),
    createArrowEnemyConfig({ long: 4.9, h: 0.5 * -6 }, Math.PI, 1, 5),
    //
    createArrowShieldEnemyConfig({ long: 5.5, h: 0.5 * 4.5 }, Math.PI, 2, 5),
    createArrowShieldEnemyConfig({ long: 5.5, h: 0.5 * -4.5 }, Math.PI, 2, 5),
    // Core
    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: 2 * Math.PI - 0.3, h: 0 },
            rotation_y: Math.PI,
            hp: 12,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false, angular_speed: 1.0 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 150,
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.001,
            directions: [0],
        },
        rage: {
            enabled: true,
            pool: 5,
            initial_delay: 750,
            cooldown: 571.42857142857142857142857142857,
            directions: [0],
            spreading: 0.0001,
            pattern: [[1, 1, 0]],
        },
        shield: { enabled: true, pool: 5 },
        scale_hp_by_difficulty: false,
    },
    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: 2 * Math.PI - 0.3, h: 0 },
            rotation_y: Math.PI,
            hp: 12,
            spawn_animation: false,
        },
        ground: { id: 1, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, true],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false, angular_speed: 1.0 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 150,
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[0, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
        rage: {
            enabled: true,
            pool: 5,
            initial_delay: 750,
            cooldown: 571.42857142857142857142857142857,
            directions: [0],
            spreading: 0.0001,
            pattern: [[0, 1, 0]]
        },
        shield: { enabled: true, pool: 5 },
        scale_hp_by_difficulty: false,
    },
];
