import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 17.5, y: 11, z: 0 },
        scale: { w: 6, h: 1.5, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 30, action: "enemy", disposable: true },
    },
    {
        position: { x: 17.5, y: 11, z: 0 },
        scale: { w: 6, h: 1.5, d: 2 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 31, action: "enemy", disposable: true },
    },
];
