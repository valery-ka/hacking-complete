import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 0, y: 5.45, z: 1.75 },
        scale: { w: 7, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: 1.75 + 13 },
        scale: { w: 7, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 2, action: "enemy", disposable: true },
    },

    {
        position: { x: 0, y: 5.45, z: 1.75 + 26 },
        scale: { w: 7, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3, action: "wall", disposable: true },
    },
    {
        position: { x: 0, y: 5.45, z: 1.75 + 26 },
        scale: { w: 7, h: 1, d: 3 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 3, action: "enemy", disposable: true },
    },
];
