import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";

const amplitude = 5;

function getRandomCooldown(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createEnemy(position: EnemyConfig["on_spawn"]["position"], delay: number): EnemyConfig {
    return {
        trigger: { pool: { self: 0, to_trigger: 100 } },
        enemy_type: "cylinder",
        on_spawn: {
            position,
            rotation_y: 0,
            hp: 2,
            delay: delay,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 10 },
        animation: {
            enabled: true,
            name: "bob",
            params: {
                axes: {
                    y: {
                        amplitude: amplitude,
                        speed: 50,
                    },
                },
                frames: 100,
                from: 25,
                is_linear: true,
            },
        },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1400, 1600),
            cooldown: getRandomCooldown(1400, 1600),
            directions: [0],
            spreading: 0.001,
            pattern: [[1, 1, 5]],
        },
        metadata: { not_damageable_with_chlorine: true, ignore_hover: true },
    };
}

function createWTFEnemy(position: EnemyConfig["on_spawn"]["position"], delay: number): EnemyConfig {
    return {
        trigger: { pool: { self: 0, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: position.x, y: 5.65, z: position.z },
            rotation_y: 0,
            hp: 2,
            delay: delay,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: {
            enabled: true,
            name: "glitch_rotation",
            params: {
                turns: getRandomCooldown(2, 4),
                frames: getRandomCooldown(30, 48),
                speed: getRandomCooldown(80, 120),
                keyframes: getRandomCooldown(16, 28),
            },
        },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(950, 1050),
            cooldown: getRandomCooldown(950, 1050),
            directions: [0],
            spreading: 1,
            pattern: [[1, 1, 3]],
        },
        metadata: { not_damageable_with_chlorine: true },
    };
}

function createEnemy2(
    position: EnemyConfig["on_spawn"]["position"],
    delay: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: 0, to_trigger: 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: position.x, y: 7, z: position.z },
            rotation_y: 0,
            hp: 2,
            delay: delay,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 10 },
        animation: {
            enabled: true,
            name: "glitch_position",
            params: {
                radius: 2,
                frames: getRandomCooldown(36, 54),
                speed: getRandomCooldown(70, 100),
                keyframes: getRandomCooldown(20, 32),
            },
        },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(950, 1050),
            cooldown: getRandomCooldown(950, 1050),
            directions: [0],
            spreading: 1,
            pattern: [[1, 1, 3]],
        },
        metadata: { not_damageable_with_chlorine: true },
    };
}

