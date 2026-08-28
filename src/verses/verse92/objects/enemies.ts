import { EnemyConfig } from "types/enemy/Enemies.types";

import { SURFACE_SETTINGS } from "./settings";
import { generateDirections } from "utils/math";

function getRandomCooldown(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createArrowEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
): EnemyConfig {
    return {
        trigger: { pool: { self: 0, to_trigger: 2 } },
        enemy_type: "arrow",
        on_spawn: {
            position,
            rotation_y,
            hp: 2,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 2.0 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(2000, 3000),
            cooldown: getRandomCooldown(2000, 3000),
            switch_shooter: { enabled: false },
            pattern: [[1, 0, 0]],
            spreading: 0.25,
            directions: [0],
        },
    };
}

function createArrowShieldEnemyConfig(
    position: EnemyConfig["on_spawn"]["position"],
    rotation_y: EnemyConfig["on_spawn"]["rotation_y"],
): EnemyConfig {
    return {
        trigger: { pool: { self: 0, to_trigger: 2 } },
        enemy_type: "arrow-shield",
        on_spawn: {
            position,
            rotation_y,
            hp: 1,
        },
        ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
        is_inside_ground: false,
        follow_player: { enabled: true, speed: 2.0 },
        triggers_by_player: [true, false],
        rotate_to_player: { enabled: true, angular_speed: 0.75 },
        auto_rotation: { enabled: false },
        animation: { enabled: false },
        shooter: {
            enabled: true,
            initial_delay: getRandomCooldown(2000, 3000),
            cooldown: getRandomCooldown(2000, 3000),
            switch_shooter: { enabled: false },
            pattern: [[1, 0, 0]],
            spreading: 0.25,
            directions: [0],
        },
    };
}

