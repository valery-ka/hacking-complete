export interface StarsConfig {
    amount: number;
    inner_box_size: number;
    outer_box_size: number;
    min_box_height: number;
    max_box_height: number;
}

export interface EffectsConfig {
    stars: StarsConfig;
    wire?: boolean;
    default?: boolean;
    environment?: { pool: number, color: string };
}
