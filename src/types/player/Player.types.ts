interface Position {
    x?: number;
    y?: number;
    z?: number;
    long?: number; // longitude (cylinder / sphere)
    lat?: number; // latitude (sphere)
    h?: number; // height (cylinder)
}

export interface PlayerConfig {
    id: number;
    type: "light" | "dark" | "god";
    start_position: Position;
    start_rotation?: number;
    camera: { id: number; type: "follow" | "fixed" };
    ground: {
        id: number;
        physics: "plane" | "sphere" | "cylinder";
        size: number | { d: number; h: number };
    };
    is_inside_ground: boolean;
    hover_factor: number;
    controls: {
        hand: "left" | "right";
        inverted_xy: [boolean, boolean];
        inverted_fr?: boolean;
        inverted_rot: boolean;
        manual_rot?: number;
        fix_cylinder_rotation?: boolean;
        lock_rotation?: boolean;
    };
    shooter_bullets: "light" | "dark" | "god";
    aim_assist?: boolean;
    throughable?: boolean;
}
