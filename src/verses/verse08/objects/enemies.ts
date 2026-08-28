import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

export const enemies: EnemyConfig[] = [
    {
        trigger: { pool: { self: 0, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 3, y: 5.75, z: 3 },
            rotation_y: Math.PI,
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
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1000,
            directions: generateDirections(3),
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -3, y: 5.75, z: 3 },
            rotation_y: Math.PI,
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
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1000,
            directions: generateDirections(3),
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 5.75, z: 3 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "bob",
            params: {
                axes: {
                    x: {
                        amplitude: 6,
                        speed: 45,
                    },
                    z: {
                        amplitude: 3,
                        speed: 90,
                    },
                },
                frames: 180,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 1000,
            directions: generateDirections(3),
            pattern: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
        },
    },
];
