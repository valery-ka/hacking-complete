import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: -26, y: 5.45, z: -12 },
        scale: { w: 2.5, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "enemy", disposable: true },
    },
    {
        position: { x: 26, y: 5.45, z: -12 },
        scale: { w: 2.5, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 20, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 17.15 },
        scale: { w: 21, h: 1, d: 21 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 17.15 },
        scale: { w: 21, h: 1, d: 21 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "enemy", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 17.15 },
        scale: { w: 21, h: 1, d: 21 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 40, action: "enemy", disposable: true },
    },
];
