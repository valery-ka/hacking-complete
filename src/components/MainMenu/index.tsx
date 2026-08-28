import { FC } from "react";

import * as HOOKS from "hooks";

import { useEngineContext } from "contexts";

export const MainMenu: FC = () => {
    const { engineCanvasRef } = useEngineContext();

    HOOKS.useBabylonMenuEngine({ engineCanvasRef });

    const { texturesLoaded } = HOOKS.useFetchMenuTextures();
    HOOKS.useMenuDecorations({ texturesLoaded });

    HOOKS.useMenuEffects();
    const { selectedTab } = HOOKS.useMenuTabs({ texturesLoaded });

    HOOKS.useBabylonMenuTitle({ selectedTab, texturesLoaded });

    const { setHintText } = HOOKS.useMenuHint({ selectedTab });

    HOOKS.useVersesTab({ selectedTab, texturesLoaded, setHintText });
    HOOKS.useSystemTab({ selectedTab, texturesLoaded, setHintText });

    HOOKS.useBabylonMenuGamepadInput();
    HOOKS.useMenuMusic();

    return null;
};
