import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";

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
        rotate_to_player: { enabled: true, angular_speed: Math.PI },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "bob",
            params: {
                axes: {
                    x: {
                        amplitude: 6,
                        speed: 60,
                    },
                },
                frames: 180,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 750,
            directions: [0],
            pattern: [[1, 1, 0]],
        },
    };
}

export const enemies: EnemyConfig[] = [
    createSphereEnemyConfig({ x: 0, y: 5.75, z: 3 }, Math.PI, 0, 1000),
];
