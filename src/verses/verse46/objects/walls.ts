import { WallConfig } from "types/static/Wall.types";

const DEFAULT_BOX_SIZE = 1.5;
const DEFAULT_CYLINDER_SIZE = 2;

const radToDeg = (rad: number) => (rad * 180) / Math.PI;

export function generateWallFromPattern({
    pattern,
    center,
    type = "box-dark",
    step = 1.65,
    rotationY = -Math.PI / 2,
    boxSize = { w: DEFAULT_BOX_SIZE, h: DEFAULT_BOX_SIZE, d: DEFAULT_BOX_SIZE },
    baseConfig = {
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
}: {
    pattern: string[];
    center: { x: number; y: number; z: number };
    type?: string;
    step?: number;
    rotationY?: number;
    boxSize?: { w: number; h: number; d: number };
    baseConfig?: any;
}) {
    const result: any[] = [];

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
                ...baseConfig,
                type: type,
                position: {
                    x: center.x + rotatedX,
                    y: center.y,
                    z: center.z + rotatedZ,
                },
                rotation: {
                    ...(baseConfig.rotation ?? { x: 0, y: 0, z: 0 }),
                    y: (baseConfig.rotation?.y ?? 0) + radToDeg(rotationY),
                },
                size: boxSize,
            });
        }
    }

    return result;
}

export function generateMultiLayerWall({
    pattern,
    center,
    type,
    step,
    layers,
    layerStep,
    size = null,
}: any) {
    const half = (layers - 1) / 2;

    return Array.from({ length: layers }).flatMap((_, i) =>
        generateWallFromPattern({
            pattern,
            type,
            step,
            boxSize: size ?? {
                w: DEFAULT_CYLINDER_SIZE,
                h: DEFAULT_CYLINDER_SIZE * 1.75,
                d: DEFAULT_CYLINDER_SIZE,
            },
            center: {
                x: center.x,
                y: center.y + (i - half) * layerStep,
                z: center.z,
            },
        }),
    );
}

export function generateMultiLayerWallRow({
    pattern,
    type,
    step,
    center,
    layers,
    layerStep,
    count,
    axisStep,
    axis,
    size,
}: any) {
    const half = (count - 1) / 2;

    return Array.from({ length: count }).flatMap((_, i) => {
        const offset = (i - half) * axisStep;

        return generateMultiLayerWall({
            pattern,
            type,
            step,
            layers,
            layerStep,
            center: {
                x: axis === "x" ? center.x + offset : center.x,
                y: center.y,
                z: axis === "z" ? center.z + offset : center.z,
            },
            size,
        });
    });
}

export const walls: WallConfig[] = [
    {
        type: "box-dark",
        position: { x: -3.6, y: 3, z: 82 },
        size: { w: 22.2, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: -3.6, y: -2, z: 82 },
        size: { w: 22.2, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: -3.6, y: -7, z: 82 },
        size: { w: 22.2, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-ui",
        position: { x: 0, y: 3, z: -3 },
        size: { w: 15, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -2, z: -3 },
        size: { w: 15, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -7, z: -3 },
        size: { w: 15, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-ui",
        position: { x: 0, y: 3, z: -85 },
        size: { w: 15, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -2, z: -85 },
        size: { w: 15, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-ui",
        position: { x: 0, y: -7, z: -85 },
        size: { w: 15, h: 4, d: 69 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-dark",
        position: { x: 0, y: 5.7, z: -58.37 },
        size: { w: 6.75, h: 1.5, d: 6.75 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: true,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-base",
        position: { x: -12, y: -10.9, z: -3 },
        size: { w: 69, h: 4, d: 250 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    // UI

    {
        type: "box-dark",
        position: { x: -15, y: 4, z: -3 },
        size: { w: 0.75, h: 2, d: 230 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: -15, y: -1, z: -3 },
        size: { w: 0.75, h: 2, d: 230 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: -15, y: -6, z: -3 },
        size: { w: 0.75, h: 2, d: 230 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0, g: 0, b: 0, a: 0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    ...generateMultiLayerWallRow({
        pattern: [" * ", "* *"],
        type: "cylinder-dark",
        step: 2,

        center: { x: -20, y: -3, z: -3 },

        layers: 3,
        layerStep: 5,

        count: 6,
        axisStep: 25,
        axis: "z",
    }),

    ...generateMultiLayerWallRow({
        pattern: [" * "],
        type: "box-dark",
        step: 2,

        center: { x: -16, y: -1, z: -3 },
        size: { w: 3.5, h: 2, d: 1.5 },

        layers: 3,
        layerStep: 5,

        count: 5,
        axisStep: 25,
        axis: "z",
    }),

    // cell

    {
        type: "box-invisible",
        position: { x: 0, y: 5.5, z: -38.5 },
        size: { w: 20, h: 3, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 5.5, z: 32.5 },
        size: { w: 20, h: 3, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: -8.5, y: 5.5, z: -3 },
        size: { w: 2, h: 3, d: 75 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 8.5, y: 5.5, z: -3 },
        size: { w: 2, h: 3, d: 75 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
];
