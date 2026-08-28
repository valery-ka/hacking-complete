import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 0.75, z: -4 + 22.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: -4 + 36.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 20, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: -4 + 50.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 0.75, z: 72.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 72.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 72.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 41, action: "enemy", disposable: true },
    },
];
