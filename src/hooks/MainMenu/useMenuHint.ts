import {
    AdvancedDynamicTexture,
    Control,
    Image,
    Rectangle,
    StackPanel,
    TextBlock,
} from "@babylonjs/gui";
import {
    createSideLines,
    createRectangle,
    createControlHint,
    TControlHint,
} from "assets/ui/ui-menu-hints";
import { getSystemTabHints, getVersesTabHints } from "assets/ui/control-icons";
import { useEffect, useRef, useState } from "react";
import { Nullable } from "types/common";
import { useActiveInputDevice } from "contexts";

import { animateFromLeft, fadeInControl, fadeOutControl } from "assets/ui/animations";
import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";

interface IUseMenuHint {
    selectedTab: string;
}

export const useMenuHint = ({ selectedTab }: IUseMenuHint) => {
    const { activeDevice } = useActiveInputDevice();
    const [hintText, setHintText] = useState<string>("");
    const textBlockRef = useRef<Nullable<TextBlock>>(null);

    const buttonsRectRef = useRef<Nullable<StackPanel>>(null);
    const [controlsHint, setControlsHint] = useState<TControlHint[]>([]);

    useEffect(() => {
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI-Menu-Hints");

        ui.idealWidth = REFERENCE_WIDTH;
        ui.idealHeight = REFERENCE_HEIGHT;
        ui.renderAtIdealSize = true;

        const mainContainer = new Rectangle("ui-menu-container-hints");
        mainContainer.width = "95%";
        mainContainer.height = "220px";
        mainContainer.paddingTop = "0px";
        mainContainer.paddingRight = "0px";
        mainContainer.paddingBottom = "130px";
        mainContainer.paddingLeft = "90px";
        mainContainer.background = "#D5CCAE";
        mainContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        mainContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        mainContainer.thickness = 0;

        mainContainer.shadowColor = "#49463da8";
        mainContainer.shadowOffsetX = 5;
        mainContainer.shadowOffsetY = 5;

        ui.addControl(mainContainer);

        const sideLines = new StackPanel("ui-hints-side-lines-panel");
        sideLines.isVertical = false;
        sideLines.top = "0px";
        sideLines.left = "0px";
        sideLines.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        sideLines.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        createSideLines(sideLines, 220);

        mainContainer.addControl(sideLines);

        createRectangle(mainContainer);

        const textRect = new Rectangle("ui-hints-text-rect");
        textRect.width = "70%";
        textRect.paddingLeft = "0px";
        textRect.height = "50%";
        textRect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        textRect.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        textRect.thickness = 0;
        mainContainer.addControl(textRect);

        const textBlock = new TextBlock("ui-hints-text");
        textBlock.fontSize = 28;
        textBlock.fontFamily = "Trebuchet MS";
        textBlock.color = "#49463D";
        textBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        textRect.addControl(textBlock);
        textBlockRef.current = textBlock;

        const controlsContainer = new Rectangle("ui-hints-buttons-container");
        controlsContainer.width = "28%";
        controlsContainer.left = "-35px";
        controlsContainer.height = "50%";
        controlsContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        controlsContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        controlsContainer.thickness = 0;
        mainContainer.addControl(controlsContainer);

        const buttonsRect = new StackPanel("ui-hints-buttons-rect");
        buttonsRect.isVertical = false;
        buttonsRect.spacing = 27;
        buttonsRect.adaptWidthToChildren = true;
        buttonsRect.adaptHeightToChildren = true;
        buttonsRect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonsRect.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        controlsContainer.addControl(buttonsRect);

        buttonsRectRef.current = buttonsRect;

        return () => {
            ui.dispose();
        };
    }, []);

    useEffect(() => {
        if (textBlockRef.current) {
            textBlockRef.current.text = hintText;
            animateFromLeft(textBlockRef.current, -50, 50, 200);
            fadeInControl(textBlockRef.current, 200);
        }
    }, [hintText]);

    useEffect(() => {
        const container = buttonsRectRef.current;
        if (!container) return;

        container.clearControls();
        fadeInControl(container, 200);

        const hints =
            selectedTab === "SYSTEM"
                ? getSystemTabHints(activeDevice)
                : selectedTab === "VERSES"
                  ? getVersesTabHints(activeDevice)
                  : [];

        hints.forEach((hint) => {
            container.addControl(createControlHint(hint));
        });

        return () => {
            fadeOutControl(container, 200);
        };
    }, [selectedTab, activeDevice]);

    return { setHintText, setControlsHint };
};
