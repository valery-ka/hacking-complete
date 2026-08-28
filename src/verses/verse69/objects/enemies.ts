import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";

function getRandomCooldown(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createArrowEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
    delay: number,
    isInsideGround: boolean,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
            delay: delay,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: isInsideGround,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [!isInsideGround, isInsideGround],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1400, 1600),
            cooldown: getRandomCooldown(1400, 1600),
            switch_shooter: { enabled: false },
            pattern: isInsideGround ? [[1, 0, 0]] : [[0, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
    };
}

function createArrowShieldEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
    delay: number,
    isInsideGround: boolean,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "arrow-shield",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
            delay: delay,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: isInsideGround,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [!isInsideGround, isInsideGround],
        rotate_to_player: { enabled: true, angular_speed: 1.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(1400, 1600),
            cooldown: getRandomCooldown(1400, 1600),
            switch_shooter: { enabled: false },
            pattern: isInsideGround ? [[1, 0, 0]] : [[0, 1, 0]],
            spreading: 0.001,
            directions: [0],
        },
    };
}

function createCylinderEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
    self: number,
    to_trigger: number | null,
    delay: number,
    isInsideGround: boolean,
): EnemyConfig {
    return {
        trigger: { pool: { self: self, to_trigger: to_trigger } },
        enemy_type: "cylinder",
        on_spawn: {
            position,
            rotation_y,
            hp: 4,
            delay: delay,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: isInsideGround,
        follow_player: { enabled: false },
        triggers_by_player: [!isInsideGround, isInsideGround],
        rotate_to_player: { enabled: false },
        auto_rotation: { enabled: true, angular_speed: 1 },
        animation: { enabled: false },
        shooter: { enabled: false },
        rocket_launcher: { enabled: true, cooldown: 1234 * 2 },
    };
}

function createArrowEnemyConfigsAroundCircle(
    lat: number,
    delay: number | null,
    is_inside_ground: boolean,
): EnemyConfig[] {
    const enemies = [];

    const count = 12;
    const step = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
        const longRaw = i * step;
        const long = is_inside_ground ? -1 * longRaw + Math.PI : longRaw;
        enemies.push(
            createArrowEnemyConfig(
                { long: long, lat: lat },
                Math.PI / 2,
                0,
                999,
                delay ? delay : (i + 1) / 2,
                is_inside_ground,
            ),
        );
    }

    return enemies;
}

function createArrowShieldEnemyConfigsAroundCircle(
    lat: number,
    delay: number | null,
    is_inside_ground: boolean,
): EnemyConfig[] {
    const enemies = [];

    const count = 6;
    const step = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
        const longRaw = i * step;
        const long = is_inside_ground ? -1 * longRaw + Math.PI : longRaw;
        enemies.push(
            createArrowShieldEnemyConfig(
                { long: long, lat: lat },
                Math.PI / 2,
                0,
                999,
                delay ? delay : (i + 1) / 2,
                is_inside_ground,
            ),
        );
    }

    return enemies;
}

function createCylinderEnemyConfigsAroundCircle(
    lat: number,
    delay: number | null,
    is_inside_ground: boolean,
): EnemyConfig[] {
    const enemies = [];

    const count = 4;
    const step = (2 * Math.PI) / count;

    for (let i = 0; i < count; i++) {
        const longRaw = i * step;
        const long = is_inside_ground ? -1 * longRaw + Math.PI : longRaw;
        enemies.push(
            createCylinderEnemyConfig(
                { long: long, lat: lat },
                Math.PI / 2,
                0,
                null,
                delay ? delay : (i + 1) / 2 + 3,
                is_inside_ground,
            ),
        );
    }

    return enemies;
}

export const enemies: EnemyConfig[] = [
    ...createArrowEnemyConfigsAroundCircle(0.1, null, false),
    ...createArrowShieldEnemyConfigsAroundCircle(0.75, 6, false),
    ...createCylinderEnemyConfigsAroundCircle(2, null, false),
    {
        trigger: { pool: { self: 1, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: 0, lat: Math.PI / 2 },
            rotation_y: 0,
            hp: 12,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: true,
        follow_player: { enabled: false, speed: 0 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        rage: {
            enabled: true,
            pool: 999,
            initial_delay: 750,
            cooldown: 410.9589041095890410958904109589,
            directions: [0],
            spreading: 0.0001,
            pattern: [[1, 1, 0]],
        },
        shield: { enabled: true, pool: 999 },
        scale_hp_by_difficulty: false,
    },

    ...createArrowEnemyConfigsAroundCircle(-0.1, null, true),
    ...createArrowShieldEnemyConfigsAroundCircle(-0.75, 6, true),
    ...createCylinderEnemyConfigsAroundCircle(-2, null, true),
    {
        trigger: { pool: { self: 1, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: {
            position: { long: Math.PI, lat: -Math.PI / 2 },
            rotation_y: 0,
            hp: 12,
            spawn_animation: false,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: false, speed: 0 },
        triggers_by_player: [false, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: { enabled: false },
        rage: {
            enabled: true,
            pool: 999,
            initial_delay: 750,
            cooldown: 410.9589041095890410958904109589,
            directions: [0],
            spreading: 0.0001,
            pattern: [[1, 1, 0]],
        },
        shield: { enabled: true, pool: 999 },
        scale_hp_by_difficulty: false,
    },
];
