import { WallConfig } from "types/static/Wall.types";

import { WALLS_COLOR } from "core_constants";
import { SURFACE_SETTINGS } from "./settings";

const wall = (
    p: { x: number; y: number; z: number },
    s: { w: number; h: number; d: number },
): WallConfig => ({
    trigger: { pool: 500, spawn: { on_start: true, on_update: false } },
    type: "box",
    position: p,
    size: s,
    rotation: { x: 0, y: 0, z: 0 },
    color: WALLS_COLOR,
    solid: true,
    is_lava: false,
    // disable_physics: true,
    // not_mergeable: true,
});

const wall2 = (
    p: { x: number; y: number; z: number },
    s: { w: number; h: number; d: number },
): WallConfig => ({
    trigger: { pool: 500, spawn: { on_start: true, on_update: false } },
    type: "box-dark",
    position: p,
    size: s,
    rotation: { x: 0, y: 0, z: 0 },
    color: WALLS_COLOR,
    solid: true,
    is_lava: false,
    disable_physics: true,
});

const pooledWall = (
    p: { x: number; y: number; z: number },
    s: { w: number; h: number; d: number },
    pool: number,
): WallConfig => ({
    trigger: { pool: 0, spawn: { on_start: true, on_update: false }, dispose_pool: pool },
    type: "box",
    position: p,
    size: s,
    rotation: { x: 0, y: 0, z: 0 },
    color: WALLS_COLOR,
    solid: true,
    is_lava: false,
    // disable_physics: true,
    // not_mergeable: true,
});

