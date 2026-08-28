export interface BoxSize {
    w: number;
    h: number;
    d: number;
}

export interface CylinderSize {
    w: number;
    h: number;
    d: number;
}

export interface PolygonSize {
    w: number;
    h: number;
    d: number;
}

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface Rotation {
    x: number;
    y: number;
    z: number;
}

export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}

export type Animation = {
    name: string;
    plane?: "xy" | "xz" | "yz";
    radius?: number;
    speed?: number;
    frames?: number;
    delay?: [number, number];
    from?: number;
    is_linear?: boolean;
    axes?: any;
    spline?: any;
    loop?: boolean;
};

interface MeshTypes {
    trigger: {
        pool: number;
        spawn: { on_start: boolean; on_update: boolean };
        dispose_pool?: number;
    };
    position: Position;
    rotation: Rotation;
    color: Color;
    solid: boolean;
    is_lava: boolean;
    disable_physics?: boolean;
    animation?: Animation;
    effective?: boolean;
    not_cast_shadow?: boolean;
    parent_name?: string;
    not_mergeable?: boolean;
}

export interface BoxShape extends MeshTypes {
    type: "box" | "box-light" | "box-dark" | "box-ui" | "box-base" | "box-invisible" | "box-lawa";
    size: BoxSize;
}

export interface CylinderShape extends MeshTypes {
    type:
        | "cylinder"
        | "cylinder-light"
        | "cylinder-dark"
        | "cylinder-base"
        | "cylinder-invisible"
        | "cylinder-transparent";
    size: CylinderSize;
}

export interface PolygonShape extends MeshTypes {
    type: "polygon" | "polygon-light" | "polygon-dark" | "polygon-invisible";
    size: PolygonSize;
    edges: number;
}

export type WallConfig = BoxShape | CylinderShape | PolygonShape;
