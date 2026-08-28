import { useEffect, useRef } from "react";
import { AdvancedDynamicTexture, TextBlock, Control } from "@babylonjs/gui";
import { fadeInUI, fadeOutUI, animateTextTyping } from "assets/ui/animations";

interface UseBabylonMenuTitleProps {
    selectedTab: string;
    texturesLoaded: boolean;
}

const OFFSET_Y = 150;
const OFFSET_X = 90;

const TITLE_FONT_SIZE = 60;
const SHADOW_OFFSET = 10;

export const useBabylonMenuTitle = ({ selectedTab, texturesLoaded }: UseBabylonMenuTitleProps) => {
    const uiRef = useRef<AdvancedDynamicTexture | null>(null);
    const textRef = useRef<TextBlock | null>(null);
    const shadowRef = useRef<TextBlock | null>(null);
    const stopAnimationRef = useRef<(() => void) | null>(null);

    const updateTitlePosition = () => {
        if (!textRef.current || !shadowRef.current) return;

        const scaledFont = TITLE_FONT_SIZE;
        const scaledShadow = SHADOW_OFFSET;

        textRef.current.top = OFFSET_Y;
        textRef.current.left = OFFSET_X;
        shadowRef.current.top = OFFSET_Y + scaledShadow;
        shadowRef.current.left = OFFSET_X + scaledShadow;

        textRef.current.fontSize = scaledFont;
        shadowRef.current.fontSize = scaledFont;

        textRef.current.resizeToFit = true;
        shadowRef.current.resizeToFit = true;
    };

    useEffect(() => {
        if (!texturesLoaded) return;

        const uiTitle = AdvancedDynamicTexture.CreateFullscreenUI("UI-Title");

        uiTitle.idealWidth = 2560;
        uiTitle.idealHeight = 1440;

        uiRef.current = uiTitle;

        const shadow = new TextBlock("menu-title-shadow");
        shadow.text = "";
        shadow.color = "rgba(0, 0, 0, 0.15)";
        shadow.fontSize = TITLE_FONT_SIZE;
        shadow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        shadow.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        shadow.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        shadow.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;

        uiTitle.addControl(shadow);
        shadowRef.current = shadow;

        const text = new TextBlock("menu-title");
        text.text = "";
        text.fontSize = TITLE_FONT_SIZE;
        text.color = "#4D493F";
        text.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        text.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        text.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        text.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;

        uiTitle.addControl(text);
        textRef.current = text;

        updateTitlePosition();

        return () => {
            if (stopAnimationRef.current) {
                stopAnimationRef.current();
            }
            fadeOutUI(uiTitle, 100);
        };
    }, [texturesLoaded]);

    useEffect(() => {
        if (!textRef.current || !shadowRef.current || !texturesLoaded) return;

        fadeInUI(uiRef.current!, 100);

        if (stopAnimationRef.current) {
            stopAnimationRef.current();
        }

        stopAnimationRef.current = animateTextTyping(
            textRef.current,
            shadowRef.current,
            selectedTab,
        );

        updateTitlePosition();
    }, [selectedTab, texturesLoaded]);

    return { textRef, shadowRef };
};
