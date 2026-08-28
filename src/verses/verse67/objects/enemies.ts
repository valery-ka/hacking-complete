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
    is_inside_ground: boolean,
    delay: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
            delay: delay,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: is_inside_ground,
        follow_player: { enabled: true, speed: 2 },
        triggers_by_player: [!is_inside_ground, is_inside_ground],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1900, 2100),
            cooldown: getRandomCooldown(1900, 2100),
            switch_shooter: { enabled: false },
            pattern: is_inside_ground ? [[0, 1, 0]] : [[1, 0, 0]],
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
    is_inside_ground: boolean,
    delay: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow-shield",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
            delay: delay,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: is_inside_ground,
        follow_player: { enabled: true, speed: 2 },
        triggers_by_player: [!is_inside_ground, is_inside_ground],
        rotate_to_player: { enabled: true, angular_speed: 1 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1900, 2100),
            cooldown: getRandomCooldown(1900, 2100),
            switch_shooter: { enabled: false },
            pattern: is_inside_ground ? [[0, 1, 0]] : [[1, 0, 0]],
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
    is_inside_ground: boolean,
    delay: number,
    rocket_launcher: boolean = false,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "cylinder",
        on_spawn: {
            position,
            rotation_y,
            hp: 4,
            delay: delay,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: is_inside_ground,
        follow_player: { enabled: false },
        triggers_by_player: [!is_inside_ground, is_inside_ground],
        rotate_to_player: { enabled: true, angular_speed: 10.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: !rocket_launcher,
            initial_delay: getRandomCooldown(1900, 2100),
            cooldown: getRandomCooldown(1900, 2100),
            switch_shooter: { enabled: false },
            pattern: is_inside_ground
                ? [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0],
                ]
                : [
                    [1, 0, 0],
                    [1, 0, 0],
                    [1, 0, 0],
                    [1, 0, 0],
                ],
            spreading: 0.001,
            directions: generateDirections(2),
        },
        rocket_launcher: { enabled: rocket_launcher, cooldown: 1000 },
    };
}

