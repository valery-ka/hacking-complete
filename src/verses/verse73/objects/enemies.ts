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
        pattern: ["*   *"],
        center: { x: 0, y: 1.125, z: 8 },
    }),
    ...createBoxLine({
        pattern: ["**  *"],
        center: { x: 0, y: 1.125, z: 10 },
    }),
    ...createBoxLine({
        pattern: [" *** "],
        center: { x: 0, y: 1.125, z: 12 },
    }),
    ...createBoxLine({
        pattern: [" *** "],
        center: { x: 0, y: 1.125, z: 14 },
    }),
    ...createBoxLine({
        pattern: ["*  **"],
        center: { x: 0, y: 1.125, z: 16 },
    }),
    ...createBoxLine({
        pattern: ["* * *"],
        center: { x: 0, y: 1.125, z: 18 },
    }),

    ...createBoxLine({
        pattern: ["* * *"],
        center: { x: 0, y: 1.125, z: 28 },
    }),
    ...createBoxLine({
        pattern: [" ****"],
        center: { x: 0, y: 1.125, z: 30 },
    }),
    ...createBoxLine({
        pattern: ["*   *"],
        center: { x: 0, y: 1.125, z: 32 },
    }),
    ...createBoxLine({
        pattern: [" ****"],
        center: { x: 0, y: 1.125, z: 34 },
    }),
    ...createBoxLine({
        pattern: ["* * *"],
        center: { x: 0, y: 1.125, z: 36 },
    }),
    ...createBoxLine({
        pattern: [" **  "],
        center: { x: 0, y: 1.125, z: 38 },
    }),

    //
    {
        trigger: { pool: { self: 5, to_trigger: null } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 23 }, rotation_y: Math.PI, hp: 5 },
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
        aoe: { type: "speed-down-player", radius: 5 },
    },

    //
    {
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 34 }, rotation_y: Math.PI, hp: 5 },
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
        aoe: { type: "speed-down-player", radius: 6 },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "arrow-shield",
        on_spawn: { position: { x: -3, y: 1, z: 50 }, rotation_y: Math.PI, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1000,
            cooldown: 1000,
            pattern: [[0, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "arrow-shield",
        on_spawn: { position: { x: 0, y: 1, z: 42 }, rotation_y: Math.PI, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
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
        trigger: { pool: { self: 10, to_trigger: 20 } },
        enemy_type: "arrow-shield",
        on_spawn: { position: { x: 3, y: 1, z: 50 }, rotation_y: Math.PI, hp: 2 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
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

    //
    {
        trigger: { pool: { self: 111, to_trigger: 120 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 65 }, rotation_y: Math.PI, hp: 5 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 1 },
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
        aoe: { type: "speed-down-player", radius: 7 },
        shield: { enabled: true, pool: 121 },
    },

    {
        trigger: { pool: { self: 110, to_trigger: 121 } },
        enemy_type: "cylinder-shield",
        on_spawn: { position: { x: 3, y: 1, z: 74 }, rotation_y: Math.PI, hp: 4 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 2 * 750,
            cooldown: 2 * 750,
            pattern: [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            spreading: 0.001,
            directions: generateDirections(2),
        },
    },
    {
        trigger: { pool: { self: 110, to_trigger: 121 } },
        enemy_type: "cylinder-shield",
        on_spawn: { position: { x: -3, y: 1, z: 74 }, rotation_y: Math.PI, hp: 4 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 2 * 760,
            cooldown: 2 * 760,
            pattern: [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
            spreading: 0.001,
            directions: generateDirections(2),
        },
    },

    //
    {
        trigger: { pool: { self: 210, to_trigger: 220 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 87.5 }, rotation_y: Math.PI, hp: 5 },
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
        aoe: { type: "speed-down-player", radius: 7 },
    },

    {
        trigger: { pool: { self: 220, to_trigger: 665 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 87.5 }, rotation_y: Math.PI, hp: 5, delay: 2.0 },
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
        aoe: { type: "speed-down-player", radius: 10 },
    },

    {
        trigger: { pool: { self: 665, to_trigger: null } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 87.5 }, rotation_y: Math.PI, hp: 5, delay: 2.0 },
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
        aoe: { type: "speed-down-player", radius: 15 },
    },

    //
    {
        trigger: { pool: { self: 900, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 97.5 }, rotation_y: Math.PI, hp: 5 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1.5 },
        animation: { enabled: false },
        shooter: { enabled: true, disabled_on_start: true },
        rage: {
            enabled: true,
            pool: 220,
            initial_delay: 200,
            cooldown: 60,
            spreading: 0.001,
            directions: generateDirections(2),
            pattern: [[1, 1, 0]],
            switch_shooter: { enabled: true },
        },
        shield: { enabled: true, pool: 220 },
        change_behavior: { follow_player_pool: 220 },
    },
];
