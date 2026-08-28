import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: -29, y: 5.45, z: 10 },
        scale: { w: 10, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "enemy", disposable: true },
    },
    {
        position: { x: 12.2, y: 5.45, z: 25 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 2, action: "enemy", disposable: true },
    },
    {
        position: { x: 12.2, y: 5.45, z: 42.5 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3, action: "wall", disposable: true },
    },
    {
        position: { x: 12.2, y: 5.45, z: 42.5 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 4, action: "enemy", disposable: true },
    },
    {
        position: { x: 12.2, y: 5.45, z: 42.5 },
        scale: { w: 15, h: 1, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 10, action: "enemy", disposable: true },
    },
];
