export interface MusicSettings {
    one_shot?: string;
    full?: string;
    one_shot_volume?: number;
    full_volume?: number;
}

export interface MusicFadeOutFlag {
    enabled: boolean;
    duration: number;
}

export interface MusicTransitionDurations {
    default: number;
    "8-bit"?: number;
    original?: number;
}

export type MusicTransitionDuration = number | MusicTransitionDurations;

export interface MusicLayer {
    "8-bit"?: MusicSettings;
    original?: MusicSettings;
}

export interface MusicLayers {
    bass?: MusicLayer;
    drums?: MusicLayer;
    instruments?: MusicLayer;
    vocals?: MusicLayer;
    extra_1?: MusicLayer;
    extra_2?: MusicLayer;
}

export interface MusicConfig {
    name?: string;
    play_one_shot?: boolean;
    transition_duration?: number;
    fade_out_duration?: number;
    "8_bit_fade_out"?: MusicFadeOutFlag;
    not_mute_on_pause?: boolean;
    disable_delayed_start?: boolean;
    stop_all_music_on_finish?: boolean;

    to_play_in_menu?: string;

    bass?: MusicLayer;
    drums?: MusicLayer;
    instruments?: MusicLayer;
    vocals?: MusicLayer;
    extra_1?: MusicLayer;
    extra_2?: MusicLayer;

    pause_override_layers?: MusicLayers;

    by_pools?: {
        pool: number;
        duration: number;
        layers: MusicLayers;
    }[];
}

interface StyleVolume {
    [style: string]: MusicSettings;
}

export interface CategoryVolume {
    [category: string]: StyleVolume;
}

export const MUSIC_LAYER_KEYS = [
    "bass",
    "drums",
    "instruments",
    "vocals",
    "extra_1",
    "extra_2",
] as const;

export const musicLayersToCategoryVolume = (layers: MusicLayers): CategoryVolume =>
    MUSIC_LAYER_KEYS.reduce<CategoryVolume>((acc, key) => {
        const layer = layers[key];
        if (!layer) return acc;

        acc[key] = Object.entries(layer).reduce<StyleVolume>((styles, [style, data]) => {
            styles[style] = { ...data };
            return styles;
        }, {});

        return acc;
    }, {});

export const musicConfigToCategoryVolume = (musicConfig: MusicConfig): CategoryVolume =>
    musicLayersToCategoryVolume({
        bass: musicConfig.bass,
        drums: musicConfig.drums,
        instruments: musicConfig.instruments,
        vocals: musicConfig.vocals,
        extra_1: musicConfig.extra_1,
        extra_2: musicConfig.extra_2,
    });
