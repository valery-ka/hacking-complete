import { FC, useEffect } from "react";

import { useGameState, useEngineContext, useAudioEngine } from "contexts";
import * as HOOKS from "hooks";
import { breadcrumb } from "utils/diagnostics";

import { GameScene } from "components/GameScene";
import { MainMenu } from "components/MainMenu";
import { LoadingOverlay } from "components/LoadingOverlay";

export const UI: FC = () => {
    const { gameState } = useGameState();
    const { engineCanvasRef } = useEngineContext();

    HOOKS.useCompileShaders();

    const { audioEngineLoaded } = useAudioEngine();

    useEffect(() => {
        breadcrumb("ui.gameState", { gameState, audioEngineLoaded });
    }, [audioEngineLoaded, gameState]);

    if (!audioEngineLoaded)
        return (
            <>
                <canvas ref={engineCanvasRef} id="babylon-canvas" />
                <>
                    <LoadingOverlay />
                </>
            </>
        );

    return (
        <>
            <canvas ref={engineCanvasRef} id="babylon-canvas" />
            <>
                {gameState === "menu" && <MainMenu />}
                {gameState === "game" && <GameScene />}
            </>
        </>
    );
};
