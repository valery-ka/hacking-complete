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
            position,
            rotation_y,
            hp: 2,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 1.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1000, 2000),
            cooldown: getRandomCooldown(2000, 4000),
            switch_shooter: { enabled: false },
            pattern: [[1, 0, 0]],
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
            position,
            rotation_y,
            hp: 3,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1.0 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: 1000,
            switch_shooter: { enabled: false },
            pattern: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            spreading: 0.001,
            directions: generateDirections(2),
        },
    };
}

export const enemies: EnemyConfig[] = [
    createArrowEnemyConfig({ long: 0.5, h: 3 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 0.5, h: 0 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 0.5, h: -3 }, Math.PI, 0, 5),

    createArrowEnemyConfig({ long: 0.75, h: 3 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 0.75, h: 0 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 0.75, h: -3 }, Math.PI, 0, 5),

    createArrowEnemyConfig({ long: 1, h: 3 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 1, h: 0 }, Math.PI, 0, 5),
    createArrowEnemyConfig({ long: 1, h: -3 }, Math.PI, 0, 5),

    createArrowEnemyConfig({ long: -0.5, h: 3 }, 0, 0, 5),
    createArrowEnemyConfig({ long: -0.5, h: 0 }, 0, 0, 5),
    createArrowEnemyConfig({ long: -0.5, h: -3 }, 0, 0, 5),

    createArrowEnemyConfig({ long: -0.75, h: 3 }, 0, 0, 5),
    createArrowEnemyConfig({ long: -0.75, h: 0 }, 0, 0, 5),
    createArrowEnemyConfig({ long: -0.75, h: -3 }, 0, 0, 5),

    createArrowEnemyConfig({ long: -1, h: 3 }, 0, 0, 5),
    createArrowEnemyConfig({ long: -1, h: 0 }, 0, 0, 5),
    createArrowEnemyConfig({ long: -1, h: -3 }, 0, 0, 5),

    createCylinderEnemyConfig({ long: Math.PI / 2, h: 0 }, Math.PI, 0, 5),
    createCylinderEnemyConfig({ long: -Math.PI / 2, h: 0 }, Math.PI, 0, 5),
    createCylinderEnemyConfig({ long: Math.PI, h: 0 }, Math.PI, 1, 2),

    createArrowEnemyConfig({ long: 0.5 + Math.PI, h: 3 }, Math.PI, 2, 5),
    createArrowEnemyConfig({ long: 0.5 + Math.PI, h: 0 }, Math.PI, 2, 5),
    createArrowEnemyConfig({ long: 0.5 + Math.PI, h: -3 }, Math.PI, 2, 5),

    createArrowEnemyConfig({ long: 0.75 + Math.PI, h: 3 }, Math.PI, 2, 5),
    createArrowEnemyConfig({ long: 0.75 + Math.PI, h: 0 }, Math.PI, 2, 5),
    createArrowEnemyConfig({ long: 0.75 + Math.PI, h: -3 }, Math.PI, 2, 5),

    createArrowEnemyConfig({ long: 1 + Math.PI, h: 3 }, Math.PI, 2, 5),
    createArrowEnemyConfig({ long: 1 + Math.PI, h: 0 }, Math.PI, 2, 5),
    createArrowEnemyConfig({ long: 1 + Math.PI, h: -3 }, Math.PI, 2, 5),

    createArrowEnemyConfig({ long: -0.5 + Math.PI, h: 3 }, 0, 2, 5),
    createArrowEnemyConfig({ long: -0.5 + Math.PI, h: 0 }, 0, 2, 5),
    createArrowEnemyConfig({ long: -0.5 + Math.PI, h: -3 }, 0, 2, 5),

    createArrowEnemyConfig({ long: -0.75 + Math.PI, h: 3 }, 0, 2, 5),
    createArrowEnemyConfig({ long: -0.75 + Math.PI, h: 0 }, 0, 2, 5),
    createArrowEnemyConfig({ long: -0.75 + Math.PI, h: -3 }, 0, 2, 5),

    createArrowEnemyConfig({ long: -1 + Math.PI, h: 3 }, 0, 2, 5),
    createArrowEnemyConfig({ long: -1 + Math.PI, h: 0 }, 0, 2, 5),
    createArrowEnemyConfig({ long: -1 + Math.PI, h: -3 }, 0, 2, 5),

    // Core
    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: 0, h: 3 },
            rotation_y: -Math.PI / 2,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "cylinder", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 100,
            cooldown_dynamic: [
                0, 100, 100, 100, 100, 200, 200, 200, 200, 300, 300, 300, 300, 400, 400, 400, 400,
                500, 500, 500, 500, 600, 600, 600, 600, 700, 700, 700, 700, 800, 800, 800, 800, 900,
                900, 900, 900,
            ],
            switch_shooter: { enabled: true, delay: [200, 500] },
            pattern: [[3, 3, 0]],
            spreading: 1.0,
            directions: [0],
        },
        shield: { enabled: true, pool: 5 },
    },
];
