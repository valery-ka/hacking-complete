import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

const DEFAULT_BOX_SIZE = 1.5;

export function generateEnemiesFromPattern({
    pattern,
    center,
    step = 1.75,
    rotationY = -Math.PI / 2,
    boxSize = { w: DEFAULT_BOX_SIZE, d: DEFAULT_BOX_SIZE, h: DEFAULT_BOX_SIZE },
    hp = 2,
    yPosition = 5.75,
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    step?: number;
    rotationY?: number;
    boxSize?: { w: number; d: number; h: number };
    hp?: number;
    yPosition?: number;
}) {
    const result: any[] = [];

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
                        y: yPosition,
                        z: center.z + rotatedZ,
                    },
                    rotation_y: Math.PI + rotationY,
                    hp: hp,
                    spawn_animation: false,
                    box: boxSize,
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
}

function getRandomCooldown(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const enemies: EnemyConfig[] = [
    ...generateEnemiesFromPattern({
        center: { x: 0, y: 5.75, z: 0 },
        pattern: [
            "****   **   ** *  * *   **  *  ",
            "****   *      *   * *  *  * * *",
            "****                * **  *    ",
            "****  *     **      **  **  *  ",
        ],
    }),

    //
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 5.5, y: 5.75, z: -9.5 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 5, y: 5.75, z: -7.0 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 6, y: 5.75, z: -4.5 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },

    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -5.5, y: 5.75, z: -9.5 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -5, y: 5.75, z: -7.0 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -6, y: 5.75, z: -4.5 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },

    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -2.5, y: 5.75, z: -2 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 2.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 2.5, y: 5.75, z: -2 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 2.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -2.5, y: 5.75, z: -2 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 3.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 2.5, y: 5.75, z: -2 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 3.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -2.5, y: 5.75, z: -2 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 4.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 0, to_trigger: 50 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 2.5, y: 5.75, z: -2 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 4.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },

    //
    {
        trigger: { pool: { self: 50, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 5.5, y: 5.75, z: 14 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 50, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -5.5, y: 5.75, z: 14 },
            rotation_y: Math.PI,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },

    {
        trigger: { pool: { self: 50, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 5.5, y: 5.75, z: 18 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 1.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 50, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -4, y: 5.75, z: 10 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 1.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },

    {
        trigger: { pool: { self: 50, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -5.5, y: 5.75, z: 18 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 2.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },
    {
        trigger: { pool: { self: 50, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 4, y: 5.75, z: 10 },
            rotation_y: Math.PI,
            hp: 2,
            delay: 2.0,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(500, 1000),
            cooldown: getRandomCooldown(750, 1500),
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 0, 0]],
            spreading: 0.2,
            directions: [0],
        },
    },

    // CORE
    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 5.75, z: 17.5 },
            rotation_y: 0,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0.0 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 3.0 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1000,
            cooldown_dynamic: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
            directions: generateDirections(2),
            spreading: 0.5,
            pattern: [
                [1, 1, 0],
                [1, 2, 0],
                [2, 1, 0],
                [2, 2, 0],
            ],
        },
        shield: { enabled: true, pool: 100 },
    },
];
