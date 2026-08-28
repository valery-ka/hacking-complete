import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 5.45, z: -3.5 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 20, action: "enemy", disposable: true },
    },

    {
        position: { x: -19, y: 5.45, z: 32.07 },
        scale: { w: 4, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "wall", disposable: true },
    },
    {
        position: { x: -19, y: 5.45, z: 32.07 },
        scale: { w: 4, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "enemy", disposable: true },
    },

    {
        position: { x: 19, y: 5.45, z: 32.07 },
        scale: { w: 4, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 2, action: "wall", disposable: true },
    },
    {
        position: { x: 19, y: 5.45, z: 32.07 },
        scale: { w: 4, h: 1, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "enemy", disposable: true },
    },

    {
        position: { x: 24.5, y: 5.45, z: 50.8 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3, action: "wall", disposable: true },
    },
    {
        position: { x: 24.5, y: 5.45, z: 50.8 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 50, action: "enemy", disposable: true },
    },
    {
        position: { x: 24.5, y: 5.45, z: 50.8 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 60, action: "enemy", disposable: true },
    },
];
