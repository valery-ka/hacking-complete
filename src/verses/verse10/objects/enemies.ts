import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

const WALL_SIZE = 1.5;
const GAP = 0.25;
const STEP = WALL_SIZE + GAP;

const GRID_SIZE = 21;
const HALF = (GRID_SIZE - 1) / 2;

const DIVIDERS = [7, 13];

export const enemies: EnemyConfig[] = [
    ...(() => {
        const result: EnemyConfig[] = [];

        for (let z = 0; z < GRID_SIZE; z++) {
            if (z === 0 || z === GRID_SIZE - 1) continue;
            for (let x = 0; x < GRID_SIZE; x++) {
                if (x === 0 || x === GRID_SIZE - 1) continue;
                const isVertical = DIVIDERS.includes(x);
                const isHorizontal = DIVIDERS.includes(z);

                if (!isVertical && !isHorizontal) continue;
                if (isVertical && isHorizontal) continue;

                result.push({
                    trigger: { pool: { self: 0, to_trigger: null } },
                    enemy_type: "box",
                    on_spawn: {
                        position: {
                            x: (x - HALF) * STEP,
                            y: 500.65,
                            z: (z - HALF) * STEP,
                        },
                        rotation_y: Math.PI,
                        hp: 2,
                        spawn_animation: false,
                        box: { w: WALL_SIZE, d: WALL_SIZE, h: WALL_SIZE },
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
    })(),

    // ─────────────────────────────
    // SPHERES
    // ─────────────────────────────
    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -11, y: 500.65, z: 11 },
            rotation_y: Math.PI / 3,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false, angular_speed: 1.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 150,
            cooldown_dynamic: [100, 100, 100, 100, 200, 300, 450, 600, 750],
            directions: generateDirections(2),
            pattern: [
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
            ],
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 500.65, z: 11 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 150,
            cooldown_dynamic: [100, 100, 100, 100, 200, 300, 450, 600, 750],
            spreading: 0.2,
            directions: generateDirections(4),
            pattern: [
                [1, 2, 0],
                [1, 1, 0],
                [1, 3, 0],
                [1, 1, 0],
                [2, 3, 0],
                [1, 1, 0],
                [3, 5, 0],
                [2, 2, 0],
            ],
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 11, y: 500.65, z: 11 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: -1.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 150,
            cooldown_dynamic: [100, 100, 100, 100, 200, 300, 450, 600, 750],
            spreading: 0.001,
            directions: generateDirections(4),
            pattern: [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 0],
            ],
        },
    },

    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -11, y: 500.65, z: 0 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 100,
            cooldown_dynamic: [0, 200, 400, 600, 800, 1000],
            spreading: 0.001,
            directions: [Math.PI / 4, 0, -Math.PI / 4],
            pattern: [
                [2, 1, 0],
                [2, 1, 0],
                [2, 1, 0],
            ],
            switch_shooter: { enabled: true, delay: [300, 1000] },
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 11, y: 500.65, z: 0 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 100,
            cooldown_dynamic: [0, 200, 400, 600, 800, 1000],
            spreading: 0.001,
            directions: [0],
            pattern: [[4, 4, 0]],
            switch_shooter: { enabled: true, delay: [500, 500] },
        },
    },

    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -11, y: 500.65, z: -11 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 500,
            cooldown: 100,
            cooldown_dynamic: [0, 200, 400, 600, 800, 1000],
            spreading: 0.001,
            directions: [0],
            pattern: [[1, 1, 0]],
            switch_shooter: { enabled: true, delay: [500, 250] },
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 500.65, z: -11 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 150,
            cooldown_dynamic: [100, 100, 100, 100, 200, 300, 450, 600, 750],
            spreading: 0.05,
            directions: generateDirections(4),
            pattern: [
                [1, 2, 0],
                [1, 1, 0],
                [1, 3, 0],
                [1, 1, 0],
                [2, 3, 0],
                [1, 1, 0],
                [3, 5, 0],
                [2, 2, 0],
            ],
        },
    },
    {
        trigger: { pool: { self: 10, to_trigger: 100 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 11, y: 500.65, z: -11 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1.0 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 150,
            cooldown_dynamic: [100, 100, 100, 100, 200, 300, 450, 600, 750],
            directions: generateDirections(2),
            pattern: [
                [1, 1, 0],
                [1, 2, 0],
                [1, 3, 0],
                [1, 4, 0],
            ],
        },
    },
    // ─────────────────────────────
    // CORE
    // ─────────────────────────────
    {
        trigger: { pool: { self: 20, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 500.65, z: 0 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        shield: { enabled: true, pool: 100 },
    },
];
