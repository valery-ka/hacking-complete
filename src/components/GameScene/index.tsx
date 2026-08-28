import { FC } from "react";

import * as HOOKS from "hooks";

import { useEngineContext } from "contexts";

export const GameScene: FC = () => {
    const { engineCanvasRef } = useEngineContext();

    HOOKS.useBabylonGameEngine({ engineCanvasRef });

    HOOKS.useFetchGameTextures();
    HOOKS.useBabylonCollisions();

    HOOKS.useVerseSettings();
    HOOKS.useBabylonBossGUI();

    HOOKS.useBabylonCamera();
    HOOKS.useBabylonGameClock();
    HOOKS.useBabylonEffectLayers();
    HOOKS.useBabylonAssets();
    HOOKS.useBabylonEffects();

    HOOKS.useBabylonLight();
    HOOKS.useBabylonShadows();

    HOOKS.useVerseSwitcher();
    HOOKS.useVerseRestart();

    HOOKS.useBabylonGround();
    HOOKS.useBabylonWalls();

    HOOKS.useBabylonPlayer();
    HOOKS.useBabylonEnemy();

    HOOKS.useBabylonTriggers();

    HOOKS.useBabylonStageTransition();
    HOOKS.useSelfDestructionLayout();

    HOOKS.useBabylonSceneOptimizer();
    HOOKS.useBabylonEngineCleaner();

    HOOKS.useVerseMusic();
    HOOKS.useVerseVoicePool();
    HOOKS.useVerseTimer();

    HOOKS.useBabylonEnvironmentTransform();
    HOOKS.useFinalVerse();

    HOOKS.useAutoAimLayout();

    // HOOKS.useWhatever();
    // HOOKS.useBabylonCustomEditorForDebugBecauseNativeDoesntWorkForUnknownReasons();

    return null;
};
