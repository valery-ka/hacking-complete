import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

function createSphereEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    delay: number,
    rotate_to_player: boolean = true,
    cooldown: number = 750,
    pattern: [[number, number, number]] = [[1, 1, 0]],
): EnemyConfig {
    return {
        trigger: { pool: { self: 0, to_trigger: null } },
        enemy_type: "sphere",
        on_spawn: {
            position,
            rotation_y,
            hp: 3,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: rotate_to_player, angular_speed: Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: delay * 1000,
            cooldown: cooldown,
            directions: [0],
            pattern: pattern,
            spreading: 0.2,
        },
        sounds: {
            on_death: { engine: "voice", sound: ["robovoice_1", "robovoice_2", "robovoice_3", "robovoice_4", "robovoice_5", "robovoice_6"] },
        },
    };
}

export const enemies: EnemyConfig[] = [
    createSphereEnemyConfig({ x: -10, y: 5, z: 5 }, Math.PI / 2, 2),
    createSphereEnemyConfig({ x: -10, y: 5, z: 15 }, Math.PI / 2, 4),
    createSphereEnemyConfig({ x: -10, y: 5, z: 25 }, Math.PI / 2, 6),

    createSphereEnemyConfig({ x: -5, y: 5, z: 30 }, Math.PI / 2, 8),
    createSphereEnemyConfig({ x: 5, y: 5, z: 30 }, Math.PI / 2, 10),

    createSphereEnemyConfig({ x: 15, y: 5, z: 10 }, 0, 1, false),
    createSphereEnemyConfig({ x: 25, y: 5, z: 10 }, 0, 1, false),

    createSphereEnemyConfig({ x: 30, y: 5, z: 30 }, -Math.PI / 2, 20, false, 123, [[0, 1, 0]]),
    createSphereEnemyConfig({ x: 30, y: 5, z: 40 }, -Math.PI / 2, 21, false, 123, [[0, 1, 0]]),
    createSphereEnemyConfig({ x: 30, y: 5, z: 50 }, -Math.PI / 2, 22, false, 123, [[0, 1, 0]]),

    createSphereEnemyConfig({ x: 10, y: 5, z: 32.5 }, Math.PI / 2, 20, false, 123, [[0, 1, 0]]),
    createSphereEnemyConfig({ x: 10, y: 5, z: 40 }, Math.PI / 2, 21, false, 123, [[0, 1, 0]]),
    createSphereEnemyConfig({ x: 10, y: 5, z: 47.5 }, Math.PI / 2, 22, false, 123, [[0, 1, 0]]),

    createSphereEnemyConfig({ x: 15, y: 5, z: 70 }, Math.PI, 30, false),
    createSphereEnemyConfig({ x: 25, y: 5, z: 70 }, Math.PI, 30, false),

    createSphereEnemyConfig({ x: 5, y: 5, z: 50 }, Math.PI / 2, 36),
    createSphereEnemyConfig({ x: -5, y: 5, z: 50 }, Math.PI / 2, 38),

    createSphereEnemyConfig({ x: -10, y: 5, z: 55 }, Math.PI / 2, 44.5),
    createSphereEnemyConfig({ x: -10, y: 5, z: 65 }, Math.PI / 2, 45),
    createSphereEnemyConfig({ x: -10, y: 5, z: 75 }, Math.PI / 2, 45.5),

    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 5.75, z: 90 },
            rotation_y: 0,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        shield: { enabled: true, pool: 999 },
    },
];
