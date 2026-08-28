import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

const createCircleEnemiesArrow = (
    position: { x: number; y: number; z: number },
    pool: { self: number; to_trigger: number },
    delay: number = 1,
    count: number = 5,
    totalFrames: number = 200,
    radius: number = 4,
): EnemyConfig[] => {
    const step = totalFrames / count;
    const fromValues = Array.from({ length: count }, (_, i) => Math.floor(i * step));

    return fromValues.map((from, i) => ({
        trigger: { pool: pool },
        enemy_type: "arrow",
        on_spawn: { position, rotation_y: Math.PI / 2, hp: 2, delay: delay },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "circle",
            params: {
                plane: "xz",
                radius: radius,
                speed: 40,
                frames: totalFrames,
                from,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: 1000 + i * 33,
            cooldown: 1000 + i * 33,
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 1, 1]],
            spreading: 1,
            directions: [0],
        },
    }));
};

const createCircleEnemiesArrowShield = (
    position: { x: number; y: number; z: number },
    pool: { self: number; to_trigger: number },
    delay: number = 1,
    count: number = 5,
    totalFrames: number = 200,
    radius: number = 4,
): EnemyConfig[] => {
    const step = totalFrames / count;
    const fromValues = Array.from({ length: count }, (_, i) => Math.floor(i * step));

    return fromValues.map((from, i) => ({
        trigger: { pool: pool },
        enemy_type: "arrow-shield",
        on_spawn: { position, rotation_y: Math.PI / 2, hp: 2, delay: delay },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "circle",
            params: {
                plane: "xz",
                radius: radius,
                speed: 40,
                frames: totalFrames,
                from,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: 1000 + i * 33,
            cooldown: 1000 + i * 33,
            switch_shooter: { enabled: false, delay: [500, 100] },
            pattern: [[1, 1, 1]],
            spreading: 1,
            directions: [0],
        },
    }));
};

const createCircleEnemiesCylinder = (
    position: { x: number; y: number; z: number },
    pool: { self: number; to_trigger: number },
    delay: number = 1,
    count: number = 5,
    totalFrames: number = 200,
    radius: number = 4,
): EnemyConfig[] => {
    const step = totalFrames / count;
    const fromValues = Array.from({ length: count }, (_, i) => Math.floor(i * step));

    return fromValues.map((from, i) => ({
        trigger: { pool: pool },
        enemy_type: "cylinder",
        on_spawn: { position, rotation_y: Math.PI / 2, hp: 4, delay: delay },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "circle",
            params: {
                plane: "xz",
                radius: radius,
                speed: 40,
                frames: totalFrames,
                from,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: 100 + i * 33,
            cooldown: 100 + i * 33,
            switch_shooter: { enabled: true, delay: [250, 750] },
            pattern: [
                [1, 1, 1],
                [1, 1, 1],
            ],
            spreading: 1.0,
            directions: [0, Math.PI],
        },
    }));
};

const createCircleEnemiesCylinderShield = (
    position: { x: number; y: number; z: number },
    pool: { self: number; to_trigger: number },
    delay: number = 1,
    count: number = 5,
    totalFrames: number = 200,
    radius: number = 4,
): EnemyConfig[] => {
    const step = totalFrames / count;
    const fromValues = Array.from({ length: count }, (_, i) => Math.floor(i * step));

    return fromValues.map((from, i) => ({
        trigger: { pool: pool },
        enemy_type: "cylinder-shield",
        on_spawn: { position, rotation_y: Math.PI / 2, hp: 4, delay: delay },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "circle",
            params: {
                plane: "xz",
                radius: radius,
                speed: 40,
                frames: totalFrames,
                from,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: 100 + i * 33,
            cooldown: 100 + i * 33,
            switch_shooter: { enabled: true, delay: [250, 750] },
            pattern: [
                [1, 1, 1],
                [1, 1, 1],
            ],
            spreading: 1.0,
            directions: [0, Math.PI],
        },
    }));
};

