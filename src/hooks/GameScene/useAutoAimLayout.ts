import { UtilityLayerRenderer } from "@babylonjs/core";

import { useEffect, useRef } from "react";
import { useActiveInputDevice, useEngineContext, useVersesContext } from "contexts";

import { createAutoAimLayout, animateAutoAimVisibility } from "assets/ui/auto-aim";
import { getControlIconPath } from "assets/ui/control-icons";
import { isEasyDifficulty } from "utils/autoAim";
import { disposeUtilityLayer } from "utils/babylon";

export const useAutoAimLayout = () => {
    const { engineRef, engineSceneRef } = useEngineContext();
    const { currentVerseConfig, restartKey } = useVersesContext();
    const { activeDevice } = useActiveInputDevice();
    const activeDeviceRef = useRef(activeDevice);
    activeDeviceRef.current = activeDevice;

    useEffect(() => {
        const scene = engineSceneRef.current;
        if (!scene) return;

        const engine = engineRef.current;
        if (!engine) return;

        if (!isEasyDifficulty()) {
            scene.metadata.auto_aim_enabled = false;
            return;
        }

        // Non-interactive HUD, so the layer does not need to handle pointer events
        const utilityLayer = new UtilityLayerRenderer(scene, false);

        let isEnabled = false;
        scene.metadata.auto_aim_enabled = isEnabled;

        const { ui, container } = createAutoAimLayout(
            utilityLayer,
            isEnabled,
            activeDeviceRef.current,
        );

        scene.metadata.auto_aim_ui = container;

        let isUIVisible = true;
        scene.metadata.auto_aim_ui_visible = isUIVisible;

        // Hidden whenever player controls are locked (pause, death, verse switch, final verse)
        const setUIVisible = (visible: boolean) => {
            if (isUIVisible === visible) return;

            isUIVisible = visible;
            scene.metadata.auto_aim_ui_visible = visible;

            animateAutoAimVisibility(container, visible);
        };

        const toggleAutoAim = () => {
            if (!isUIVisible) return;
            if (scene.metadata.gameClock?.paused) return;
            if (scene.metadata.controlsLockedRef?.current) return;

            isEnabled = !isEnabled;
            scene.metadata.auto_aim_enabled = isEnabled;
            container.metadata?.update?.(isEnabled);
        };

        scene.metadata.callbacks = {
            ...scene.metadata.callbacks,
            toggle_auto_aim: toggleAutoAim,
            set_auto_aim_ui_visible: setUIVisible,
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code !== "Tab") return;

            e.preventDefault();
            toggleAutoAim();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);

            container.dispose();
            ui.dispose();
            disposeUtilityLayer(utilityLayer);

            if (scene.metadata) {
                scene.metadata.auto_aim_ui = null;
                scene.metadata.auto_aim_enabled = false;
                scene.metadata.auto_aim_ui_visible = false;

                if (scene.metadata.callbacks) {
                    scene.metadata.callbacks.toggle_auto_aim = undefined;
                    scene.metadata.callbacks.set_auto_aim_ui_visible = undefined;
                }
            }
        };
    }, [currentVerseConfig, restartKey]);

    useEffect(() => {
        const container = engineSceneRef.current?.metadata?.auto_aim_ui;
        container?.metadata?.setButtonIcon?.(getControlIconPath("autoAim", activeDevice));
    }, [activeDevice, engineSceneRef]);
};
