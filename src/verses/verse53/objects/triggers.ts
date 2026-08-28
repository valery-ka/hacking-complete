import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 21.85, y: 5.45, z: -3.8 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "enemy", disposable: true },
    },
    {
        position: { x: 21.85, y: 5.45, z: -3.8 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 2, action: "enemy", disposable: true },
    },

    {
        position: { x: 7, y: 5.45, z: -11.5 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3, action: "enemy", disposable: true },
    },

    {
        position: { x: -8.75, y: 5.45, z: -2 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 4, action: "enemy", disposable: true },
    },
    {
        position: { x: -8.75, y: 5.45, z: -2 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 6, action: "enemy", disposable: true },
    },

    {
        position: { x: -23.63, y: 5.45, z: -11.75 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 7, action: "enemy", disposable: true },
    },

    {
        position: { x: -23.63, y: 5.45, z: -1.5 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 8, action: "enemy", disposable: true },
    },

    {
        position: { x: -23.63, y: 5.45, z: 9 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 9, action: "enemy", disposable: true },
    },

    {
        position: { x: -23.63, y: 5.45, z: 19.5 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "wall", disposable: true },
    },
    {
        position: { x: -23.63, y: 5.45, z: 19.5 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 80, action: "enemy", disposable: true },
    },
    {
        position: { x: -23.63, y: 5.45, z: 19.5 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 90, action: "enemy", disposable: true },
    },
];
