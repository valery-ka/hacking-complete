import { WallConfig } from "types/static/Wall.types";
import { WALLS_COLOR } from "core_constants";

const TREE_CONFIG = {
    trunk: {
        size: { w: 1, h: 4.25, d: 1 } as const,
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
    },
    foliage: {
        color: WALLS_COLOR,
        solid: true,
        is_lava: false,
        disable_physics: true,
    },
} as const;

const FOLIAGE_PARTS: Array<{
    offset: { x: number; y: number; z: number };
    size: { w: number; h: number; d: number };
}> = [
    { offset: { x: -1.16, y: 3.41, z: -1.08 }, size: { w: 3, h: 2, d: 3 } },
    { offset: { x: 0, y: 5.11, z: 0 }, size: { w: 2.5, h: 2, d: 2 } },
    { offset: { x: 0, y: 1.87, z: 0 }, size: { w: 4, h: 2, d: 4 } },
    { offset: { x: 1.32, y: 3.41, z: -0.62 }, size: { w: 3, h: 2, d: 3 } },
    { offset: { x: -0.33, y: 3.41, z: 1.77 }, size: { w: 3, h: 2, d: 3 } },
];

export function generateTree({
    trunkPosition,
    trunkRotation = { x: 0, y: 0, z: 0 },
    pool = 0,
    spawnOnStart = true,
    spawnOnUpdate = false,
}: {
    trunkPosition: { x: number; y: number; z: number };
    trunkRotation?: { x: number; y: number; z: number };
    pool?: number;
    spawnOnStart?: boolean;
    spawnOnUpdate?: boolean;
}): WallConfig[] {
    const trigger = {
        pool,
        spawn: { on_start: spawnOnStart, on_update: spawnOnUpdate },
    } as const;

    const walls: WallConfig[] = [];

    walls.push({
        trigger,
        type: "box",
        position: trunkPosition,
        size: TREE_CONFIG.trunk.size,
        rotation: trunkRotation,
        color: TREE_CONFIG.trunk.color,
        solid: TREE_CONFIG.trunk.solid,
        is_lava: TREE_CONFIG.trunk.is_lava,
    });

    for (const part of FOLIAGE_PARTS) {
        walls.push({
            trigger,
            type: "box",
            position: {
                x: trunkPosition.x + part.offset.x,
                y: trunkPosition.y + part.offset.y,
                z: trunkPosition.z + part.offset.z,
            },
            size: part.size,
            rotation: trunkRotation,
            color: TREE_CONFIG.foliage.color,
            solid: TREE_CONFIG.foliage.solid,
            is_lava: TREE_CONFIG.foliage.is_lava,
            disable_physics: TREE_CONFIG.foliage.disable_physics,
        });
    }

    return walls;
}
