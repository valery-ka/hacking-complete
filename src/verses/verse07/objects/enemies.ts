import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";
function createSphereEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "sphere",
        on_spawn: {
            position,
            rotation_y,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 6 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: true, angular_speed: Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 750,
            directions: generateDirections(3),
            pattern: [
                [1, 1, 0],
                [0, 1, 0],
                [1, 0, 0],
                [2, 1, 0],
                [1, 2, 0],
                [1, 1, 0],
            ],
        },
    };
}

export const enemies: EnemyConfig[] = [
    createSphereEnemyConfig({ x: -1, y: 5.75, z: -1 }, Math.PI, 0, 1000),
];
