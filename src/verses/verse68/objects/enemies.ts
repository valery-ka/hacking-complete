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
    groundId: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
        },
        ground: { id: groundId, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [groundId === 0, groundId !== 0],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1900, 2100),
            cooldown: getRandomCooldown(1900, 2100),
            switch_shooter: { enabled: false },
            pattern: groundId === 0 ? [[1, 0, 0]] : [[0, 1, 0]],
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
    groundId: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow-shield",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
        },
        ground: { id: groundId, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [groundId === 0, groundId !== 0],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1900, 2100),
            cooldown: getRandomCooldown(1900, 2100),
            switch_shooter: { enabled: false },
            pattern: groundId === 0 ? [[1, 0, 0]] : [[0, 1, 0]],
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
    groundId: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "cylinder",
        on_spawn: {
            position,
            rotation_y,
            hp: 4,
        },
        ground: { id: groundId, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [groundId === 0, groundId !== 0],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1900, 2100),
            cooldown: getRandomCooldown(1900, 2100),
            spreading: 0.001,
            pattern: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            directions: generateDirections(2),
        },
    };
}

const GROUND_1_OFFSET = 0.3;

export const enemies: EnemyConfig[] = [
    // 1st player
    createArrowEnemyConfig({ long: Math.PI / 2 - GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 0),
    createArrowEnemyConfig({ long: Math.PI / 2 + GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 0),
    createArrowEnemyConfig({ long: Math.PI / 2, lat: -GROUND_1_OFFSET }, 0, 0, 999, 0),
    createArrowEnemyConfig({ long: Math.PI / 2, lat: GROUND_1_OFFSET }, 0, 0, 999, 0),

    createArrowShieldEnemyConfig({ long: -Math.PI / 2 - GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 0),
    createArrowShieldEnemyConfig({ long: -Math.PI / 2 + GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 0),
    createArrowShieldEnemyConfig({ long: -Math.PI / 2, lat: 0 }, 0, 0, 999, 0),
    createArrowShieldEnemyConfig({ long: -Math.PI / 2, lat: -GROUND_1_OFFSET }, 0, 0, 999, 0),
    createArrowShieldEnemyConfig({ long: -Math.PI / 2, lat: GROUND_1_OFFSET }, 0, 0, 999, 0),

    createArrowShieldEnemyConfig({ long: 0, lat: Math.PI }, 0, 0, 999, 0),

    {
        trigger: { pool: { self: 1, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: 0, lat: -Math.PI / 2 },
            rotation_y: 0,
            hp: 12,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true },
        auto_rotation: { enabled: true, angular_speed: Math.PI },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1000,
            cooldown: 1000,
            switch_shooter: { enabled: false },
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
        rage: {
            enabled: true,
            pool: 999,
            initial_delay: 0,
            cooldown: 571.42857142857142857142857142857,
            pattern: [
                [0, 1, 0],
                [1, 0, 0],
                [0, 1, 0],
                [1, 0, 0],
                [0, 1, 0],
                [1, 0, 0],
            ],
            spreading: 0.001,
            directions: [0],
        },
        shield: { enabled: true, pool: 999 },
        change_behavior: { follow_player_pool: 999 },
        scale_hp_by_difficulty: false,
    },

    // 2nd player
    createArrowEnemyConfig({ long: Math.PI / 2 - GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 1),
    createArrowEnemyConfig({ long: Math.PI / 2 + GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 1),
    createArrowEnemyConfig({ long: Math.PI / 2, lat: -GROUND_1_OFFSET }, 0, 0, 999, 1),
    createArrowEnemyConfig({ long: Math.PI / 2, lat: GROUND_1_OFFSET }, 0, 0, 999, 1),

    createArrowShieldEnemyConfig({ long: -Math.PI / 2 - GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 1),
    createArrowShieldEnemyConfig({ long: -Math.PI / 2 + GROUND_1_OFFSET, lat: 0 }, 0, 0, 999, 1),
    createCylinderEnemyConfig({ long: -Math.PI / 2, lat: 0 }, 0, 0, 999, 1),
    createArrowShieldEnemyConfig({ long: -Math.PI / 2, lat: -GROUND_1_OFFSET }, 0, 0, 999, 1),
    createArrowShieldEnemyConfig({ long: -Math.PI / 2, lat: GROUND_1_OFFSET }, 0, 0, 999, 1),

    createCylinderEnemyConfig({ long: 0, lat: Math.PI }, 0, 0, 999, 1),

    {
        trigger: { pool: { self: 1, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: 0, lat: -Math.PI / 2 },
            rotation_y: 0,
            hp: 12,
            spawn_animation: false,
        },
        ground: { id: 1, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [false, true],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: false,
        },
        rage: {
            enabled: true,
            pool: 999,
            initial_delay: 0,
            cooldown: 571.42857142857142857142857142857,
            pattern: [
                [1, 0, 0],
                [0, 1, 0],
                [1, 0, 0],
                [0, 1, 0],
                [1, 0, 0],
                [0, 1, 0],
            ],
            spreading: 0.001,
            directions: [0],
        },
        shield: { enabled: true, pool: 999 },
        scale_hp_by_difficulty: false,
    },
];
