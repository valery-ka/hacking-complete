import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 5.45, z: 33.6 },
        scale: { w: 20, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "wall", disposable: true },
    },

    {
        position: { x: -12.5, y: 5.45, z: 39.75 },
        scale: { w: 5, h: 1, d: 20 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 101, action: "enemy", disposable: true },
    },

    {
        position: { x: 50.25, y: 5.45, z: 52.75 },
        scale: { w: 5, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 50, action: "wall", disposable: true },
    },

    {
        position: { x: 50.25, y: 5.45, z: 69 },
        scale: { w: 5, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 500, action: "enemy", disposable: true },
    },

    {
        position: { x: 73.45, y: 5.45, z: 103.7 },
        scale: { w: 22, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 500, action: "camera", disposable: true },
    },
    {
        position: { x: 73.45, y: 5.45, z: 103.7 },
        scale: { w: 22, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 666, action: "wall", disposable: true },
    },
];
