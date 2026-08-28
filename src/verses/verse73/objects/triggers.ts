import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 0.75, z: 37 },
        scale: { w: 3.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 0.75, z: 55 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 110, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 55 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 111, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 0.75, z: 55 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 155, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 80 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 210, action: "enemy", disposable: true },
    },
];
