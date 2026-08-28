import { UtilityLayerRenderer } from "@babylonjs/core";
import {
    AdvancedDynamicTexture,
    Control,
    Image,
    Rectangle,
    StackPanel,
    TextBlock,
} from "@babylonjs/gui";
import type { ActiveInputDevice } from "core/input/InputDeviceTracker";
import type { Nullable } from "types/common";
import { getControlIconPath } from "assets/ui/control-icons";

const COLOR = "#D5CCAE";
const SHADOW_COLOR = "#00000070";
const SHADOW_BLUR = 5;

const BUTTON_SIZE = 28;
const BUTTON_GAP = 10;

export const createAutoAimLayout = (
    layer: UtilityLayerRenderer,
    isEnabled: boolean,
    activeDevice: ActiveInputDevice,
) => {
    // Utility layer is rendered after the main scene post processes, so the HUD
    // stays sharp (no chromatic aberration / DOF blur on top of the text).
    const ui = AdvancedDynamicTexture.CreateFullscreenUI(
        "UI-Auto-Aim",
        true,
        layer.utilityLayerScene,
    );

    ui.renderAtIdealSize = true;

    const container = new Rectangle("auto-aim-container");

    container.width = "280px";
    container.height = "40px";
    container.thickness = 0;

    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    container.top = "40px";
    container.left = "-40px";

    const content = new StackPanel("auto-aim-content");

    content.isVertical = false;
    content.adaptWidthToChildren = true;
    content.height = "30px";
    content.spacing = BUTTON_GAP;

    content.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    content.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

    const button = new Image("auto-aim-button", getControlIconPath("autoAim", activeDevice));

    button.width = `${BUTTON_SIZE}px`;
    button.height = `${BUTTON_SIZE}px`;
    button.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    button.shadowBlur = SHADOW_BLUR;
    button.shadowColor = SHADOW_COLOR;

    content.addControl(button);

    const text = new TextBlock("auto-aim-text", formatAutoAimText(isEnabled));

    text.resizeToFit = true;
    text.color = COLOR;
    text.fontSize = 28;
    text.fontFamily = "monospace";
    text.fontWeight = "700";
    text.height = "30px";

    text.shadowBlur = SHADOW_BLUR;
    text.shadowColor = SHADOW_COLOR;

    text.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    text.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    content.addControl(text);
    container.addControl(content);

    const line = new Rectangle("auto-aim-line");

    line.width = "100%";
    line.height = "3px";
    line.thickness = 0;
    line.background = COLOR;

    line.shadowBlur = SHADOW_BLUR;
    line.shadowColor = SHADOW_COLOR;

    line.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    line.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    line.top = "32px";

    container.addControl(line);

    container.metadata = {
        button,
        text,
        line,
        visibility_frame: null as Nullable<number>,
        update: (enabled: boolean) => {
            text.text = formatAutoAimText(enabled);
        },
        setButtonIcon: (iconPath: string) => {
            button.source = iconPath;
        },
    };

    ui.addControl(container);

    return { ui, container };
};

export const animateAutoAimVisibility = (
    container: Rectangle,
    visible: boolean,
    duration: number = 125,
) => {
    const metadata = container.metadata;
    if (!metadata) return;

    if (metadata.visibility_frame !== null) {
        cancelAnimationFrame(metadata.visibility_frame);
        metadata.visibility_frame = null;
    }

    const startAlpha = container.alpha;
    const targetAlpha = visible ? 1 : 0;

    if (visible) container.isVisible = true;

    const startTime = performance.now();

    const animate = () => {
        const t = Math.min((performance.now() - startTime) / duration, 1);

        container.alpha = startAlpha * (1 - t) + targetAlpha * t;

        if (t < 1) {
            metadata.visibility_frame = requestAnimationFrame(animate);
            return;
        }

        metadata.visibility_frame = null;
        container.isVisible = visible;
    };

    metadata.visibility_frame = requestAnimationFrame(animate);
};

const formatAutoAimText = (isEnabled: boolean) => `Aim-Assist: ${isEnabled ? "ON" : "OFF"}`;
