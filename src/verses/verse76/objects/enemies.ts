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
                    spawn_animation: true,
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
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 6 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 8 },
    }),
    ...createBoxLine({
        pattern: ["**** "],
        center: { x: 0, y: 1.125, z: 10 },
    }),
    ...createBoxLine({
        pattern: [" * **"],
        center: { x: 0, y: 1.125, z: 12 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 14 },
    }),
    ...createBoxLine({
        pattern: ["** **"],
        center: { x: 0, y: 1.125, z: 16 },
    }),
    ...createBoxLine({
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 18 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 20 },
    }),
    ...createBoxLine({
        pattern: ["*****"],
        center: { x: 0, y: 1.125, z: 22 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 24 },
    }),
    ...createBoxLine({
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 26 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 28 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 30 },
    }),
    ...createBoxLine({
        pattern: [" *** "],
        center: { x: 0, y: 1.125, z: 32 },
    }),
    ...createBoxLine({
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 34 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 36 },
    }),
    ...createBoxLine({
        pattern: ["**** "],
        center: { x: 0, y: 1.125, z: 38 },
    }),
    ...createBoxLine({
        pattern: [" * **"],
        center: { x: 0, y: 1.125, z: 40 },
    }),
    ...createBoxLine({
        pattern: ["*****"],
        center: { x: 0, y: 1.125, z: 42 },
    }),
    ...createBoxLine({
        pattern: ["** **"],
        center: { x: 0, y: 1.125, z: 44 },
    }),
    ...createBoxLine({
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 46 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 48 },
    }),
    ...createBoxLine({
        pattern: ["   **"],
        center: { x: 0, y: 1.125, z: 50 },
    }),
    ...createBoxLine({
        pattern: ["*****"],
        center: { x: 0, y: 1.125, z: 52 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 54 },
    }),
    ...createBoxLine({
        pattern: ["*  **"],
        center: { x: 0, y: 1.125, z: 56 },
    }),
    ...createBoxLine({
        pattern: ["* ***"],
        center: { x: 0, y: 1.125, z: 58 },
    }),
    ...createBoxLine({
        pattern: ["*** *"],
        center: { x: 0, y: 1.125, z: 60 },
    }),
    ...createBoxLine({
        pattern: ["  ** "],
        center: { x: 0, y: 1.125, z: 62 },
    }),

    {
        trigger: { pool: { self: 900, to_trigger: 1000 } },
        enemy_type: "sphere",
        on_spawn: { position: { x: 0, y: 1.125, z: 66 }, rotation_y: Math.PI, hp: 5 },
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
