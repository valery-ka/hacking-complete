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
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: {
            enabled: true,
            name: "circle",
            params: {
                plane: "xz",
                radius: 4,
                speed: 70,
                frames: 180,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 750,
            directions: generateDirections(2),
            pattern: [
                [0, 1, 0],
                [0, 1, 0],
                [1, 0, 0],
                [1, 0, 0],
            ],
        },
    };
}

export const enemies: EnemyConfig[] = [
    createSphereEnemyConfig({ x: 0, y: 5.75, z: -1 }, Math.PI, 0, 1000),
];
