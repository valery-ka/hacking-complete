import { EffectsConfig } from "types/effects/Effects.types";

export const effects: EffectsConfig = {
    stars: {
        amount: 200,
        inner_box_size: 20,
        outer_box_size: 200,
        min_box_height: -100,
        max_box_height: 100,
    },
    environment: {
        pool: 100,
        color: "#ffff00",
    },
};
