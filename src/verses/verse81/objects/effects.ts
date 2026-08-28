import { EffectsConfig } from "types/effects/Effects.types";

export const effects: EffectsConfig = {
    stars: {
        amount: 200,
        inner_box_size: 75,
        outer_box_size: 125,
        min_box_height: -100,
        max_box_height: 100,
    },
    wire: true,
    default: true,
};
