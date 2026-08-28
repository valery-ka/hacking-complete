import { FC } from "react";

import * as HOOKS from "hooks";

import { useEngineContext } from "contexts";

export const LoadingOverlay: FC = () => {
    const { engineCanvasRef } = useEngineContext();

    HOOKS.useBabylonLoadingEngine({ engineCanvasRef });
    HOOKS.useLoadingUI();

    HOOKS.useLoadingEffects();

    return null;
};
