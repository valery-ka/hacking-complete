import { EnemyConfig } from "types/enemy/Enemies.types";
import { generateDirections } from "utils/math";

import { SURFACE_SETTINGS } from "./settings";

function getRandomValueInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createArrowEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
    delay: number = 1,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow",
        on_spawn: { position, rotation_y, hp: 2, delay: delay + 2.3 },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 750,
            directions: [0],
            pattern: [[1, 1, 0]],
        },
    };
}

const CYLINDERS_POOL = 10;

const CYLINDER_PATTERN_1: [number, number, number][] = Array(4).fill([1, 0, 0]);
const CYLINDER_PATTERN_2: [number, number, number][] = Array(4).fill([0, 1, 0]);
const CYLINDER_PATTERN_3: [number, number, number][] = Array(20).fill([0, 0, 1]);

const PATTERNS = [CYLINDER_PATTERN_1, CYLINDER_PATTERN_2];

function createCylinderEnemy(
    position: { x: number; y: number; z: number },
    pattern: [number, number, number][],
    delay: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: CYLINDERS_POOL, to_trigger: 999 } },
        enemy_type: "cylinder",
        on_spawn: { position, rotation_y: Math.PI, hp: 3, delay },
        ground: { id: 0, physics: "plane", size: 10 },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 750,
            cooldown: 1500,
            pattern,
            spreading: 0.001,
            directions: generateDirections(2),
        },
    };
}

const ARROW_POSITIONS = [
    { x: 11.23, y: 5.75, z: -9.87 },
    { x: -8.45, y: 5.75, z: 12.34 },
    { x: 14.12, y: 5.75, z: 6.78 },
    { x: -13.56, y: 5.75, z: -7.89 },
    { x: 6.78, y: 5.75, z: -14.23 },
    { x: -10.98, y: 5.75, z: 9.45 },
    { x: 9.12, y: 5.75, z: -5.67 },
    { x: -6.34, y: 5.75, z: -12.89 },
    { x: 12.78, y: 5.75, z: 11.23 },
    { x: -14.89, y: 5.75, z: -6.12 },
    { x: 7.45, y: 5.75, z: 13.56 },
    { x: -5.67, y: 5.75, z: -9.34 },
    { x: 13.21, y: 5.75, z: -11.78 },
    { x: -11.45, y: 5.75, z: 5.89 },
    { x: 8.99, y: 5.75, z: -13.45 },
    { x: -12.34, y: 5.75, z: 14.01 },
    { x: 5.12, y: 5.75, z: 10.67 },
    { x: -9.78, y: 5.75, z: -5.23 },
    { x: 10.45, y: 5.75, z: 7.89 },
    { x: -7.23, y: 5.75, z: -14.56 },
    { x: 14.56, y: 5.75, z: -8.34 },
    { x: -6.01, y: 5.75, z: 11.78 },
    { x: 5.99, y: 5.75, z: -6.45 },
    { x: -13.89, y: 5.75, z: 8.12 },
];

function createArrowEnemies(): EnemyConfig[] {
    return ARROW_POSITIONS.map((position, index) => {
        const angle = (index / ARROW_POSITIONS.length) * Math.PI * 2;

        return createArrowEnemyConfig(position, angle, 0, 999, (index + 1) * 0.5);
    });
}

const CYLINDER_POSITIONS = [
    { x: 9.23, y: 5.75, z: 11.87 },
    { x: -7.56, y: 5.75, z: 10.43 },
    { x: 12.18, y: 5.75, z: -6.92 },
    { x: -11.45, y: 5.75, z: -8.77 },
    { x: 5.89, y: 5.75, z: -12.31 },
    { x: -9.67, y: 5.75, z: 5.24 },
    { x: 7.33, y: 5.75, z: -5.68 },
    { x: -5.12, y: 5.75, z: -11.09 },
    { x: 10.76, y: 5.75, z: 7.91 },
    { x: -12.49, y: 5.75, z: -5.03 },
];

function createClockwiseCylinderEnemies(): EnemyConfig[] {
    return CYLINDER_POSITIONS.map((position, index) => {
        return createCylinderEnemy(position, PATTERNS[index % PATTERNS.length], index * 1);
    });
}

const SIMONE_PATTERN: [number, number, number][] = Array(20).fill([1, 1, 0]);

