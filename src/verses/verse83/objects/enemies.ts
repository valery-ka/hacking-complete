import { EnemyConfig } from "types/enemy/Enemies.types";

const HEIGHT = 0.5;

export const enemies: EnemyConfig[] = [
    {
        trigger: { pool: { self: 0, to_trigger: 1000 } },
        enemy_type: "queen",
        on_spawn: {
            position: { x: 0, y: 1, z: 0 },
            rotation_y: Math.PI,
            hp: 1,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: HEIGHT },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: { enabled: false },
        shield: { enabled: true, pool: 999 },
        aoe: { type: "player-shoot-overheat", radius: 12.5 },
        metadata: { not_damageable_with_chlorine: true },
    },
];
