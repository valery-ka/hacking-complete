import { CameraConfig } from "types/engine/Camera.types";
import { LightConfig } from "types/engine/Light.types";
import { ShadowsConfig } from "types/engine/Shadows.types";

import { GroundConfig } from "types/static/Ground.types";
import { WallConfig } from "types/static/Wall.types";

import { PlayerConfig } from "types/player/Player.types";
import { EnemyConfig } from "types/enemy/Enemies.types";

import { EffectsConfig } from "types/effects/Effects.types";
import { InvisibleTriggerConfig } from "types/static/InvisibleTrigger.types";

import { MusicConfig } from "types/music/MusicConfig.types";

export interface SplitScreen {
    enabled: boolean;
    type: "horizontal" | "vertical";
}

export interface PoolsByKilling {
    pool: number;
    count: number;
}

/** Controls profile ids for the menu hints: `[left, right]`. An omitted or `undefined` slot renders as `N / A`. */
export type ControlsType = [number?, number?];

/**
 * How the two control columns are arranged in the menu.
 * - `by_device` (default): gamepad row, then keyboard row
 * - `by_profile`: each row is one profile (gamepad | keyboard)
 */
export type ControlsLayout = "by_device" | "by_profile";

export interface VerseSettings {
    split_screen: SplitScreen;
    controls_type?: ControlsType;
    controls_layout?: ControlsLayout;
    start_enemy_pools: number[];
    start_walls_pools: number[];
    pools_by_killing?: PoolsByKilling[];
    emimissive_color_factor?: number;
    finish_pool: number;
    is_boss?: boolean;
    timer?: number;
    is_final_verse?: boolean;
    /** When true, finishing the verse returns to the main menu instead of the next verse. */
    return_to_menu?: boolean;
    /** Sequential voice pool id (e.g. "audio_dod2_pool"). Plays while the verse is active. */
    voice_pool?: string;
    /** Seconds between tracks (after a track ends). Default 5. */
    voice_pool_delay?: number;
}

export interface VerseConfig {
    camera: CameraConfig[];
    light: LightConfig[];
    shadows: ShadowsConfig;
    ground: GroundConfig[];
    walls: WallConfig[];
    effects: EffectsConfig;
    player: PlayerConfig[];
    enemies: EnemyConfig[];
    settings: VerseSettings;
    triggers: InvisibleTriggerConfig[];
    music?: MusicConfig;
}
