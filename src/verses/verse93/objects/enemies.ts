import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";

function createCylinderEnemyConfig(
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
        triggers_by_player: [true, true],
        rotate_to_player: { enabled: true },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "circle",
            params: {
                plane: "xz",
                radius: 3,
                speed: 60,
                frames: 180,
            },
        },
        shooter: { enabled: false, initial_delay: 500, cooldown: 1000 },
        rocket_launcher: { enabled: false, cooldown: 1000 },
    };
}

export const enemies: EnemyConfig[] = [
    createCylinderEnemyConfig({ x: 0, y: 5.75, z: 0 }, 0, 0, 1000),
];
