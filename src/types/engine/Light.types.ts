import { DirectionalLight, SpotLight, HemisphericLight, PointLight } from "@babylonjs/core";

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface Target {
    x: number;
    y: number;
    z: number;
}

export type LightType = "directional" | "spot" | "hemispheric" | "point";

export interface LightConfig {
    type: LightType;
    name: string;
    intensity: number;
    position: Position;
    target: Target;
    castShadow: boolean;
    shadowType?: "static" | "dynamic";
    parentName?: string;
}

export type SupportedLight = DirectionalLight | SpotLight | HemisphericLight | PointLight;
