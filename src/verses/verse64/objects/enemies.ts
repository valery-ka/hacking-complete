import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

function createArrowEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    delay: number,
    shield: boolean,
    pool: EnemyConfig["trigger"]["pool"],
): EnemyConfig {
    return {
        trigger: { pool: pool },
        enemy_type: shield ? "arrow-shield" : "arrow",
        on_spawn: { position, rotation_y, hp: 2, delay: delay },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: true, angular_speed: shield ? 1 : 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: shield ? 1333 : 333,
            cooldown: 750,
            directions: shield ? [0] : [0],
            spreading: 0.001,
            pattern: !shield
                ? [
                    [0, 1, 0],
                    [0, 1, 0],
                    [0, 1, 0],
                ]
                : [
                    [1, 0, 0],
                    [1, 0, 0],
                    [1, 0, 0],
                ],
        },
        sounds: {
            on_death: { engine: "voice", sound: ["robovoice_1", "robovoice_2", "robovoice_3", "robovoice_4", "robovoice_5", "robovoice_6"] },
        },
    };
}

function createCylinderEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    delay: number,
    shield: boolean,
    pool: EnemyConfig["trigger"]["pool"],
): EnemyConfig {
    return {
        trigger: { pool: pool },
        enemy_type: shield ? "cylinder-shield" : "cylinder",
        on_spawn: { position, rotation_y, hp: 3, delay: delay },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true },
        animation: { enabled: false },
        shooter: {
            enabled: shield ? false : true,
            initial_delay: 1000,
            cooldown: 3000,
            directions: pool.self === 4 ? generateDirections(5) : generateDirections(2),
            pattern:
                pool.self === 4
                    ? [
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                        [0, 0, 1],
                    ]
                    : [
                        [1, 0, 0],
                        [1, 0, 0],
                        [1, 0, 0],
                        [1, 0, 0],
                    ],
            spreading: 0.001,
        },
        rocket_launcher: { enabled: shield ? true : false, cooldown: 3000 },
        sounds: {
            on_death: { engine: "voice", sound: ["robovoice_1", "robovoice_2", "robovoice_3", "robovoice_4", "robovoice_5", "robovoice_6"] },
        },
    };
}

export const enemies: EnemyConfig[] = [
    createArrowEnemyConfig({ x: -9, y: 1.25, z: 8 }, Math.PI, 4, false, {
        self: 0,
        to_trigger: 1,
    }),
    createArrowEnemyConfig({ x: -6, y: 1.25, z: 7 }, Math.PI, 3, false, {
        self: 0,
        to_trigger: 1,
    }),
    createArrowEnemyConfig({ x: -3, y: 1.25, z: 6 }, Math.PI, 2, false, {
        self: 0,
        to_trigger: 1,
    }),
    createArrowEnemyConfig({ x: 0, y: 1.25, z: 5 }, Math.PI, 1, false, {
        self: 0,
        to_trigger: 1,
    }),
    createArrowEnemyConfig({ x: 3, y: 1.25, z: 6 }, Math.PI, 2, false, {
        self: 0,
        to_trigger: 1,
    }),
    createArrowEnemyConfig({ x: 6, y: 1.25, z: 7 }, Math.PI, 3, false, {
        self: 0,
        to_trigger: 1,
    }),
    createArrowEnemyConfig({ x: 9, y: 1.25, z: 8 }, Math.PI, 4, false, {
        self: 0,
        to_trigger: 1,
    }),

    createArrowEnemyConfig({ x: -9, y: 1.25, z: 13 }, Math.PI, 3, true, {
        self: 1,
        to_trigger: 2,
    }),
    createArrowEnemyConfig({ x: -6, y: 1.25, z: 12 }, Math.PI, 2, true, {
        self: 1,
        to_trigger: 2,
    }),
    createArrowEnemyConfig({ x: -3, y: 1.25, z: 11 }, Math.PI, 1, true, {
        self: 1,
        to_trigger: 2,
    }),
    createArrowEnemyConfig({ x: 0, y: 1.25, z: 10 }, Math.PI, 0, true, {
        self: 1,
        to_trigger: 2,
    }),
    createArrowEnemyConfig({ x: 3, y: 1.25, z: 11 }, Math.PI, 1, true, {
        self: 1,
        to_trigger: 2,
    }),
    createArrowEnemyConfig({ x: 6, y: 1.25, z: 12 }, Math.PI, 2, true, {
        self: 1,
        to_trigger: 2,
    }),
    createArrowEnemyConfig({ x: 9, y: 1.25, z: 13 }, Math.PI, 3, true, {
        self: 1,
        to_trigger: 2,
    }),

    createCylinderEnemyConfig({ x: 2, y: 1.25, z: 10 }, Math.PI, 0, false, {
        self: 2,
        to_trigger: 3,
    }),
    createCylinderEnemyConfig({ x: -3, y: 1.25, z: 3 }, Math.PI, 1, false, {
        self: 2,
        to_trigger: 3,
    }),
    createCylinderEnemyConfig({ x: 6, y: 1.25, z: 14 }, Math.PI, 2, false, {
        self: 2,
        to_trigger: 3,
    }),
    createCylinderEnemyConfig({ x: -1, y: 1.25, z: 10 }, Math.PI, 3, false, {
        self: 2,
        to_trigger: 3,
    }),
    createCylinderEnemyConfig({ x: -7, y: 1.25, z: 6 }, Math.PI, 4, false, {
        self: 2,
        to_trigger: 3,
    }),

    createCylinderEnemyConfig({ x: -2, y: 1.25, z: -10 }, Math.PI, 0, true, {
        self: 3,
        to_trigger: 4,
    }),
    createCylinderEnemyConfig({ x: 3, y: 1.25, z: -3 }, Math.PI, 1, true, {
        self: 3,
        to_trigger: 4,
    }),
    createCylinderEnemyConfig({ x: -6, y: 1.25, z: -14 }, Math.PI, 2, true, {
        self: 3,
        to_trigger: 4,
    }),
    createCylinderEnemyConfig({ x: 1, y: 1.25, z: -10 }, Math.PI, 3, true, {
        self: 3,
        to_trigger: 4,
    }),
    createCylinderEnemyConfig({ x: 7, y: 1.25, z: -6 }, Math.PI, 4, true, {
        self: 3,
        to_trigger: 4,
    }),

    createCylinderEnemyConfig({ x: 2, y: 1.25, z: 10 }, Math.PI, 0, false, {
        self: 4,
        to_trigger: 5,
    }),
    createCylinderEnemyConfig({ x: 3, y: 1.25, z: -3 }, Math.PI, 1, false, {
        self: 4,
        to_trigger: 5,
    }),
    createCylinderEnemyConfig({ x: 6, y: 1.25, z: 14 }, Math.PI, 2, false, {
        self: 4,
        to_trigger: 5,
    }),
    createCylinderEnemyConfig({ x: 1, y: 1.25, z: -10 }, Math.PI, 3, false, {
        self: 4,
        to_trigger: 5,
    }),
    createCylinderEnemyConfig({ x: -7, y: 1.25, z: 6 }, Math.PI, 4, false, {
        self: 4,
        to_trigger: 5,
    }),

    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "shadowlord",
        on_spawn: {
            position: { x: 0, y: 1.25, z: 17 },
            rotation_y: Math.PI,
            hp: 15,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shield: { enabled: true, pool: 999 },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 750,
            directions: [0, Math.PI / 2, -Math.PI / 2, Math.PI / 4, -Math.PI / 4],
            spreading: 0.001,
            pattern: [
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
            ],
        },
    },
];
