import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 5.45, z: -18 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 8 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 2, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 36 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 61 },
        scale: { w: 15, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 4, action: "enemy", disposable: true },
    },
    // final room
    {
        position: { x: 0, y: 5.45, z: 98.5 },
        scale: { w: 45, h: 1, d: 45 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 50, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 98.5 },
        scale: { w: 45, h: 1, d: 45 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 50, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 98.5 },
        scale: { w: 45, h: 1, d: 45 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 60, action: "enemy", disposable: true },
    },
];