export const enemies: EnemyConfig[] = [
    createWTFEnemy({ x: -52.146, y: 6.009, z: -49.873 }, 0),
    createWTFEnemy({ x: -49.085, y: 6.009, z: -39.333 }, 0.25),
    createWTFEnemy({ x: -42.969, y: 6.009, z: -45.951 }, 0.5),
    createEnemy({ x: -31.802, y: 6.009, z: -45.952 }, 0.75),
    createEnemy({ x: -15.984, y: 6.009, z: -45.951 }, 1),
    createWTFEnemy({ x: -8.534, y: 6.009, z: -45.951 }, 1.25),
    createWTFEnemy({ x: -3.012, y: 6.009, z: -40.363 }, 1.5),
    createWTFEnemy({ x: 2.99, y: 6.009, z: -50.83 }, 1.75),
    createWTFEnemy({ x: 8.792, y: 6.009, z: -46.141 }, 2),
    createEnemy({ x: 18.75, y: 6.009, z: -46.14 }, 2.25),
    createEnemy({ x: 35.916, y: 6.009, z: -46.139 }, 2.5),
    createWTFEnemy({ x: 48.843, y: 6.009, z: -46.14 }, 2.75),
    createWTFEnemy({ x: 54.777, y: 6.009, z: -49.908 }, 3),
    createWTFEnemy({ x: 54.778, y: 6.009, z: -37.891 }, 3.25),
    createWTFEnemy({ x: 41.641, y: 6.009, z: -49.244 }, 3.5),
    createWTFEnemy({ x: 41.641, y: 6.009, z: -37.347 }, 3.75),
    createEnemy({ x: 48.596, y: 6.009, z: -32.522 }, 4),
    createEnemy({ x: 48.595, y: 6.009, z: -22.974 }, 4.25),
    createEnemy({ x: 48.597, y: 6.009, z: -11.504 }, 4.5),
    createEnemy({ x: 39.606, y: 6.009, z: -11.504 }, 4.75),
    createEnemy({ x: 30.245, y: 6.009, z: -11.504 }, 5),
    createWTFEnemy({ x: 21.233, y: 6.009, z: -11.504 }, 5.25),
    createWTFEnemy({ x: -9.841, y: 6.009, z: -11.504 }, 5.5),
    createWTFEnemy({ x: -4.022, y: 6.009, z: -21.61 }, 5.75),
    createWTFEnemy({ x: -4.022, y: 6.009, z: -14.601 }, 6),
    createWTFEnemy({ x: 9.302, y: 6.009, z: -21.939 }, 6.25),
    createWTFEnemy({ x: 9.302, y: 6.009, z: -7.728 }, 6.5),
    createWTFEnemy({ x: -16.123, y: 6.009, z: -7.728 }, 6.75),
    createWTFEnemy({ x: -16.123, y: 6.009, z: -21.548 }, 7),
    createEnemy({ x: 2.991, y: 6.009, z: -1.97 }, 7.25),
    createEnemy({ x: 2.991, y: 6.009, z: 3.396 }, 7.5),
    createEnemy2({ x: 2.991, y: 6.009, z: 9.912 }, 7.75),
    createEnemy2({ x: -4.952, y: 6.009, z: 9.912 }, 8),
    createEnemy2({ x: -4.952, y: 6.009, z: 18.306 }, 8.25),
    createEnemy2({ x: 9.133, y: 6.009, z: 18.306 }, 8.5),
    createEnemy2({ x: 9.133, y: 6.009, z: 7.53 }, 8.75),
    createEnemy2({ x: 2.089, y: 6.009, z: 24.115 }, 9),
    createEnemy({ x: 16.982, y: 6.009, z: 15.817 }, 9.25),
    createEnemy({ x: 25.175, y: 6.009, z: 15.817 }, 9.5),
    createEnemy2({ x: 31.904, y: 6.009, z: 8.702 }, 9.75),
    createEnemy2({ x: 31.904, y: 6.009, z: 23.613 }, 10),
    createEnemy2({ x: 39.285, y: 6.009, z: 12.639 }, 10.25),
    createEnemy2({ x: 45.365, y: 6.009, z: 24.036 }, 10.5),
    createEnemy({ x: 39.212, y: 6.009, z: 29.243 }, 10.75),
    createEnemy2({ x: 39.213, y: 6.009, z: 37.683 }, 11),
    createEnemy2({ x: 31.375, y: 6.009, z: 48.163 }, 11.25),
    createEnemy2({ x: 43.865, y: 6.009, z: 48.163 }, 11.5),
    createEnemy2({ x: 43.866, y: 6.009, z: 40.853 }, 11.75),
    createEnemy2({ x: 33.091, y: 6.009, z: 40.853 }, 12),
    createEnemy({ x: 25.184, y: 6.009, z: 48.461 }, 12.25),
    createEnemy({ x: 17.627, y: 6.009, z: 48.461 }, 12.5),
    createEnemy({ x: 9.407, y: 6.009, z: 48.461 }, 12.75),
    createEnemy({ x: 3.813, y: 6.009, z: 33.236 }, 13),
    createEnemy({ x: 3.813, y: 6.009, z: 41.103 }, 13.25),
    createEnemy({ x: 3.813, y: 6.009, z: 48.42 }, 13.5),
    createEnemy({ x: 3.582, y: 6.009, z: 56.71 }, 13.75),
    createEnemy({ x: 3.582, y: 6.009, z: 63.381 }, 14),
    createEnemy({ x: -3.598, y: 6.009, z: 63.382 }, 14.25),
    createEnemy({ x: -11.259, y: 6.009, z: 63.382 }, 14.5),
    createEnemy({ x: -11.259, y: 6.009, z: 63.382 }, 14.75),
    createEnemy({ x: -19.436, y: 6.009, z: 63.382 }, 15),
    createEnemy({ x: -28.088, y: 6.009, z: 63.382 }, 15.25),
    createEnemy2({ x: -32.999, y: 6.009, z: 59.409 }, 15.5),
    createEnemy2({ x: -44.716, y: 6.009, z: 59.407 }, 15.75),
    createEnemy2({ x: -44.716, y: 6.009, z: 48.246 }, 16),
    createEnemy2({ x: -36.571, y: 6.009, z: 48.247 }, 16.25),
    createEnemy2({ x: -36.571, y: 6.009, z: 54.009 }, 16.5),
    createEnemy2({ x: -52.356, y: 6.009, z: 54.009 }, 16.75),
    createEnemy2({ x: -52.356, y: 6.009, z: 61.427 }, 17),

    //
    {
        trigger: { pool: { self: 10, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -44, y: 5.65, z: 25 },
            rotation_y: Math.PI,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
    },
];
