import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

const createBoxLine = ({
    pattern,
    center,
    step = 2.0,
    boxSize = { w: 1.75, h: 1.75, d: 1.75 },
    rotationY = Math.PI,
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    step?: number;
    boxSize?: { w: number; h: number; d: number };
    rotationY?: number;
}): EnemyConfig[] => {
    const result: EnemyConfig[] = [];

    const rows = pattern.length;
    const cols = Math.max(...pattern.map((r) => r.length));

    const offsetX = (cols - 1) * step * 0.5;
    const offsetZ = (rows - 1) * step * 0.5;

    const cos = Math.cos(rotationY);
    const sin = Math.sin(rotationY);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col] !== "*") continue;

            const localX = col * step - offsetX;
            const localZ = row * step - offsetZ;

            const rotatedX = localX * cos - localZ * sin;
            const rotatedZ = localX * sin + localZ * cos;

            result.push({
                trigger: { pool: { self: 5, to_trigger: null } },
                enemy_type: "box",
                on_spawn: {
                    position: {
                        x: center.x + rotatedX,
                        y: center.y,
                        z: center.z + rotatedZ,
                    },
                    rotation_y: rotationY,
                    hp: 2,
                    spawn_animation: false,
                    box: { w: boxSize.w, d: boxSize.d, h: boxSize.h },
                },
                ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
                is_inside_ground: false,
                follow_player: { enabled: false },
                triggers_by_player: [false, false],
                rotate_to_player: { enabled: false },
                auto_rotation: { enabled: false },
                animation: { enabled: false },
                shooter: { enabled: false },
            });
        }
    }

    return result;
};

export const enemies: EnemyConfig[] = [
    ...createBoxLine({
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 10 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 12 },
    }),
    ...createBoxLine({
        pattern: ["** * "],
        center: { x: 0, y: 1.125, z: 14 },
    }),
    ...createBoxLine({
        pattern: [" ****"],
        center: { x: 0, y: 1.125, z: 16 },
    }),
    ...createBoxLine({
        pattern: ["* * *"],
        center: { x: 0, y: 1.125, z: 18 },
    }),

    ...createBoxLine({
        pattern: ["*****"],
        center: { x: 0, y: 1.125, z: 30 },
    }),
    ...createBoxLine({
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 32 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 34 },
    }),
    ...createBoxLine({
        pattern: [" * **"],
        center: { x: 0, y: 1.125, z: 36 },
    }),
    ...createBoxLine({
        pattern: ["*****"],
        center: { x: 0, y: 1.125, z: 38 },
    }),

    {
        trigger: { pool: { self: 5, to_trigger: null } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 24 }, rotation_y: Math.PI, hp: 5 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 500,
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
        aoe: { type: "speed-up-world", radius: 5 },
    },

    {
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 44 }, rotation_y: Math.PI, hp: 5 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 500,
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
        aoe: { type: "speed-up-world", radius: 6 },
    },

    {
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "arrow",
        on_spawn: { position: { x: -3, y: 1, z: 48 }, rotation_y: Math.PI, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 1.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1000,
            cooldown: 1000,
            pattern: [[1, 0, 0]],
            spreading: 0.001,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "arrow",
        on_spawn: { position: { x: 0, y: 1, z: 48 }, rotation_y: Math.PI, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1010,
            cooldown: 1010,
            pattern: [[1, 0, 0]],
            spreading: 0.001,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "arrow",
        on_spawn: { position: { x: 3, y: 1, z: 48 }, rotation_y: Math.PI, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 3.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 3.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1020,
            cooldown: 1020,
            pattern: [[1, 0, 0]],
            spreading: 0.001,
            directions: [0],
        },
    },

    {
        trigger: { pool: { self: 110, to_trigger: 120 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 50 }, rotation_y: Math.PI, hp: 5 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 500,
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
        aoe: { type: "speed-up-world", radius: 7 },
    },
    {
        trigger: { pool: { self: 110, to_trigger: 120 } },
        enemy_type: "cylinder",
        on_spawn: { position: { x: 0, y: 1, z: 58 }, rotation_y: Math.PI, hp: 4 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 750,
            cooldown: 750,
            pattern: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            spreading: 0.001,
            directions: generateDirections(2),
        },
    },
    {
        trigger: { pool: { self: 110, to_trigger: 120 } },
        enemy_type: "cylinder",
        on_spawn: { position: { x: 0, y: 1, z: 66 }, rotation_y: Math.PI, hp: 4 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 2 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 760,
            cooldown: 760,
            pattern: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            spreading: 0.001,
            directions: generateDirections(2),
        },
    },
    {
        trigger: { pool: { self: 110, to_trigger: 120 } },
        enemy_type: "cylinder",
        on_spawn: { position: { x: -4, y: 1, z: 62 }, rotation_y: Math.PI, hp: 4 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 * Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        rocket_launcher: { enabled: true, cooldown: 1500 },
    },
    {
        trigger: { pool: { self: 110, to_trigger: 120 } },
        enemy_type: "cylinder",
        on_spawn: { position: { x: 4, y: 1, z: 62 }, rotation_y: Math.PI, hp: 4 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 * Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        rocket_launcher: { enabled: true, cooldown: 1500 },
    },

    {
        trigger: { pool: { self: 210, to_trigger: 220 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 80 }, rotation_y: Math.PI, hp: 5 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: Math.PI },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 500,
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
        aoe: { type: "speed-up-world", radius: 8 },
    },

    {
        trigger: { pool: { self: 210, to_trigger: 220 } },
        enemy_type: "arrow",
        on_spawn: { position: { x: 3, y: 1, z: 66 }, rotation_y: 0, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1030,
            cooldown: 1030,
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 210, to_trigger: 220 } },
        enemy_type: "arrow",
        on_spawn: { position: { x: 0, y: 1, z: 66 }, rotation_y: 0, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1010,
            cooldown: 1010,
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 210, to_trigger: 220 } },
        enemy_type: "arrow",
        on_spawn: { position: { x: -3, y: 1, z: 66 }, rotation_y: 0, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1020,
            cooldown: 1020,
            pattern: [[1, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
    },

    {
        trigger: { pool: { self: 900, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 97.5 }, rotation_y: Math.PI, hp: 5 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 3.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: true, disabled_on_start: true },
        rage: {
            enabled: true,
            pool: 220,
            initial_delay: 200,
            cooldown: 60,
            spreading: 0.001,
            directions: [0],
            pattern: [[1, 2, 0]],
            switch_shooter: { enabled: true, delay: [400, 400] },
        },
        shield: { enabled: true, pool: 220 },
        change_behavior: { follow_player_pool: 220 },
    },
];
