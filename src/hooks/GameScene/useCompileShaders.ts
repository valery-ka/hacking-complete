import { useEffect } from "react";

import { Effect } from "@babylonjs/core";
import * as SHADERS from "shaders";

export const useCompileShaders = () => {
    useEffect(() => {
        // effects
        Effect.ShadersStore["gridOverlayFragmentShader"] = SHADERS.GRID_SHADER;
        Effect.ShadersStore["distortionFragmentShader"] = SHADERS.DISTORTION_SHADER;
        Effect.ShadersStore["pixelationFragmentShader"] = SHADERS.PIXELATION_SHADER;
        Effect.ShadersStore["toneFragmentShader"] = SHADERS.TONE_SHADER;
        Effect.ShadersStore["shatteringFragmentShader"] = SHADERS.SHATTER_SHADER;
        Effect.ShadersStore["glitch00FragmentShader"] = SHADERS.GLITCH_2_BY_COOLOK;
        Effect.ShadersStore["glitch01FragmentShader"] = SHADERS.HEX_GLITCH_BY_IGNEUS;
        Effect.ShadersStore["glitch02FragmentShader"] = SHADERS.VIDEO_GLITCH_BY_DYVOID;
        Effect.ShadersStore["negativeFragmentShader"] = SHADERS.NEGATIVE_SHADER;
        Effect.ShadersStore["squareShatterFragmentShader"] = SHADERS.SQUARE_SHATTER_SHADER;
        Effect.ShadersStore["transitionFragmentShader"] = SHADERS.TRANSITION_SHADER;
        Effect.ShadersStore["customRadialBlurFragmentShader"] = SHADERS.RADIAL_BLUR_SHADER;
        Effect.ShadersStore["customRgbFragmentShader"] = SHADERS.RGB_SHADER;

        // nodes effects
        Effect.ShadersStore["ringEffectVertexShader"] = SHADERS.RING_EFFECT_VX;
        Effect.ShadersStore["ringEffectFragmentShader"] = SHADERS.RING_EFFECT_FX;

        Effect.ShadersStore["playerBulletHitsWallVertexShader"] =
            SHADERS.PLAYER_BULLET_HITS_WALL_VX;
        Effect.ShadersStore["playerBulletHitsWallFragmentShader"] =
            SHADERS.PLAYER_BULLET_HITS_WALL_FX;

        Effect.ShadersStore["squaresFromCenterVertexShader"] = SHADERS.SQUARES_FROM_CENTER_VX;
        Effect.ShadersStore["squaresFromCenterFragmentShader"] = SHADERS.SQUARES_FROM_CENTER_FX;

        Effect.ShadersStore["playerAndEnemyBulletsCollideVertexShader"] =
            SHADERS.PLAYER_AND_ENEMY_BULLETS_COLLIDE_VX;
        Effect.ShadersStore["playerAndEnemyBulletsCollideFragmentShader"] =
            SHADERS.PLAYER_AND_ENEMY_BULLETS_COLLIDE_FX;

        Effect.ShadersStore["paebcRingVertexShader"] = SHADERS.PAEBC_RING_VX;
        Effect.ShadersStore["paebcRingFragmentShader"] = SHADERS.PAEBC_RING_FX;

        Effect.ShadersStore["playerBulletHitsShieldVertexShader"] =
            SHADERS.PLAYER_BULLET_HITS_SHIELD_VX;
        Effect.ShadersStore["playerBulletHitsShieldFragmentShader"] =
            SHADERS.PLAYER_BULLET_HITS_SHIELD_FX;

        Effect.ShadersStore["playerBulletHitsShieldPlaneVertexShader"] =
            SHADERS.PLAYER_BULLET_HITS_SHIELD_PLANE_VX;
        Effect.ShadersStore["playerBulletHitsShieldPlaneFragmentShader"] =
            SHADERS.PLAYER_BULLET_HITS_SHIELD_PLANE_FX;

        Effect.ShadersStore["enemySpawnGroundVertexShader"] = SHADERS.ENEMY_SPAWN_GROUND_VX;
        Effect.ShadersStore["enemySpawnGroundFragmentShader"] = SHADERS.ENEMY_SPAWN_GROUND_FX;

        Effect.ShadersStore["enemySpawnCircleVertexShader"] = SHADERS.ENEMY_SPAWN_CIRCLE_VX;
        Effect.ShadersStore["enemySpawnCircleFragmentShader"] = SHADERS.ENEMY_SPAWN_CIRCLE_FX;

        Effect.ShadersStore["enemyDestroyGroundVertexShader"] = SHADERS.ENEMY_DESTROY_GROUND_VX;
        Effect.ShadersStore["enemyDestroyGroundFragmentShader"] = SHADERS.ENEMY_DESTROY_GROUND_FX;

        Effect.ShadersStore["enemyDestroyPlaneVertexShader"] = SHADERS.ENEMY_DESTROY_PLANE_VX;
        Effect.ShadersStore["enemyDestroyPlaneFragmentShader"] = SHADERS.ENEMY_DESTROY_PLANE_FX;

        Effect.ShadersStore["enemyDestroySparklesVertexShader"] = SHADERS.ENEMY_DESTROY_SPARKLES_VX;
        Effect.ShadersStore["enemyDestroySparklesFragmentShader"] =
            SHADERS.ENEMY_DESTROY_SPARKLES_FX;

        Effect.ShadersStore["enemyDestroyTexturesVertexShader"] = SHADERS.ENEMY_DESTROY_TEXTURES_VX;
        Effect.ShadersStore["enemyDestroyTexturesFragmentShader"] =
            SHADERS.ENEMY_DESTROY_TEXTURES_FX;

        Effect.ShadersStore["coreDestroySquaresVertexShader"] = SHADERS.CORE_DESTROY_SQUARES_VX;
        Effect.ShadersStore["coreDestroySquaresFragmentShader"] = SHADERS.CORE_DESTROY_SQUARES_FX;

        Effect.ShadersStore["coreDestroyCircleVertexShader"] = SHADERS.CORE_DESTROY_CIRCLE_VX;
        Effect.ShadersStore["coreDestroyCircleFragmentShader"] = SHADERS.CORE_DESTROY_CIRCLE_FX;

        Effect.ShadersStore["coreDestroyRingVertexShader"] = SHADERS.CORE_DESTROY_RING_VX;
        Effect.ShadersStore["coreDestroyRingFragmentShader"] = SHADERS.CORE_DESTROY_RING_FX;

        Effect.ShadersStore["coreDestroyBoardVertexShader"] = SHADERS.CORE_DESTROY_BOARD_VX;
        Effect.ShadersStore["coreDestroyBoardFragmentShader"] = SHADERS.CORE_DESTROY_BOARD_FX;

        Effect.ShadersStore["playerDamageRingsVertexShader"] = SHADERS.PLAYER_DAMAGE_RINGS_VX;
        Effect.ShadersStore["playerDamageRingsFragmentShader"] = SHADERS.PLAYER_DAMAGE_RINGS_FX;

        Effect.ShadersStore["playerDamageGroundVertexShader"] = SHADERS.PLAYER_DAMAGE_GROUND_VX;
        Effect.ShadersStore["playerDamageGroundFragmentShader"] = SHADERS.PLAYER_DAMAGE_GROUND_FX;

        Effect.ShadersStore["playerDamageRedCircleVertexShader"] =
            SHADERS.PLAYER_DAMAGE_RED_CIRCLE_VX;
        Effect.ShadersStore["playerDamageRedCircleFragmentShader"] =
            SHADERS.PLAYER_DAMAGE_RED_CIRCLE_FX;

        Effect.ShadersStore["playerDestroySparklesVertexShader"] =
            SHADERS.PLAYER_DESTROY_SPARKLES_VX;
        Effect.ShadersStore["playerDestroySparklesFragmentShader"] =
            SHADERS.PLAYER_DESTROY_SPARKLES_FX;

        Effect.ShadersStore["playerDestroyBloomVertexShader"] = SHADERS.PLAYER_DESTROY_BLOOM_VX;
        Effect.ShadersStore["playerDestroyBloomFragmentShader"] = SHADERS.PLAYER_DESTROY_BLOOM_FX;

        Effect.ShadersStore["customFlareVertexShader"] = SHADERS.CUSTOM_FLARE_VX;
        Effect.ShadersStore["customFlareFragmentShader"] = SHADERS.CUSTOM_FLARE_FX;

        Effect.ShadersStore["coreShieldDestroyRingVertexShader"] =
            SHADERS.CORE_SHIELD_DESTROY_RING_VX;
        Effect.ShadersStore["coreShieldDestroyRingFragmentShader"] =
            SHADERS.CORE_SHIELD_DESTROY_RING_FX;

        Effect.ShadersStore["coreShieldDestroyTexturesVertexShader"] =
            SHADERS.CORE_SHIELD_DESTROY_TEXTURES_VX;
        Effect.ShadersStore["coreShieldDestroyTexturesFragmentShader"] =
            SHADERS.CORE_SHIELD_DESTROY_TEXTURES_FX;

        Effect.ShadersStore["coreShieldMaterialVertexShader"] = SHADERS.CORE_SHIELD_MATERIAL_VX;
        Effect.ShadersStore["coreShieldMaterialFragmentShader"] = SHADERS.CORE_SHIELD_MATERIAL_FX;

        Effect.ShadersStore["lavaWallMaterialVertexShader"] = SHADERS.LAVA_WALL_MATERIAL_VX;
        Effect.ShadersStore["lavaWallMaterialFragmentShader"] = SHADERS.LAVA_WALL_MATERIAL_FX;

        Effect.ShadersStore["cylinderBombGroundVertexShader"] = SHADERS.CYLINDER_BOMB_GROUND_VX;
        Effect.ShadersStore["cylinderBombGroundFragmentShader"] = SHADERS.CYLINDER_BOMB_GROUND_FX;

        Effect.ShadersStore["cylinderBombSpawnCircleVertexShader"] =
            SHADERS.CYLINDER_BOMB_SPAWN_CIRCLE_VX;
        Effect.ShadersStore["cylinderBombSpawnCircleFragmentShader"] =
            SHADERS.CYLINDER_BOMB_SPAWN_CIRCLE_FX;

        Effect.ShadersStore["cylinderBombDestroyVertexShader"] = SHADERS.CYLINDER_BOMB_DESTROY_VX;
        Effect.ShadersStore["cylinderBombDestroyFragmentShader"] = SHADERS.CYLINDER_BOMB_DESTROY_FX;

        Effect.ShadersStore["sphereBombDiscMaterialVertexShader"] =
            SHADERS.SPHERE_BOMB_DISC_MATERIAL_VX;
        Effect.ShadersStore["sphereBombDiscMaterialFragmentShader"] =
            SHADERS.SPHERE_BOMB_DISC_MATERIAL_FX;

        Effect.ShadersStore["sphereBombDestroyVertexShader"] = SHADERS.SPHERE_BOMB_DESTROY_VX;
        Effect.ShadersStore["sphereBombDestroyFragmentShader"] = SHADERS.SPHERE_BOMB_DESTROY_FX;

        Effect.ShadersStore["defaultEnemyVertexShader"] = SHADERS.DEFAULT_ENEMY_SHADER_VERTEX;
        Effect.ShadersStore["enemyArrowFragmentShader"] = SHADERS.ENEMY_ARROW_FRAGMENT_SHADER;

        Effect.ShadersStore["aoeDiscGameClockVertexShader"] = SHADERS.AOE_DISC_SPEED_DOWN_PLAYER_VX;
        Effect.ShadersStore["aoeDiscGameClockFragmentShader"] =
            SHADERS.AOE_DISC_SPEED_DOWN_PLAYER_FX;

        Effect.ShadersStore["aoeDiscOverheatVertexShader"] = SHADERS.AOE_DISC_OVERHEAT_VX;
        Effect.ShadersStore["aoeDiscOverheatFragmentShader"] = SHADERS.AOE_DISC_OVERHEAT_FX;
    }, []);
};
