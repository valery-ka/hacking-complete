import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { StarsSPS } from "core/effects/Stars";
import { RenderingPipeline } from "core/effects/RenderingPipeline";
import { PostProcessesPipeline } from "core/effects/PostProcessesPipeline";

import { CubesExplosion } from "core/effects/CubesExplosion";
import { CoreDamageEffect } from "core/effects/CoreDamageEffect";
import { PlayerBulletHitsWall } from "core/effects/PlayerBulletHitsWall";
import { PlayerBulletHitsShield } from "core/effects/PlayerBulletHitsShield";
import { PlayerAndEnemyBulletsCollide } from "core/effects/PlayerAndEnemyBulletsCollide";
import { ShieldDamageEffect } from "core/effects/ShieldDamageEffect";
import { EnemyDamageEffect } from "core/effects/EnemyDamageEffect";
import { EnemySpawnAnimation } from "core/effects/EnemySpawnAnimation";
import { EnemyDestroyEffect } from "core/effects/EnemyDestroyEffect";
import { CoreDestroyEffect } from "core/effects/CoreDestroyEffect";
import { PlayerDamageEffect } from "core/effects/PlayerDamageEffect";
import { PlayerDestroyEffect } from "core/effects/PlayerDestroyEffect";
import { CoreShieldDestroy } from "core/effects/CoreShieldDestroy";
import { WallAppearance } from "core/effects/WallAppearance";
import { BoxDestroyEffect } from "core/effects/BoxDestroyEffect";
import { EnemyCylinderBombSpawnAnimation } from "core/effects/EnemyCylinderBombSpawnAnimation";
import { EnemyCylinderBombDestroyEffect } from "core/effects/EnemyCylinderBombDestroyEffect";
import { SphereBombDiscSpawnAnimation } from "core/effects/SphereBombDiscSpawnAnimation";
import { SphereBombDestroyEffect } from "core/effects/SphereBombDestroyEffect";
import { RocketTrailManager } from "core/effects/RocketTrailEffect";
import { ConfettiEffect } from "core/effects/ConfettiEffect";

