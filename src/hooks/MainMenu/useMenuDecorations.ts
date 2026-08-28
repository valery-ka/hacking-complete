import { AdvancedDynamicTexture } from "@babylonjs/gui/2D";

import { useEffect } from "react";

import { createCurtain } from "assets/ui/ui-curtain";
import { animateWiggle, createBgCircles, createBgLines } from "assets/ui/background-decoration";

interface IUseMenuDecorations {
    texturesLoaded: boolean;
}

export const useMenuDecorations = ({ texturesLoaded }: IUseMenuDecorations) => {
    useEffect(() => {
        if (!texturesLoaded) return;

        const uiDecorations = AdvancedDynamicTexture.CreateFullscreenUI("UI-Decorations");

        uiDecorations.idealWidth = 2560;
        uiDecorations.idealHeight = 1440;

        const curtainTop = createCurtain(uiDecorations, 105, 0);
        const curtainBottom = createCurtain(uiDecorations, -105, 1);

        const bgTopCircles = createBgCircles(uiDecorations, 1500, 0, 0, -1, 4);
        const bgBottomCircles = createBgCircles(uiDecorations, 1500, 1, 1, 1, 4);

        const bgTopLines = createBgLines(uiDecorations, 0, 0, 0);
        const bgBottomLines = createBgLines(uiDecorations, 1, 1, 1);

        const stopAnimations = [
            ...bgTopCircles.map((c) => animateWiggle(c)),
            ...bgBottomLines.map((l) => animateWiggle(l)),
        ];

        return () => {
            curtainTop.dispose();
            curtainBottom.dispose();

            stopAnimations.forEach((stop) => stop());

            bgTopCircles.forEach((c) => c.dispose());
            bgBottomCircles.forEach((c) => c.dispose());

            bgTopLines.forEach((l) => l.dispose());
            bgBottomLines.forEach((l) => l.dispose());

            uiDecorations.dispose();
        };
    }, [texturesLoaded]);
};