const pattern1: [number, number, number][] = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
];

const pattern2: [number, number, number][] = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
];

const createArrowShieldTroop = (
    center: { x: number; y: number; z: number },
    pool: { self: number; to_trigger: number },
    options?: {
        step?: number;
        rotation_y?: number;
    },
    pattern: [number, number, number][] = pattern1,
): EnemyConfig[] => {
    const { step = 2, rotation_y = 0 } = options || {};

    const basePositions = [
        { x: 0, z: 0 },
        { x: -step, z: 0 },
        { x: -step * 2, z: 0 },
        { x: step, z: 0 },
        { x: step * 2, z: 0 },
        { x: -step, z: step },
        { x: 0, z: step * 2 },
        { x: -step, z: -step },
        { x: 0, z: -step * 2 },
    ];

    const rotatedPositions = basePositions.map((pos) => {
        const cos = Math.cos(rotation_y + Math.PI / 2);
        const sin = Math.sin(rotation_y + Math.PI / 2);
        return {
            x: pos.x * cos - pos.z * sin,
            z: pos.x * sin + pos.z * cos,
        };
    });

    return rotatedPositions.map((pos, i) => ({
        trigger: { pool: pool },
        enemy_type: "arrow-shield",
        on_spawn: {
            position: { x: center.x + pos.x, y: center.y, z: center.z + pos.z },
            rotation_y: rotation_y,
            hp: 2,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false, angular_speed: 1 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 2000 + i * 33,
            cooldown: 2000 + i * 33,
            pattern: pattern,
            spreading: 1,
            directions: generateDirections(2),
        },
        change_behavior: { rotate_to_player_pool: 12 },
    }));
};

