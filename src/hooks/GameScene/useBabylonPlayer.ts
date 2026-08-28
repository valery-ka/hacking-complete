import { useEffect } from "react";

import { useEngineContext, useVersesContext } from "contexts";

import { Player } from "core/player/Player";
import { resetPhysicsTimeAccumulator } from "utils/babylon";

export const useBabylonPlayer = () => {
    const { engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();

    // жестко под 2 игрока, больше не надо честно
    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const playersConfig = currentVerseConfig.player;

        scene.metadata.players = [];
        scene.metadata.players_shooter_classes = [];

        resetPhysicsTimeAccumulator(scene);

        const player0 = new Player(scene);
        player0.create(playersConfig[0]);

        let player1: Player;

        if (playersConfig[1]) {
            player1 = new Player(scene);
            player1.create(playersConfig[1]);
        }

        return () => {
            player0.dispose();
            if (player1) player1.dispose();
        };
    }, [currentVerseConfig, restartKey]);
};