export const enemies: EnemyConfig[] = [
    //
    createArrowEnemyConfig(
        { long: Math.PI / 2 - Math.PI / 8 + 0.1, h: 1 },
        Math.PI,
        0,
        1,
        true,
        0.25,
    ),
    createArrowEnemyConfig(
        { long: Math.PI / 2 - Math.PI / 8 - 0.1, h: -1 },
        Math.PI,
        0,
        1,
        false,
        0.5,
    ),
    createArrowEnemyConfig(
        { long: Math.PI / 2 - Math.PI / 8 + 0.2, h: -2 },
        Math.PI,
        0,
        1,
        true,
        0.75,
    ),
    createArrowEnemyConfig(
        { long: Math.PI / 2 - Math.PI / 8 - 0.2, h: 2 },
        Math.PI,
        0,
        1,
        false,
        1.0,
    ),

    createArrowEnemyConfig({ long: Math.PI / 2 - 0.2, h: 4 }, Math.PI, 0, 1, true, 2.0),
    // createArrowEnemyConfig({ long: Math.PI / 2 - 0.2, h: -4 }, Math.PI, 0, 1, true, 2.25),
    // createArrowEnemyConfig({ long: Math.PI / 2 - 0.2, h: 4 }, Math.PI, 0, 1, false, 2.5),
    createArrowEnemyConfig({ long: Math.PI / 2 - 0.2, h: -4 }, Math.PI, 0, 1, false, 2.75),

    // createArrowEnemyConfig({ long: Math.PI / 2 - 0.4, h: 2 }, Math.PI, 0, 1, true, 3.0),
    createArrowEnemyConfig({ long: Math.PI / 2 - 0.4, h: -2 }, Math.PI, 0, 1, true, 3.25),
    createArrowEnemyConfig({ long: Math.PI / 2 - 0.4, h: 2 }, Math.PI, 0, 1, false, 3.5),
    // createArrowEnemyConfig({ long: Math.PI / 2 - 0.4, h: -2 }, Math.PI, 0, 1, false, 3.75),

    //
    createArrowShieldEnemyConfig(
        { long: Math.PI - Math.PI / 8 + 0.1, h: 1 },
        Math.PI,
        11,
        2,
        true,
        2,
    ),
    createArrowShieldEnemyConfig(
        { long: Math.PI - Math.PI / 8 - 0.1, h: -1 },
        Math.PI,
        11,
        2,
        false,
        2,
    ),
    createArrowShieldEnemyConfig(
        { long: Math.PI - Math.PI / 8 + 0.2, h: -2 },
        Math.PI,
        11,
        2,
        true,
        3,
    ),
    createArrowShieldEnemyConfig(
        { long: Math.PI - Math.PI / 8 - 0.2, h: 2 },
        Math.PI,
        11,
        2,
        false,
        3,
    ),

    createArrowShieldEnemyConfig({ long: Math.PI - 0.2, h: 4 }, Math.PI, 11, 2, true, 0.25),
    // createArrowShieldEnemyConfig({ long: Math.PI - 0.2, h: -4 }, Math.PI, 11, 2, true, 0.5),
    // createArrowShieldEnemyConfig({ long: Math.PI - 0.2, h: 4 }, Math.PI, 11, 2, false, 0.75),
    createArrowShieldEnemyConfig({ long: Math.PI - 0.2, h: -4 }, Math.PI, 11, 2, false, 1.0),

    // createArrowShieldEnemyConfig({ long: Math.PI - 0.4, h: 2 }, Math.PI, 11, 2, true, 0.25),
    createArrowShieldEnemyConfig({ long: Math.PI - 0.4, h: -2 }, Math.PI, 11, 2, true, 0.5),
    createArrowShieldEnemyConfig({ long: Math.PI - 0.4, h: 2 }, Math.PI, 11, 2, false, 0.75),
    // createArrowShieldEnemyConfig({ long: Math.PI - 0.4, h: -2 }, Math.PI, 11, 2, false, 1.0),

    //
    createCylinderEnemyConfig(
        { long: Math.PI * (0.5 + 1) - 0.8, h: 3.5 },
        Math.PI,
        21,
        3,
        true,
        0.25,
        true,
    ),
    // createCylinderEnemyConfig(
    //     { long: Math.PI * (0.5 + 1) - 0.8, h: 3.5 },
    //     Math.PI,
    //     21,
    //     3,
    //     false,
    //     0.5,
    //     true,
    // ),
    // createCylinderEnemyConfig(
    //     { long: Math.PI * (0.5 + 1) - 0.8, h: -3.5 },
    //     Math.PI,
    //     21,
    //     3,
    //     true,
    //     0.75,
    //     true,
    // ),
    createCylinderEnemyConfig(
        { long: Math.PI * (0.5 + 1) - 0.8, h: -3.5 },
        Math.PI,
        21,
        3,
        false,
        1.0,
        true,
    ),

    // createCylinderEnemyConfig(
    //     { long: Math.PI * (0.5 + 1) - 0.2, h: 3.5 },
    //     Math.PI,
    //     21,
    //     3,
    //     true,
    //     1.5,
    // ),
    createCylinderEnemyConfig(
        { long: Math.PI * (0.5 + 1) - 0.2, h: 3.5 },
        Math.PI,
        21,
        3,
        false,
        1.5,
    ),
    createCylinderEnemyConfig(
        { long: Math.PI * (0.5 + 1) - 0.2, h: -3.5 },
        Math.PI,
        21,
        3,
        true,
        2.0,
    ),
    // createCylinderEnemyConfig(
    //     { long: Math.PI * (0.5 + 1) - 0.2, h: -3.5 },
    //     Math.PI,
    //     21,
    //     3,
    //     false,
    //     2.0,
    // ),

    //
    createArrowEnemyConfig({ long: 2 * Math.PI - 0.5, h: 2 }, Math.PI, 31, 999, true, 0.25),
    createArrowEnemyConfig({ long: 2 * Math.PI - 0.5, h: 2 }, Math.PI, 31, 999, false, 0.25),

    createArrowShieldEnemyConfig(
        { long: 2 * Math.PI - 0.5, h: -1.75 },
        Math.PI,
        31,
        999,
        true,
        0.5,
    ),
    createArrowShieldEnemyConfig(
        { long: 2 * Math.PI - 0.5, h: -1.75 },
        Math.PI,
        31,
        999,
        false,
        0.5,
    ),

    createCylinderEnemyConfig(
        { long: 2 * Math.PI - 0.5, h: -3.5 },
        Math.PI,
        31,
        999,
        true,
        0.75,
        true,
    ),
    createCylinderEnemyConfig(
        { long: 2 * Math.PI - 0.5, h: -3.5 },
        Math.PI,
        31,
        999,
        false,
        0.75,
        true,
    ),

    createCylinderEnemyConfig({ long: 2 * Math.PI - 0.5, h: 3.5 }, Math.PI, 31, 999, true, 1),
    createCylinderEnemyConfig({ long: 2 * Math.PI - 0.5, h: 3.5 }, Math.PI, 31, 999, false, 1),

    //
    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: 2 * Math.PI - 0.25, h: 0 },
            rotation_y: Math.PI,
            hp: 25,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS, dont_correct_hover: true },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, true],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false, angular_speed: 1.0 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 750,
            cooldown: 75,
            switch_shooter: { enabled: true, delay: [500, 2000] },
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
        rage: {
            enabled: true,
            pool: 999,
            initial_delay: 750,
            cooldown: 521.73913043478260869565217391304,
            directions: [0],
            spreading: 0.0001,
            pattern: [[1, 1, 0]]
        },
        shield: { enabled: true, pool: 999 },
        autoaimable: true,
        scale_hp_by_difficulty: false,
    },
];
