import type { Scene } from "@babylonjs/core";

import { LS_KEYS } from "core_constants";
import type { Nullable } from "types/common";

export type PhysicsSubstepsSetting = "ON" | "OFF";

const SUBSTEP_MS = 1000 / 165;

const hasStorage = () => typeof localStorage !== "undefined";

export const getPhysicsSubstepsSetting = (): PhysicsSubstepsSetting =>
    hasStorage() && localStorage.getItem(LS_KEYS.PHYSICS_SUBSTEPS) === "ON" ? "ON" : "OFF";

export const setPhysicsSubstepsSetting = (setting: PhysicsSubstepsSetting) => {
    if (!hasStorage()) return;
    localStorage.setItem(LS_KEYS.PHYSICS_SUBSTEPS, setting);
};

export const applyPhysicsSubsteps = (scene: Nullable<Scene> | undefined) => {
    const physics = scene?.getPhysicsEngine();
    if (!physics) return;

    physics.setSubTimeStep(getPhysicsSubstepsSetting() === "ON" ? SUBSTEP_MS : 0);
};
