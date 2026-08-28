import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

function getRandomCooldown(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const createBoxLine = ({
    pattern,
    center,
    step = 1.75,
    boxSize = { w: 0.75, h: 1.5, d: 1.5 },
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
                trigger: { pool: { self: 0, to_trigger: null } },
                enemy_type: "box",
                on_spawn: {
                    position: {
                        x: center.x + rotatedX,
                        y: center.y,
                        z: center.z + rotatedZ,
                    },
                    rotation_y: rotationY,
                    hp: 3,
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

function createSphereEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "sphere",
        on_spawn: {
            position,
            rotation_y,
            hp: 5,
            spawn_animation: true,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: -2 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: true, disabled_on_start: true },
        shield: { enabled: true, pool: self + 100 },
        change_behavior: { follow_player_pool: self + 100, rotate_to_player_pool: self + 100 },
        is_miner: true,
    };
}

function createBoxEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    self: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self + 800, to_trigger: self + 100 } },
        enemy_type: "box",
        on_spawn: {
            position,
            rotation_y: 0,
            hp: 2,
            spawn_animation: true,
            box: { w: 1.5, d: 1.5, h: 1.5 },
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: false },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        autoaimable: true,
    };
}

function createArrowEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self + 800, to_trigger: self + 100 } },
        enemy_type: "arrow",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
            spawn_animation: true,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: -2 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: true, angular_speed: 2 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
    };
}

function createArrowShieldConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
): EnemyConfig {
    return {
        trigger: { pool: { self: self + 800, to_trigger: self + 100 } },
        enemy_type: "arrow-shield",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
            spawn_animation: true,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: -2 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: true, angular_speed: 1 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
    };
}

export const enemies: EnemyConfig[] = [
    //
    ...createBoxLine({ pattern: ["*", "*", "*", "*", "*"], center: { x: -6, y: 1.25, z: -10 } }),

    createSphereEnemyConfig({ x: -30, y: 1.25, z: -10 }, -Math.PI / 2, 101, 10),

    createBoxEnemyConfig({ x: -13.9, y: 1.25, z: -6 }, 101),
    createBoxEnemyConfig({ x: -23.7, y: 1.25, z: -6 }, 101),
    createBoxEnemyConfig({ x: -33.5, y: 1.25, z: -6 }, 101),
    createBoxEnemyConfig({ x: -9, y: 1.25, z: -14 }, 101),
    createBoxEnemyConfig({ x: -18.8, y: 1.25, z: -14 }, 101),
    createBoxEnemyConfig({ x: -28.6, y: 1.25, z: -14 }, 101),

    createArrowEnemyConfig({ x: -12.5, y: 1.25, z: -7.5 }, Math.PI / 2, 101),
    createArrowEnemyConfig({ x: -12.5, y: 1.25, z: -10 }, Math.PI / 2, 101),
    createArrowEnemyConfig({ x: -12.5, y: 1.25, z: -12.5 }, Math.PI / 2, 101),

    //
    ...createBoxLine({ pattern: ["*", "*", "*", "*", "*"], center: { x: 6, y: 1.25, z: -10 } }),

    createSphereEnemyConfig({ x: 30, y: 1.25, z: -10 }, Math.PI / 2, 102, 10),

    createBoxEnemyConfig({ x: 13.9, y: 1.25, z: -6 }, 102),
    createBoxEnemyConfig({ x: 23.7, y: 1.25, z: -6 }, 102),
    createBoxEnemyConfig({ x: 33.5, y: 1.25, z: -6 }, 102),
    createBoxEnemyConfig({ x: 9, y: 1.25, z: -14 }, 102),
    createBoxEnemyConfig({ x: 18.8, y: 1.25, z: -14 }, 102),
    createBoxEnemyConfig({ x: 28.6, y: 1.25, z: -14 }, 102),

    createArrowEnemyConfig({ x: 12.5, y: 1.25, z: -7.5 }, -Math.PI / 2, 102),
    createArrowEnemyConfig({ x: 12.5, y: 1.25, z: -10 }, -Math.PI / 2, 102),
    createArrowEnemyConfig({ x: 12.5, y: 1.25, z: -12.5 }, -Math.PI / 2, 102),

    //
    ...createBoxLine({
        pattern: ["*", "*", "*", "*", "*"],
        center: { x: -6, y: 1.25, z: 40 + -10 },
    }),

    createSphereEnemyConfig({ x: -30, y: 1.25, z: 40 + -10 }, -Math.PI / 2, 103, 20),

    createBoxEnemyConfig({ x: -13.9, y: 1.25, z: 40 + -6 }, 103),
    createBoxEnemyConfig({ x: -23.7, y: 1.25, z: 40 + -6 }, 103),
    createBoxEnemyConfig({ x: -33.5, y: 1.25, z: 40 + -6 }, 103),
    createBoxEnemyConfig({ x: -9, y: 1.25, z: 40 + -14 }, 103),
    createBoxEnemyConfig({ x: -18.8, y: 1.25, z: 40 + -14 }, 103),
    createBoxEnemyConfig({ x: -28.6, y: 1.25, z: 40 + -14 }, 103),

    createArrowShieldConfig({ x: -12.5, y: 1.25, z: 40 + -7.5 }, Math.PI / 2, 103),
    createArrowShieldConfig({ x: -12.5, y: 1.25, z: 40 + -10 }, Math.PI / 2, 103),
    createArrowShieldConfig({ x: -12.5, y: 1.25, z: 40 + -12.5 }, Math.PI / 2, 103),

    //
    ...createBoxLine({
        pattern: ["*", "*", "*", "*", "*"],
        center: { x: 6, y: 1.25, z: 40 + -10 },
    }),

    createSphereEnemyConfig({ x: 30, y: 1.25, z: 40 + -10 }, Math.PI / 2, 104, 20),

    createBoxEnemyConfig({ x: 13.9, y: 1.25, z: 40 + -6 }, 104),
    createBoxEnemyConfig({ x: 23.7, y: 1.25, z: 40 + -6 }, 104),
    createBoxEnemyConfig({ x: 33.5, y: 1.25, z: 40 + -6 }, 104),
    createBoxEnemyConfig({ x: 9, y: 1.25, z: 40 + -14 }, 104),
    createBoxEnemyConfig({ x: 18.8, y: 1.25, z: 40 + -14 }, 104),
    createBoxEnemyConfig({ x: 28.6, y: 1.25, z: 40 + -14 }, 104),

    createArrowShieldConfig({ x: 12.5, y: 1.25, z: 40 + -7.5 }, -Math.PI / 2, 104),
    createArrowShieldConfig({ x: 12.5, y: 1.25, z: 40 + -10 }, -Math.PI / 2, 104),
    createArrowShieldConfig({ x: 12.5, y: 1.25, z: 40 + -12.5 }, -Math.PI / 2, 104),

    // angelus
    {
        trigger: { pool: { self: 1000, to_trigger: 10000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { x: 0, y: 1.25, z: 88.25 },
            rotation_y: Math.PI,
            hp: Infinity,
            spawn_animation: true,
        },
        ground: { id: 0, physics: "plane", size: SURFACE_SETTINGS.h },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 0 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: Math.PI / 4 },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: 1000,
            cooldown: 1000,
            pattern: [
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
                [1, 1, 0],
            ],
            directions: generateDirections(2),
            spreading: 0.001,
        },
        autoaimable: false,
    },
];
