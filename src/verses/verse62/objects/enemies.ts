import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS_1 } from "./settings";
import { generateDirections } from "utils/math";

const CYLINDERS_HEIGHT = 20.3;

const generateZPositions = (count: number, spacing: number = 1.6): number[] => {
    if (count % 2 === 0) {
        const half = count / 2;
        return Array.from({ length: count }, (_, i) => {
            return (i - half + 0.5) * spacing;
        });
    } else {
        const half = Math.floor(count / 2);
        return Array.from({ length: count }, (_, i) => {
            return (i - half) * spacing;
        });
    }
};

const createBoxLine = (
    x: number,
    zOffset: number = 0,
    count: number = 3,
    spacing: number = 1.6,
): EnemyConfig[] => {
    const wh = 1.5;
    const zPositions = generateZPositions(count, spacing);

    return zPositions.map((z) => ({
        trigger: { pool: { self: 5, to_trigger: null } },
        enemy_type: "box",
        on_spawn: {
            position: { x, y: 11, z: z + zOffset },
            rotation_y: Math.PI,
            hp: 2,
            spawn_animation: false,
            box: { w: 0.75, d: wh, h: wh },
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS_1.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
    }));
};

function generateEnemyPair(options: any = {}): EnemyConfig[] {
    const {
        self = 10,
        to_trigger = 1,
        position = { x: -15.55, y: 11, z: 0 },
        cooldown = 400,
        children_trigger = 11,
        pattern = [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
    } = options;

    const initialDelayFirst = cooldown / 2;
    const initialDelaySecond = cooldown;

    return [
        {
            trigger: { pool: { self: self, to_trigger: children_trigger } },
            enemy_type: "cylinder",
            on_spawn: {
                position: { ...position },
                rotation_y: Math.PI,
                hp: 2,
            },
            ground: { id: 0, physics: "plane", size: CYLINDERS_HEIGHT },
            is_inside_ground: false,
            follow_player: { enabled: false },
            triggers_by_player: [true, false],
            rotate_to_player: { enabled: false },
            auto_rotation: { enabled: true, angular_speed: 0.5 },
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
            shooter: {
                enabled: true,
                initial_delay: initialDelayFirst,
                cooldown: cooldown,
                pattern: pattern,
                spreading: 0.001,
                directions: generateDirections(2),
            },
        },
        {
            trigger: { pool: { self: self, to_trigger: children_trigger } },
            enemy_type: "cylinder",
            on_spawn: {
                position: { ...position },
                rotation_y: Math.PI,
                hp: 2,
            },
            ground: { id: 0, physics: "plane", size: CYLINDERS_HEIGHT },
            is_inside_ground: false,
            follow_player: { enabled: false },
            triggers_by_player: [true, false],
            rotate_to_player: { enabled: false },
            auto_rotation: { enabled: true, angular_speed: 0.5 },
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
            shooter: {
                enabled: true,
                initial_delay: initialDelaySecond,
                cooldown: cooldown,
                pattern: pattern,
                spreading: 0.001,
                directions: generateDirections(2),
            },
        },
        {
            trigger: { pool: { self: children_trigger, to_trigger: to_trigger } },
            enemy_type: "arrow",
            on_spawn: {
                position: { ...position },
                rotation_y: Math.PI / 2,
                hp: 2,
            },
            ground: { id: 0, physics: "plane", size: 20 },
            is_inside_ground: false,
            follow_player: { enabled: true, speed: 2 },
            triggers_by_player: [true, false],
            rotate_to_player: { enabled: true, angular_speed: 2 },
            auto_rotation: { enabled: false },
            animation: { enabled: false },
            shooter: {
                enabled: true,
                initial_delay: 200,
                cooldown: 200,
                pattern: pattern,
                spreading: 0.001,
                directions: [0],
            },
            sounds: {
                on_death: { engine: "voice", sound: ["robovoice_1", "robovoice_2", "robovoice_3", "robovoice_4", "robovoice_5", "robovoice_6"] },
            },
        },

    ];
}

export const enemies: EnemyConfig[] = [
    ...createBoxLine(-13, 0, 25),
    ...createBoxLine(-20, 0, 25),
    ...createBoxLine(-27, 0, 25),

    //
    ...generateEnemyPair({
        self: 500,
        to_trigger: [1, 600, 601, 602, 603, 604],
        children_trigger: 510,
        position: { x: -15.55, y: 11, z: 18 },
        cooldown: 1600,
        pattern: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 501,
        to_trigger: [1, 600, 601, 602, 603, 604],
        children_trigger: 511,
        position: { x: -15.55, y: 11, z: 9 },
        cooldown: 800,
        pattern: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 502,
        to_trigger: [1, 600, 601, 602, 603, 604],
        children_trigger: 512,
        position: { x: -15.55, y: 11, z: 0 },
        cooldown: 400,
        pattern: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 503,
        to_trigger: [1, 600, 601, 602, 603, 604],
        children_trigger: 513,
        position: { x: -15.55, y: 11, z: -9 },
        cooldown: 800,
        pattern: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 504,
        to_trigger: [1, 600, 601, 602, 603, 604],
        children_trigger: 514,
        position: { x: -15.55, y: 11, z: -18 },
        cooldown: 1600,
        pattern: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0],
        ],
    }),

    //
    ...generateEnemyPair({
        self: 600,
        to_trigger: [2, 700, 701, 702, 703, 704],
        children_trigger: 610,
        position: { x: -22.75, y: 11, z: -18 },
        cooldown: 1600,
        pattern: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 601,
        to_trigger: [2, 700, 701, 702, 703, 704],
        children_trigger: 611,
        position: { x: -22.75, y: 11, z: -9 },
        cooldown: 800,
        pattern: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 602,
        to_trigger: [2, 700, 701, 702, 703, 704],
        children_trigger: 612,
        position: { x: -22.75, y: 11, z: 0 },
        cooldown: 400,
        pattern: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 603,
        to_trigger: [2, 700, 701, 702, 703, 704],
        children_trigger: 613,
        position: { x: -22.75, y: 11, z: 9 },
        cooldown: 800,
        pattern: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 604,
        to_trigger: [2, 700, 701, 702, 703, 704],
        children_trigger: 614,
        position: { x: -22.75, y: 11, z: 18 },
        cooldown: 1600,
        pattern: [
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
            [1, 0, 0],
        ],
    }),

    //
    ...generateEnemyPair({
        self: 700,
        to_trigger: 999,
        children_trigger: 710,
        position: { x: -30, y: 11, z: -18 },
        cooldown: 1600,
        pattern: [
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 701,
        to_trigger: 999,
        children_trigger: 711,
        position: { x: -30, y: 11, z: -9 },
        cooldown: 800,
        pattern: [
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 702,
        to_trigger: 999,
        children_trigger: 712,
        position: { x: -30, y: 11, z: 0 },
        cooldown: 400,
        pattern: [
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 703,
        to_trigger: 999,
        children_trigger: 713,
        position: { x: -30, y: 11, z: 9 },
        cooldown: 800,
        pattern: [
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
        ],
    }),
    ...generateEnemyPair({
        self: 704,
        to_trigger: 999,
        children_trigger: 714,
        position: { x: -30, y: 11, z: 18 },
        cooldown: 1600,
        pattern: [
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
            [1, 1, 0],
        ],
    }),

    //
    {
        trigger: { pool: { self: 50, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: -30, y: 11, z: 0 },
            rotation_y: 0,
            hp: 5,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "plane", size: CYLINDERS_HEIGHT },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 3.0 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 250,
            cooldown: 1000,
            cooldown_dynamic: [
                100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500,
                1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800, 2900,
                3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 3900, 4000,
            ],
            directions: generateDirections(3),
            spreading: 0.5,
            pattern: [
                [1, 1, 0],
                [1, 2, 0],
                [2, 1, 0],
                [2, 2, 0],
                [2, 1, 0],
                [1, 1, 0],
            ],
        },
        shield: { enabled: true, pool: 999 },
        change_behavior: { follow_player_pool: 2 },
    },
];
