import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 17, y: 0, z: 6.25 },
        scale: { w: 5, h: 25, d: 10 },
        rotation: { x: 0, y: -20, z: 0 },
        trigger: { pool: 1, action: "enemy", disposable: true },
    },
    {
        position: { x: -18.85, y: 0, z: -1.35 },
        scale: { w: 5, h: 25, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 2, action: "enemy", disposable: true },
    },
];
