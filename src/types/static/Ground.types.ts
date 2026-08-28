export interface BoxSize {
    w: number;
    h: number;
    d: number;
}

export interface CylinderSize {
    h: number;
    d: number;
}

export interface PolygonSize {
    h: number;
    d: number;
}

export interface SphereSize {
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

interface MeshTypes {
    position: Position;
    rotation: Rotation;
    color: Color;
    disabled?: boolean;
    disable_receive_shadows?: boolean;
}

export interface BoxShape extends MeshTypes {
    type: "box";
    size: BoxSize;
}

export interface CylinderShape extends MeshTypes {
    type: "cylinder";
    size: CylinderSize;
}

export interface DodecagonShape extends MeshTypes {
    type: "dodecagon";
    size: CylinderSize;
}

export interface PolygonShape extends MeshTypes {
    type: "polygon";
    size: PolygonSize;
    edges: number;
}

export interface SphereShape extends MeshTypes {
    type: "sphere";
    size: SphereSize;
    subdivisions: number;
}

export type GroundConfig = BoxShape | CylinderShape | PolygonShape | SphereShape | DodecagonShape;
