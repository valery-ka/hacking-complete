import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

export const triggers: InvisibleTriggerConfig[] = [
    {
        position: { x: 17, y: 4, z: 20 },
        scale: { w: 25, h: 10, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 1, action: "camera", disposable: true },
    },
    {
        position: { x: 5, y: 4, z: 60 },
        scale: { w: 25, h: 10, d: 10 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 2, action: "camera", disposable: true },
    },

    {
        position: { x: 0, y: 4, z: 80 },
        scale: { w: 25, h: 10, d: 5 },
        rotation: { x: 0, y: 0, z: 0 },
        trigger: { pool: 999, action: "enemy", disposable: true },
    },
];