export const enemies: EnemyConfig[] = [
    ...createArrowEnemies(),
    ...createClockwiseCylinderEnemies(),

    {
        trigger: { pool: { self: CYLINDERS_POOL, to_trigger: 999 } },
        enemy_type: "cylinder",
        on_spawn: {
            position: { x: 13.94, y: 5.75, z: 5.61 },
            rotation_y: Math.PI,
            hp: 3,
            delay: 3,
        },
        ground: { id: 0, physics: "plane", size: 10 },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1500,
            pattern: CYLINDER_PATTERN_3,
            spreading: 0.001,
            directions: generateDirections(10),
        },
    },
    {
        trigger: { pool: { self: CYLINDERS_POOL, to_trigger: 999 } },
        enemy_type: "cylinder",
        on_spawn: {
            position: { x: -12.91, y: 5.75, z: 7.91 },
            rotation_y: Math.PI,
            hp: 3,
            delay: 6,
        },
        ground: { id: 0, physics: "plane", size: 10 },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1500,
            pattern: CYLINDER_PATTERN_3,
            spreading: 0.001,
            directions: generateDirections(10),
        },
    },
    {
        trigger: { pool: { self: CYLINDERS_POOL, to_trigger: 999 } },
        enemy_type: "cylinder",
        on_spawn: {
            position: { x: 13.57, y: 5.75, z: -8.29 },
            rotation_y: Math.PI,
            hp: 3,
            delay: 9,
        },
        ground: { id: 0, physics: "plane", size: 10 },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1500,
            pattern: CYLINDER_PATTERN_3,
            spreading: 0.001,
            directions: generateDirections(10),
        },
    },
    {
        trigger: { pool: { self: CYLINDERS_POOL, to_trigger: 999 } },
        enemy_type: "cylinder",
        on_spawn: {
            position: { x: -5.34, y: 5.75, z: -9.18 },
            rotation_y: Math.PI,
            hp: 3,
            delay: 12,
        },
        ground: { id: 0, physics: "plane", size: 10 },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1500,
            pattern: CYLINDER_PATTERN_3,
            spreading: 0.001,
            directions: generateDirections(10),
        },
    },

    //
    {
        trigger: { pool: { self: 998, to_trigger: 1000 } },
        enemy_type: "simone",
        on_spawn: {
            position: { x: 0, y: 6.5, z: 5 },
            rotation_y: Math.PI,
            hp: 20,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 2 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 0.5 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1000,
            pattern: SIMONE_PATTERN,
            spreading: 0.001,
            directions: generateDirections(10),
        },
        shield: { enabled: true, pool: 9999 },
        change_behavior: { follow_player_pool: 999 },
        sounds: {
            on_death: { engine: "voice", sound: ["simone_ugh_3"] },
        },
    },

    // lol
    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 7.5, z: 34 },
            rotation_y: Math.PI,
            hp: 1,
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
            name: "circle",
            params: {
                plane: "xz",
                radius: 0.8,
                speed: 90,
                frames: 180,
                from: 0,
            },
        },
        shooter: { enabled: false },
        autoaimable: false,
    },
    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 7.5, z: 34 },
            rotation_y: Math.PI,
            hp: 1,
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
            name: "circle",
            params: {
                plane: "xz",
                radius: 0.8,
                speed: 90,
                frames: 180,
                from: 90,
            },
        },
        shooter: { enabled: false },
        autoaimable: false,
    },

    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -5, y: 7.5, z: 35 },
            rotation_y: 1.8326,
            hp: 1,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        autoaimable: false,
    },
    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -6.5, y: 7.5, z: 36.5 },
            rotation_y: 1.8326,
            hp: 1,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        autoaimable: false,
    },
    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: -8, y: 7.5, z: 38 },
            rotation_y: 1.8326,
            hp: 1,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        autoaimable: false,
    },

    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 5, y: 7.5, z: 35 },
            rotation_y: -1.8326,
            hp: 1,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        autoaimable: false,
    },
    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 6.5, y: 7.5, z: 36.5 },
            rotation_y: -1.8326,
            hp: 1,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        autoaimable: false,
    },
    {
        trigger: { pool: { self: 777, to_trigger: null } },
        enemy_type: "arrow",
        on_spawn: {
            position: { x: 8, y: 7.5, z: 38 },
            rotation_y: -1.8326,
            hp: 1,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        autoaimable: false,
    },
];