// Массив врагов
export const enemies: EnemyConfig[] = [
    // // Окружение
    createArrowEnemyConfig({ long: Math.PI / 2 + 0.4, lat: Math.PI / 3 }, -Math.PI / 2),
    // createArrowEnemyConfig({ long: Math.PI / 2, lat: Math.PI / 3 }, -Math.PI / 2),
    // createArrowEnemyConfig({ long: Math.PI / 2 - 0.4, lat: Math.PI / 3 }, -Math.PI / 2),
    // //
    // createArrowEnemyConfig(
    //     { long: Math.PI / 2 + Math.PI / 2 + 0.4, lat: Math.PI / 3 },
    //     -Math.PI / 2,
    // ),
    // createArrowEnemyConfig({ long: Math.PI / 2 + Math.PI / 2, lat: Math.PI / 3 }, -Math.PI / 2),
    // createArrowEnemyConfig(
    //     { long: Math.PI / 2 + Math.PI / 2 - 0.4, lat: Math.PI / 3 },
    //     -Math.PI / 2,
    // ),
    // //
    // createArrowEnemyConfig({ long: Math.PI + Math.PI / 2 + 0.4, lat: Math.PI / 3 }, -Math.PI / 2),
    // createArrowEnemyConfig({ long: Math.PI + Math.PI / 2, lat: Math.PI / 3 }, -Math.PI / 2),
    // createArrowEnemyConfig({ long: Math.PI + Math.PI / 2 - 0.4, lat: Math.PI / 3 }, -Math.PI / 2),
    // createArrowEnemyConfig(
    //     { long: -Math.PI / 2 + Math.PI / 2 + 0.4, lat: Math.PI / 3 },
    //     -Math.PI / 2,
    // ),
    // createArrowEnemyConfig({ long: -Math.PI / 2 + Math.PI / 2, lat: Math.PI / 3 }, -Math.PI / 2),
    // createArrowEnemyConfig(
    //     { long: -Math.PI / 2 + Math.PI / 2 - 0.4, lat: Math.PI / 3 },
    //     -Math.PI / 2,
    // ),
    // //
    // // Сверху
    // createArrowShieldEnemyConfig({ long: Math.PI / 2 + 0.2, lat: 0.25 }, 0),
    // createArrowShieldEnemyConfig({ long: Math.PI / 2, lat: 0.25 }, 0),
    // createArrowShieldEnemyConfig({ long: Math.PI / 2 - 0.2, lat: 0.25 }, 0),
    // //
    // createArrowEnemyConfig({ long: Math.PI / 2 + 0.2, lat: 0.0 }, 0),
    // createArrowEnemyConfig({ long: Math.PI / 2, lat: 0.0 }, 0),
    // createArrowEnemyConfig({ long: Math.PI / 2 - 0.2, lat: 0.0 }, 0),
    // //
    // // Снизу
    // createArrowEnemyConfig({ long: -Math.PI / 2 + 0.2, lat: 0.25 }, 0),
    // createArrowEnemyConfig({ long: -Math.PI / 2, lat: 0.25 }, 0),
    // createArrowEnemyConfig({ long: -Math.PI / 2 - 0.2, lat: 0.25 }, 0),
    // //
    // createArrowShieldEnemyConfig({ long: -Math.PI / 2 + 0.2, lat: 0.0 }, 0),
    // createArrowShieldEnemyConfig({ long: -Math.PI / 2, lat: 0.0 }, 0),
    // createArrowShieldEnemyConfig({ long: -Math.PI / 2 - 0.2, lat: 0.0 }, 0),
    // //
    // // Справа
    // createArrowEnemyConfig({ long: 0 + 0.2, lat: 0.25 }, 0),
    // createArrowEnemyConfig({ long: 0, lat: 0.25 }, 0),
    // createArrowEnemyConfig({ long: 0 - 0.2, lat: 0.25 }, 0),
    // //
    // createArrowShieldEnemyConfig({ long: 0 + 0.2, lat: 0.0 }, 0),
    // createArrowShieldEnemyConfig({ long: 0, lat: 0.0 }, 0),
    // createArrowShieldEnemyConfig({ long: 0 - 0.2, lat: 0.0 }, 0),
    // //
    // // Слева
    // createArrowEnemyConfig({ long: Math.PI + 0.2, lat: 0.25 }, 0),
    // createArrowEnemyConfig({ long: Math.PI, lat: 0.25 }, 0),
    // createArrowEnemyConfig({ long: Math.PI - 0.2, lat: 0.25 }, 0),
    // //
    // createArrowShieldEnemyConfig({ long: Math.PI + 0.2, lat: 0.0 }, 0),
    // createArrowShieldEnemyConfig({ long: Math.PI, lat: 0.0 }, 0),
    // createArrowShieldEnemyConfig({ long: Math.PI - 0.2, lat: 0.0 }, 0),
    // //
    // // Ядро
    // {
    //     trigger: { pool: { self: 1, to_trigger: 1000 } },
    //     enemy_type: "sphere",
    //     on_spawn: {
    //         position: { long: 0, lat: -Math.PI / 2 },
    //         rotation_y: 0,
    //         hp: 5,
    //         spawn_animation: false,
    //     },
    //     ground: { id: 0, physics: "sphere", size: SURFACE_SETTINGS },
    //     is_inside_ground: false,
    //     follow_player: { enabled: false, speed: 2.0 },
    //     triggers_by_player: [true, false],
    //     rotate_to_player: { enabled: true },
    //     auto_rotation: { enabled: true, angular_speed: 0.5 },
    //     animation: { enabled: false },
    //     shooter: {
    //         enabled: true,
    //         initial_delay: 1000,
    //         cooldown: 1000,
    //         switch_shooter: { enabled: false },
    //         pattern: [[0, 1, 0]],
    //         spreading: 0.001,
    //         directions: [0],
    //     },
    //     rage: {
    //         enabled: true,
    //         pool: 2,
    //         initial_delay: 0,
    //         cooldown: 100,
    //         switch_shooter: { enabled: false },
    //         pattern: [
    //             [0, 1, 0],
    //             [1, 0, 0],
    //             [0, 1, 0],
    //             [1, 0, 0],
    //             [0, 1, 0],
    //             [1, 0, 0],
    //         ],
    //         spreading: 0.001,
    //         directions: generateDirections(2),
    //     },
    //     // shield: { enabled: true, pool: 2 },
    //     change_behavior: { follow_player_pool: 2 },
    // },
];
