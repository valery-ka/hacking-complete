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

export function generateMultiLayerWall({ pattern, center, type, step, layers, layerStep }: any) {
    const half = (layers - 1) / 2;

    return Array.from({ length: layers }).flatMap((_, i) =>
        generateWallFromPattern({
            pattern,
            type,
            step,
            boxSize: {
                w: 1.75,
                h: DEFAULT_CYLINDER_SIZE,
                d: 1.75,
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
        });
    });
}

export const walls: WallConfig[] = [
    {
        type: "box",
        position: { x: 20, y: 0, z: 0 },
        size: { w: 0.5, h: 10, d: 124 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    // Fleeting words :')

    ...generateWallFromPattern({
        pattern: ["*****", "*   *", "*   *", "*   *", "*****"],
        center: { x: 13.75, y: 4.25, z: -55 },
    }),
    ...generateWallFromPattern({
        pattern: ["*****", "* *  ", "* *  ", "* *  ", "* *  "],
        center: { x: 13.75, y: 4.25, z: -45 },
    }),
    ...generateWallFromPattern({
        pattern: ["  *  ", " * * ", "*   *", "*   *", "*****"],
        center: { x: 13.75, y: 4.25, z: -35 },
    }),

    //
    ...generateWallFromPattern({
        pattern: [" *** ", "*   *", "*     ", "*   *", " *** "],
        center: { x: 13.75, y: 4.25, z: -15 },
    }),
    ...generateWallFromPattern({
        pattern: ["  *  ", " * * ", "*   *", "*   *", "*****"],
        center: { x: 13.75, y: 4.25, z: -5 },
    }),
    ...generateWallFromPattern({
        pattern: ["  *  ", "   * ", "*****", " *   ", "  *  "],
        center: { x: 13.75, y: 4.25, z: 5 },
    }),
    ...generateWallFromPattern({
        pattern: ["  *  ", "   * ", "*****", " *   ", "  *  "],
        center: { x: 13.75, y: 4.25, z: 15 },
    }),

    //

    ...generateWallFromPattern({
        pattern: ["*   *", "** * ", "* *  ", "*  * ", "*   *"],
        center: { x: 13.75, y: 4.25, z: 45 },
    }),
    ...generateWallFromPattern({
        pattern: ["*****", "* *  ", "* *  ", "* *  ", "* *  "],
        center: { x: 13.75, y: 4.25, z: 55 },
    }),

    //
    ...generateWallFromPattern({
        pattern: ["*****", "* *  ", "* *  ", "* *  ", "* *  "],
        center: { x: 30, y: 4.25, z: 25 },
    }),
    ...generateWallFromPattern({
        pattern: ["*****", "* *  ", "* *  ", "* *  ", "* *  "],
        center: { x: 30, y: 4.25, z: 35 },
    }),
    ...generateWallFromPattern({
        pattern: ["  *  ", "   * ", "*****", " *   ", "  *  "],
        center: { x: 30, y: 4.25, z: 45 },
    }),
    ...generateWallFromPattern({
        pattern: [" *** ", "*   *", "*  * ", " *   ", "  *  "],
        center: { x: 30, y: 4.25, z: 55 },
    }),

    ...generateWallFromPattern({
        pattern: ["*   *", "** * ", "* *  ", "*  * ", "*   *"],
        center: { x: 40, y: 4.25, z: 35 },
    }),
    ...generateWallFromPattern({
        pattern: ["*****", "* *  ", "* *  ", "* *  ", "* *  "],
        center: { x: 40, y: 4.25, z: 45 },
    }),

    ...generateWallFromPattern({
        pattern: [" *** ", "*   *", "*  * ", " *   ", "  *  "],
        center: { x: 50, y: 4.25, z: 30 },
    }),
    ...generateWallFromPattern({
        pattern: ["  *  ", "   * ", "*****", " *   ", "  *  "],
        center: { x: 50, y: 4.25, z: 40 },
    }),
    ...generateWallFromPattern({
        pattern: ["*****", "*   *", "*   *", " * * ", "  *  "],
        center: { x: 50, y: 4.25, z: 50 },
    }),

    ...generateWallFromPattern({
        pattern: ["*   *", "*   *", " * * ", " * * ", "  *  "],
        center: { x: 35, y: 4.25, z: -45 },
    }),

    ...generateWallFromPattern({
        pattern: ["  ** ", "  * *", "  *  ", "  *  ", "  *  "],
        center: { x: 45, y: 4.25, z: -50 },
    }),
    ...generateWallFromPattern({
        pattern: ["*****", "*   *", "*   *", "*   *", "*****"],
        center: { x: 45, y: 4.25, z: -40 },
    }),

    // UI

    ...generateMultiLayerWallRow({
        pattern: ["* *", " * "],
        type: "cylinder-dark",
        step: 2,

        center: { x: -50, y: -0.5, z: 0 },

        layers: 3,
        layerStep: 3,

        count: 13,
        axisStep: 10,
        axis: "z",
    }),

    {
        type: "box-light",
        position: { x: -60, y: 5, z: 0 },
        size: { w: 0.5, h: 20, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },
    {
        type: "box-dark",
        position: { x: -55, y: 0, z: 0 },
        size: { w: 0.5, h: 10, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-dark",
        position: { x: -52.5, y: 1.5, z: 0 },
        size: { w: 5, h: 0.5, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    {
        type: "box-dark",
        position: { x: -52.5, y: -1.5, z: 0 },
        size: { w: 5, h: 0.5, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
        disable_physics: true,
    },

    // cell

    {
        type: "box-invisible",
        position: { x: -6.75, y: 0, z: 0 },
        size: { w: 1.0, h: 20, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 6.75, y: 0, z: 0 },
        size: { w: 1.0, h: 20, d: 150 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 0, z: -63 },
        size: { w: 20.0, h: 20, d: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
    {
        type: "box-invisible",
        position: { x: 0, y: 0, z: 63 },
        size: { w: 20.0, h: 20, d: 1.0 },
        rotation: { x: 0, y: 0, z: 0 },
        color: { r: 0.55, g: 0.52, b: 0.43, a: 1.0 },
        trigger: { pool: 0, spawn: { on_start: true, on_update: false } },
        solid: false,
        is_lava: false,
    },
];
