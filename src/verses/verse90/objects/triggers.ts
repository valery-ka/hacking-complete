import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    // {
    //     position: { x: 0, y: 5, z: 4 },
    //     scale: { w: 16, h: 1.5, d: 8 },
    //     rotation: { x: 0, y: 0, z: 0 },
    //     trigger: { pool: 1, action: "enemy", disposable: true },
    // },
    // {
    //     position: { x: 0, y: 5, z: 4 },
    //     scale: { w: 16, h: 1.5, d: 8 },
    //     rotation: { x: 0, y: 0, z: 0 },
    //     trigger: { pool: 5, action: "enemy", disposable: true },
    // },
    {
        position: { x: 0, y: 5, z: 12.5 },
        scale: { w: 16, h: 1.5, d: 8 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5, z: 24 },
        scale: { w: 16, h: 1.5, d: 32 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "camera", disposable: false },
    },
];