export const walls: WallConfig[] = [
    wall({ x: 26.426, y: 5.45, z: 28.707 }, { w: 3.569, h: 1, d: 4.001 }),
    wall({ x: -18.808, y: 5.45, z: 20.635 }, { w: 3.899, h: 1, d: 31.091 }),
    wall({ x: 22.779, y: 5.45, z: 3.655 }, { w: 4.491, h: 1, d: 18.183 }),
    wall({ x: 22.779, y: 5.45, z: 3.655 }, { w: 4.491, h: 1, d: 18.183 }),
    wall({ x: 22.779, y: 5.45, z: 26.749 }, { w: 4.491, h: 1, d: 19.066 }),
    wall({ x: 27.061, y: 5.45, z: -32.078 }, { w: 35.585, h: 1, d: 32.614 }),
    wall({ x: 37.348, y: 5.45, z: 27.688 }, { w: 16.546, h: 1, d: 1.965 }),
    wall({ x: 13.285, y: 5.45, z: -2.357 }, { w: 15.753, h: 1, d: 6.158 }),
    wall({ x: 2.177, y: 5.45, z: 53.603 }, { w: 104.125, h: 1, d: 10 }),
    wall({ x: -12.197, y: 5.45, z: 33.375 }, { w: 23.326, h: 1, d: 5.814 }),
    wall({ x: -22.284, y: 5.45, z: 51.707 }, { w: 3.152, h: 1, d: 12.692 }),
    wall({ x: 17.702, y: 5.45, z: 33.375 }, { w: 25.526, h: 1, d: 5.814 }),
    wall({ x: 27.473, y: 5.45, z: -0.6 }, { w: 7.076, h: 1, d: 9.673 }),
    wall({ x: 41.283, y: 5.45, z: -0.6 }, { w: 6.696, h: 1, d: 9.673 }),
    wall({ x: -22.011, y: 5.45, z: 2.039 }, { w: 10.306, h: 1, d: 6.158 }),
    wall({ x: -14.265, y: 5.45, z: -2.357 }, { w: 25.804, h: 1, d: 6.158 }),
    wall({ x: -34.658, y: 5.45, z: 28.862 }, { w: 21.951, h: 1, d: 3.781 }),
    wall({ x: -31.757, y: 5.45, z: -17.22 }, { w: 31.56, h: 1, d: 2.899 }),
    wall({ x: 17.795, y: 5.45, z: -17.22 }, { w: 54.118, h: 1, d: 2.899 }),
    wall({ x: -40.761, y: 5.45, z: -33.874 }, { w: 13.672, h: 1, d: 32.117 }),
    wall({ x: -40.761, y: 5.45, z: -0.14 }, { w: 13.672, h: 1, d: 10.515 }),
    wall({ x: 49.391, y: 5.45, z: 0 }, { w: 9.687, h: 1, d: 100 }),
    wall({ x: -45.06, y: 5.45, z: 0 }, { w: 9.687, h: 1, d: 100 }),
    wall({ x: 2.177, y: 5.45, z: -53.29 }, { w: 104.125, h: 1, d: 10 }),
    wall({ x: 28.695, y: 5.45, z: 32.985 }, { w: 3.569, h: 1, d: 12.559 }),
    wall({ x: 28.695, y: 5.45, z: 50.466 }, { w: 3.569, h: 1, d: 11.936 }),
    wall({ x: -22.284, y: 5.45, z: 33.601 }, { w: 3.152, h: 1, d: 13.257 }),

    wall2({ x: 26.426, y: 6.45, z: 28.707 }, { w: 3.569, h: 1, d: 4.001 }),
    wall2({ x: -18.808, y: 6.45, z: 20.635 }, { w: 3.899, h: 1, d: 31.091 }),
    wall2({ x: 22.779, y: 6.45, z: 3.655 }, { w: 4.491, h: 1, d: 18.183 }),
    wall2({ x: 22.779, y: 6.45, z: 3.655 }, { w: 4.491, h: 1, d: 18.183 }),
    wall2({ x: 22.779, y: 6.45, z: 26.749 }, { w: 4.491, h: 1, d: 19.066 }),
    wall2({ x: 27.061, y: 6.45, z: -32.078 }, { w: 35.585, h: 1, d: 32.614 }),
    wall2({ x: 37.348, y: 6.45, z: 27.688 }, { w: 16.546, h: 1, d: 1.965 }),
    wall2({ x: 13.285, y: 6.45, z: -2.357 }, { w: 15.753, h: 1, d: 6.158 }),
    wall2({ x: 2.177, y: 6.45, z: 53.803 }, { w: 104.125, h: 10, d: 10 }),
    wall2({ x: -12.197, y: 6.45, z: 33.375 }, { w: 23.326, h: 1, d: 5.814 }),
    wall2({ x: -22.284, y: 6.45, z: 51.707 }, { w: 3.152, h: 1, d: 12.692 }),
    wall2({ x: 17.702, y: 6.45, z: 33.375 }, { w: 25.526, h: 1, d: 5.814 }),
    wall2({ x: 27.473, y: 6.45, z: -0.6 }, { w: 7.076, h: 1, d: 9.673 }),
    wall2({ x: 41.283, y: 6.45, z: -0.6 }, { w: 6.696, h: 1, d: 9.673 }),
    wall2({ x: -22.011, y: 6.45, z: 2.039 }, { w: 10.306, h: 1, d: 6.158 }),
    wall2({ x: -14.265, y: 6.45, z: -2.357 }, { w: 25.804, h: 1, d: 6.158 }),
    wall2({ x: -34.658, y: 6.45, z: 28.862 }, { w: 21.951, h: 1, d: 3.781 }),
    wall2({ x: -31.757, y: 6.45, z: -17.22 }, { w: 31.56, h: 1, d: 2.899 }),
    wall2({ x: 17.795, y: 6.45, z: -17.22 }, { w: 54.118, h: 1, d: 2.899 }),
    wall2({ x: -40.761, y: 6.45, z: -33.874 }, { w: 13.672, h: 1, d: 32.117 }),
    wall2({ x: -40.761, y: 6.45, z: -0.14 }, { w: 13.672, h: 1, d: 10.515 }),
    wall2({ x: 49.591, y: 6.45, z: 0 }, { w: 9.687, h: 10, d: 100 }),
    wall2({ x: -45.26, y: 6.45, z: 0 }, { w: 9.687, h: 10, d: 100 }),
    wall2({ x: 2.177, y: 6.45, z: -53.49 }, { w: 104.125, h: 10, d: 10 }),
    wall2({ x: 28.695, y: 6.45, z: 32.985 }, { w: 3.569, h: 1, d: 12.559 }),
    wall2({ x: 28.695, y: 6.45, z: 50.466 }, { w: 3.569, h: 1, d: 11.936 }),
    wall2({ x: -22.284, y: 6.45, z: 33.601 }, { w: 3.152, h: 1, d: 13.257 }),
    //

    // pooledWall({ x: 37.018, y: 5.7, z: -0.549 }, { w: 1.5, h: 1.5, d: 1.5 }, 10),
    // pooledWall({ x: 31.982, y: 5.7, z: -0.549 }, { w: 1.5, h: 1.5, d: 1.5 }, 10),
    // pooledWall({ x: 33.679, y: 5.7, z: -0.549 }, { w: 1.5, h: 1.5, d: 1.5 }, 10),
    // pooledWall({ x: 35.355, y: 5.7, z: -0.549 }, { w: 1.5, h: 1.5, d: 1.5 }, 10),

    // pooledWall({ x: 4.504, y: 5.7, z: -2.377 }, { w: 1.5, h: 1.5, d: 1.5 }, 20),
    // pooledWall({ x: -0.444, y: 5.7, z: -2.377 }, { w: 1.5, h: 1.5, d: 1.5 }, 20),
    // pooledWall({ x: 1.193, y: 5.7, z: -2.377 }, { w: 1.5, h: 1.5, d: 1.5 }, 20),
    // pooledWall({ x: 2.849, y: 5.7, z: -2.377 }, { w: 1.5, h: 1.5, d: 1.5 }, 20),

    // pooledWall({ x: 3.914, y: 5.7, z: 33.52 }, { w: 1.5, h: 1.5, d: 1.5 }, 30),
    // pooledWall({ x: 0.525, y: 5.7, z: 33.52 }, { w: 1.5, h: 1.5, d: 1.5 }, 30),
    // pooledWall({ x: 2.209, y: 5.7, z: 33.52 }, { w: 1.5, h: 1.5, d: 1.5 }, 30),

    // pooledWall({ x: -22.211, y: 5.7, z: 41.148 }, { w: 1.5, h: 1.5, d: 1.5 }, 40),
    // pooledWall({ x: -22.211, y: 5.7, z: 44.46 }, { w: 1.5, h: 1.5, d: 1.5 }, 40),
    // pooledWall({ x: -22.211, y: 5.7, z: 42.825 }, { w: 1.5, h: 1.5, d: 1.5 }, 40),

    // pooledWall({ x: 28.66, y: 5.7, z: 40.243 }, { w: 1.5, h: 1.5, d: 1.5 }, 50),
    // pooledWall({ x: 28.66, y: 5.7, z: 43.604 }, { w: 1.5, h: 1.5, d: 1.5 }, 50),
    // pooledWall({ x: 28.66, y: 5.7, z: 41.946 }, { w: 1.5, h: 1.5, d: 1.5 }, 50),

    // pooledWall({ x: -29.733, y: 5.7, z: 0 }, { w: 1.5, h: 1.5, d: 1.5 }, 60),
    // pooledWall({ x: -33.042, y: 5.7, z: 0 }, { w: 1.5, h: 1.5, d: 1.5 }, 60),
    // pooledWall({ x: -31.367, y: 5.7, z: 0 }, { w: 1.5, h: 1.5, d: 1.5 }, 60),
    // pooledWall({ x: -28.076, y: 5.7, z: 0 }, { w: 1.5, h: 1.5, d: 1.5 }, 60),

    // pooledWall({ x: -10.179, y: 5.7, z: -17.27 }, { w: 1.5, h: 1.5, d: 1.5 }, 70),
    // pooledWall({ x: -15.075, y: 5.7, z: -17.27 }, { w: 1.5, h: 1.5, d: 1.5 }, 70),
    // pooledWall({ x: -13.433, y: 5.7, z: -17.27 }, { w: 1.5, h: 1.5, d: 1.5 }, 70),
    // pooledWall({ x: -11.823, y: 5.7, z: -17.27 }, { w: 1.5, h: 1.5, d: 1.5 }, 70),
];
