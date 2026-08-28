import { Scene } from "@babylonjs/core";

import { LS_KEYS } from "core_constants";
import { EnemyType } from "types/enemy/Enemies.types";
import type { Nullable } from "types/common";

export type AutoAimDifficulty = "Easy" | "Normal";

const BOSS_ENEMY_TYPES: ReadonlySet<EnemyType> = new Set([
    "simone",
    "shadowlord",
    "zero",
    "manah",
    "queen",
    "box"
]);

export const getAutoAimDifficulty = (): AutoAimDifficulty => {
    const raw = localStorage.getItem(LS_KEYS.DIFFICULTY);

    if (raw === "Easy" || raw === "ON") return "Easy";
    if (raw === "Normal" || raw === "OFF") return "Normal";

    return "Normal";
};

export const isEasyDifficulty = () => getAutoAimDifficulty() === "Easy";

export const getScaledEnemyHp = (
    hp: number,
    enemyType: EnemyType,
    scaleByDifficulty = true,
) => {
    if (!scaleByDifficulty || !isEasyDifficulty() || BOSS_ENEMY_TYPES.has(enemyType)) return hp;
    return Math.ceil(hp / 2);
};

/**
 * Auto-aim HUD is only shown while the player is actually in control.
 * Call with `false` before pause / death / verse switch UIs appear.
 */
export const setAutoAimUIVisible = (scene: Nullable<Scene> | undefined, visible: boolean) => {
    scene?.metadata?.callbacks?.set_auto_aim_ui_visible?.(visible);
};

export const isAimAssistActive = (scene: Scene, configAimAssist?: boolean) => {
    if (configAimAssist !== undefined) return configAimAssist;
    if (!isEasyDifficulty()) return false;

    if (typeof scene.metadata?.auto_aim_enabled === "boolean") {
        return scene.metadata.auto_aim_enabled;
    }

    return false;
};
