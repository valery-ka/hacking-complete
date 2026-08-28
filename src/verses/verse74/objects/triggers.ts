import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 0.75, z: 28.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 28.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 11, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 0.75, z: 54.5 },
        scale: { w: 13.5, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 51, action: "wall", disposable: true },
    },

    {
        position: { x: 0, y: 0.75, z: 62 },
        scale: { w: 13.5, h: 1, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 21, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 62 },
        scale: { w: 13.5, h: 1, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 22, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 62 },
        scale: { w: 13.5, h: 1, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 23, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 0.75, z: 74.5 },
        scale: { w: 13.5, h: 1, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 77, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 0.75, z: 74.5 },
        scale: { w: 13.5, h: 1, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 77, action: "enemy", disposable: true },
    },
];