export const useBabylonEffects = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    // эффекты
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const defaultRenderingPipeline = new RenderingPipeline(scene);
        defaultRenderingPipeline.create();
        defaultRenderingPipeline.enableFXAA();
        defaultRenderingPipeline.enableChromaticAbberation();
        defaultRenderingPipeline.enableVignette();
        defaultRenderingPipeline.enableDOF();

        const postProcesses0 = new PostProcessesPipeline(scene, scene.metadata.cameras[0]);
        postProcesses0.create();

        let postProcesses1: PostProcessesPipeline | null = null;
        if (scene.metadata.cameras[1]) {
            postProcesses1 = new PostProcessesPipeline(scene, scene.metadata.cameras[1]);
            postProcesses1.create();
        }

        scene.metadata = {
            ...scene.metadata,
            effects: {
                ...scene.metadata.effects,
                rendering_pipeline: defaultRenderingPipeline,
                post_processes0: postProcesses0,
                post_processes1: postProcesses1,
            },
        };

        return () => {
            postProcesses0.dispose();
            postProcesses1?.dispose();
            defaultRenderingPipeline.dispose();
        };
    }, [currentVerseConfig, restartKey]);

    // партикли
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const effectsConfig = currentVerseConfig.effects;

        const particles = new StarsSPS(scene);
        particles.create(effectsConfig);
        particles.enableStars();

        scene.metadata = {
            ...scene.metadata,
            effects: {
                ...scene.metadata.effects,
                particles: particles,
            },
        };

        return () => {
            particles.dispose();
        };
    }, [currentVerseConfig, restartKey]);

    // эффекты нод
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const cubesExplosion = new CubesExplosion(scene);
        const shieldDamage = new ShieldDamageEffect(scene);
        const wallAppearance = new WallAppearance(scene);
        const boxDestroy = new BoxDestroyEffect(scene);
        const sphereBombDiscSpawnAnimation = new SphereBombDiscSpawnAnimation(scene);
        const rocketTrailManager = new RocketTrailManager(scene);

        scene.metadata = {
            ...scene.metadata,
            effects: {
                ...scene.metadata.effects,
                cubes_explosion: cubesExplosion,
                sheild_damage: shieldDamage,
                wall_appearance: wallAppearance,
                box_destroy: boxDestroy,
                sphere_bomb_disc_spawn_animation: sphereBombDiscSpawnAnimation,
                rocket_trail_manager: rocketTrailManager,
            },
        };

        return () => {
            cubesExplosion.dispose();
            shieldDamage.dispose();
            wallAppearance.dispose();
            boxDestroy.dispose();
            sphereBombDiscSpawnAnimation.dispose();
            rocketTrailManager.dispose();
        };
    }, []);

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const coreDamageEffect = new CoreDamageEffect(scene);
        const playerBulletHitsWall = new PlayerBulletHitsWall(scene);
        const playerAndEnemyBulletsCollide = new PlayerAndEnemyBulletsCollide(scene);
        const playerBulletHitsShield = new PlayerBulletHitsShield(scene);
        const enemyDamageEffect = new EnemyDamageEffect(scene);
        const enemySpawnAnimation = new EnemySpawnAnimation(scene);
        const enemyDestroyEffect = new EnemyDestroyEffect(scene);
        const coreDestroyEffect = new CoreDestroyEffect(scene);
        const playerDamageEffect = new PlayerDamageEffect(scene);
        const playerDestroyEffect = new PlayerDestroyEffect(scene);
        const coreShieldDestroy = new CoreShieldDestroy(scene);
        const enemyCylinderBombSpawnAnimation = new EnemyCylinderBombSpawnAnimation(scene);
        const enemyCylinderBombDestroyEffect = new EnemyCylinderBombDestroyEffect(scene);
        const sphereBombDestroyEffect = new SphereBombDestroyEffect(scene);
        const confettiEffect = new ConfettiEffect(scene);

        scene.metadata = {
            ...scene.metadata,
            effects: {
                ...scene.metadata.effects,
                core_damage: coreDamageEffect,
                player_bullet_hits_wall: playerBulletHitsWall,
                player_bullet_hits_shield: playerBulletHitsShield,
                player_and_enemy_bullets_collide: playerAndEnemyBulletsCollide,
                enemy_damage: enemyDamageEffect,
                enemy_spawn_animation: enemySpawnAnimation,
                enemy_destroy: enemyDestroyEffect,
                core_destroy: coreDestroyEffect,
                player_damage: playerDamageEffect,
                player_destroy: playerDestroyEffect,
                core_shield_destroy: coreShieldDestroy,
                enemy_cylinder_bomb_spawn_animation: enemyCylinderBombSpawnAnimation,
                enemy_cylinder_bomb_destroy_effect: enemyCylinderBombDestroyEffect,
                sphere_bomb_destroy_effect: sphereBombDestroyEffect,
                confetti_effect: confettiEffect,
            },
        };

        return () => {
            coreDamageEffect.dispose();
            playerBulletHitsWall.dispose();
            playerAndEnemyBulletsCollide.dispose();
            playerBulletHitsShield.dispose();
            enemyDamageEffect.dispose();
            enemySpawnAnimation.dispose();
            enemyDestroyEffect.dispose();
            coreDestroyEffect.dispose();
            playerDamageEffect.dispose();
            playerDestroyEffect.dispose();
            coreShieldDestroy.dispose();
            enemyCylinderBombSpawnAnimation.dispose();
            enemyCylinderBombDestroyEffect.dispose();
            sphereBombDestroyEffect.dispose();
            confettiEffect.dispose();

            const persistent = scene.metadata?.effects;
            persistent?.cubes_explosion?.dispose();
            persistent?.sheild_damage?.dispose();
            persistent?.wall_appearance?.dispose();
            persistent?.box_destroy?.dispose();
            persistent?.sphere_bomb_disc_spawn_animation?.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