export const enemies: EnemyConfig[] = [
    ...createCircleEnemiesArrow({ x: 0, y: 5.65, z: 15 }, { self: 1, to_trigger: 30 }, 0),
    ...createCircleEnemiesArrow({ x: 10, y: 5.65, z: 25 }, { self: 1, to_trigger: 30 }, 3),
    ...createCircleEnemiesArrow({ x: -10, y: 5.65, z: 25 }, { self: 1, to_trigger: 30 }, 6),
    ...createCircleEnemiesArrow({ x: 10, y: 5.65, z: 7 }, { self: 1, to_trigger: 30 }, 9),
    ...createCircleEnemiesArrow({ x: -10, y: 5.65, z: 7 }, { self: 1, to_trigger: 30 }, 12),

    ...createArrowShieldTroop(
        { x: 18, y: 5.65, z: 42.25 },
        { self: 11, to_trigger: 40 },
        { step: 2, rotation_y: -Math.PI / 2 },
    ),

    ...createCircleEnemiesArrow(
        { x: -31.73, y: 5.65, z: 39.32 },
        { self: 42, to_trigger: 41 },
        0,
        10,
        400,
        6,
    ),

    ...createArrowShieldTroop(
        { x: -18, y: 5.65, z: 42.25 },
        { self: 11, to_trigger: 40 },
        { step: 2, rotation_y: Math.PI / 2 },
    ),

    ...createCircleEnemiesArrowShield(
        { x: 37.64, y: 5.75, z: 38.33 },
        { self: 21, to_trigger: 22 },
        0,
        10,
        400,
        6,
    ),

    ...createArrowShieldTroop(
        { x: 35, y: 5.65, z: -10.36 },
        { self: 61, to_trigger: 60 },
        { step: 2, rotation_y: -Math.PI / 2 },
        pattern2,
    ),

    ...createArrowShieldTroop(
        { x: -35, y: 5.65, z: -10.36 },
        { self: 61, to_trigger: 60 },
        { step: 2, rotation_y: Math.PI / 2 },
        pattern2,
    ),

    ...createCircleEnemiesCylinder(
        { x: -30.33, y: 5.75, z: 16.15 },
        { self: 71, to_trigger: 72 },
        0,
        10,
        200,
        6,
    ),

    //
    ...createCircleEnemiesArrow(
        { x: -12.16 - 15, y: 5.65, z: -33.57 - 10 },
        { self: 80, to_trigger: 81 },
        0,
    ),
    ...createCircleEnemiesArrowShield(
        { x: -12.16 + 15, y: 5.65, z: -33.57 - 10 },
        { self: 80, to_trigger: 81 },
        2.5,
    ),
    ...createCircleEnemiesCylinder(
        { x: -12.16 - 15, y: 5.65, z: -33.57 + 10 },
        { self: 80, to_trigger: 81 },
        5,
    ),
    ...createCircleEnemiesCylinderShield(
        { x: -12.16 + 15, y: 5.65, z: -33.57 + 10 },
        { self: 80, to_trigger: 81 },
        7.5,
    ),

    // cores
    {
        trigger: { pool: { self: 105, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 5.65, z: 15 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false, angular_speed: 2.0 },
        animation: { enabled: false },
        shooter: { enabled: false },
        rage: {
            enabled: true,
            pool: 1,
            initial_delay: 250,
            cooldown: 100,
            directions: [0, Math.PI / 4, -Math.PI / 4],
            spreading: 1,
            pattern: [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ],
            switch_shooter: { enabled: true, delay: [300, 1000] },
        },
        shield: { enabled: true, pool: 1 },
        change_behavior: { follow_player_pool: 1, auto_rotation_pool: 1 },
    },

    {
        trigger: { pool: { self: 101, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -31.73, y: 5.75, z: 39.32 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false, angular_speed: 2.0 },
        animation: { enabled: false },
        shooter: { enabled: false },
        rage: {
            enabled: true,
            pool: 42,
            initial_delay: 250,
            cooldown: 250,
            directions: generateDirections(4),
            spreading: 1,
            pattern: [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ],
        },
        shield: { enabled: true, pool: 42 },
        change_behavior: { follow_player_pool: 42, auto_rotation_pool: 42 },
    },

    {
        trigger: { pool: { self: 102, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 37.64, y: 5.75, z: 38.33 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false, angular_speed: 2.0 },
        animation: { enabled: false },
        shooter: { enabled: false },
        rage: {
            enabled: true,
            pool: 21,
            initial_delay: 250,
            cooldown: 250,
            directions: [-Math.PI / 2, -Math.PI / 4, 0, Math.PI / 4, Math.PI / 2],
            spreading: 1,
            pattern: [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ],
        },
        shield: { enabled: true, pool: 21 },
        change_behavior: { follow_player_pool: 21, auto_rotation_pool: 21 },
    },

    {
        trigger: { pool: { self: 103, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -30.33, y: 5.75, z: 16.15 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false, angular_speed: 2.0 },
        animation: { enabled: false },
        shooter: { enabled: false },
        rage: {
            enabled: true,
            pool: 71,
            initial_delay: 250,
            cooldown: 250,
            directions: generateDirections(2),
            spreading: 1,
            pattern: [
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
                [1, 1, 1],
            ],
        },
        shield: { enabled: true, pool: 71 },
        change_behavior: { follow_player_pool: 71, auto_rotation_pool: 71 },
    },

    {
        trigger: { pool: { self: 104, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -12.16, y: 5.65, z: -33.57 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false, angular_speed: 2.0 },
        animation: { enabled: false },
        shooter: { enabled: false },
        rage: {
            enabled: true,
            pool: 80,
            initial_delay: 250,
            cooldown: 250,
            switch_shooter: { enabled: true, delay: [750, 750] },
            directions: [0],
            spreading: 1,
            pattern: [[1, 1, 1]],
        },
        shield: { enabled: true, pool: 80 },
        change_behavior: { follow_player_pool: 80, auto_rotation_pool: 80 },
    },
];
