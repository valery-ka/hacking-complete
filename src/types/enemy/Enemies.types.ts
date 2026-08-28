import { EnemyAnimation } from "types/animations/Animations.types";

export interface Position {
    x?: number;
    y?: number;
    z?: number;
    long?: number; // longitude (cylinder / sphere)
    lat?: number; // latitude (sphere)
    h?: number; // height (cylinder)
}

export interface FollowPlayer {
    enabled: boolean;
    speed?: number;
}

export interface RotateToPlayer {
    enabled: boolean;
    angular_speed?: number;
}

export interface AutoRotation {
    enabled: boolean;
    angular_speed?: number;
}

export interface IEnemyShooter {
    pool?: number;
    enabled: boolean;
    disabled_on_start?: boolean;
    initial_delay?: number;
    cooldown?: number;
    cooldown_dynamic?: number[];
    switch_shooter?: { enabled: boolean; delay?: [number, number] };
    pattern?: [number, number, number][];
    spreading?: number;
    directions?: number[];
}

export interface RocketLauncher {
    enabled: boolean;
    cooldown: number;
}

export interface IChangeBehavior {
    auto_rotation_pool?: number;
    rotate_to_player_pool?: number;
    follow_player_pool?: number;
}

export interface IPingPong {
    enabled: boolean;
}

export interface IToggleFollowRotation {
    enabled: boolean;
    follow: { from: number; to: number };
    rotation: { from: number; to: number };
}

export interface IBox {
    w: number;
    h: number;
    d: number;
}

export interface IAoe {
    type: "steal-fps" | "speed-down-player" | "speed-up-world" | "player-shoot-overheat";
    radius: number;
}

export const ENEMY_TYPES = [
    "sphere",
    "sphere-bomb",
    "cylinder",
    "cylinder-bomb",
    "cylinder-shield",
    "arrow",
    "arrow-shield",
    "arrow-shield-2",
    "arrow-shield-3",
    "rocket",
    "box",
    "rabbit",
    "cheer",
    "kamikaze",
    "simone",
    "shadowlord",
    "zero",
    "manah",
    "queen",
] as const;

export type EnemyType = (typeof ENEMY_TYPES)[number];

export interface EnemyConfig {
    enemy_type: EnemyType;
    scale_hp_by_difficulty?: boolean;
    trigger: { pool: { self: number; to_trigger?: null | number | number[] } };
    on_spawn: {
        position: Position;
        rotation_y: number;
        hp: number;
        spawn_animation?: boolean;
        box?: IBox;
        delay?: number;
    };
    triggers_by_player: [boolean, boolean];
    follow_player: FollowPlayer;
    rotate_to_player: RotateToPlayer;
    auto_rotation: AutoRotation;
    animation: EnemyAnimation;
    shooter: IEnemyShooter;
    rage?: IEnemyShooter;
    rocket_launcher?: RocketLauncher;
    ground: {
        id: number;
        physics: "plane" | "sphere" | "cylinder" | "none";
        size: number | { d: number; h: number };
        dont_correct_hover?: boolean;
    };
    is_inside_ground: boolean;
    /** If set: true = always autoaimable, false = never. If omitted, default filters apply. */
    autoaimable?: boolean;
    shield?: { enabled: boolean; pool: number };
    change_behavior?: IChangeBehavior;
    ping_pong?: IPingPong;
    toggle_follow_rotation?: IToggleFollowRotation;
    reflection?: { enabled: boolean; by_hp: boolean; time: number };
    is_miner?: boolean;
    metadata?: any;
    aoe?: IAoe;
    sounds?: {
        on_spawn?: { engine: "enemy" | "voice"; sound: string[] };
        on_damage?: { engine: "enemy" | "voice"; sound: string[] };
        while_alive?: { engine: "enemy" | "voice"; sound: string[] };
        on_death?: { engine: "enemy" | "voice"; sound: string[] };
    }
}
