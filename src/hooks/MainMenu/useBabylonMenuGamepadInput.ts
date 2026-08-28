import { useEffect } from "react";

import { useEngineContext } from "contexts";

import { GamepadInputManager } from "core/player/movement/GamepadInputManager";

export const useBabylonMenuGamepadInput = () => {
    const { engineSceneRef } = useEngineContext();

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const gamepadManager = new GamepadInputManager(scene);

        return () => {
            gamepadManager.dispose();
        };
    }, []);
};
