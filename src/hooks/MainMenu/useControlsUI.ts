import { useEffect, useMemo, useRef } from "react";
import { AdvancedDynamicTexture, StackPanel, Control, Rectangle, TextBlock } from "@babylonjs/gui";

import {
    createControlsHint,
    getControlsProfile,
    DEFAULT_CONTROLS_TYPE,
    TControlHint,
    TControlsProfile,
} from "assets/ui/ui-controls";

import { fadeInControl, fadeInUI } from "assets/ui/animations";
import { REFERENCE_HEIGHT, REFERENCE_WIDTH } from "core_constants";

import * as V from "verses";
import { ControlsLayout, ControlsType, VerseConfig } from "verses/verse.types";

interface IUseControlsUI {
    show: boolean;
    verseId: string;
}

const COLOR_1 = "#49463D";
const COLOR_2 = "#D5CCAC";
const COLOR_3 = "#A9A288";

const DEFAULT_CONTROLS_LAYOUT: ControlsLayout = "by_device";

type ControlsSlots = {
    types: ControlsType;
    layout: ControlsLayout;
};

/** Verses without an explicit setting keep the default profile on the left and `N / A` on the right. */
const getVerseControlsSlots = (verseId: string): ControlsSlots => {
    const config = V[`verse${verseId}` as keyof typeof V] as VerseConfig | undefined;

    return {
        types: config?.settings.controls_type ?? [DEFAULT_CONTROLS_TYPE],
        layout: config?.settings.controls_layout ?? DEFAULT_CONTROLS_LAYOUT,
    };
};

const createControlsColumn = (
    name: string,
    hints: TControlHint[] | null,
    side: "left" | "right",
) => {
    const column = new StackPanel(name);
    column.width = "416px";
    column.height = "350px";
    column.background = COLOR_2;
    column.horizontalAlignment =
        side === "left" ? Control.HORIZONTAL_ALIGNMENT_LEFT : Control.HORIZONTAL_ALIGNMENT_RIGHT;

    if (!hints) {
        const na = new TextBlock(`${name}-na`);
        na.text = "N / A";
        na.fontSize = 60;
        na.color = COLOR_1;
        column.addControl(na);
    } else {
        column.spacing = 12;
    }

    const tableHeader = new Rectangle(`${name}-table-header`);
    tableHeader.width = "100%";
    tableHeader.height = "20px";
    tableHeader.thickness = 0;
    tableHeader.background = COLOR_2;
    column.addControl(tableHeader);

    hints?.forEach((hint) => {
        column.addControl(createControlsHint(hint));
    });

    return column;
};

/** Returns `[topRowLeft, topRowRight, bottomRowLeft, bottomRowRight]` hint lists. */
const getLayoutCells = (
    profiles: readonly [TControlsProfile | null, TControlsProfile | null],
    layout: ControlsLayout,
): [TControlHint[] | null, TControlHint[] | null, TControlHint[] | null, TControlHint[] | null] => {
    const [left, right] = profiles;

    if (layout === "by_profile") {
        return [
            left?.gamepad ?? null,
            left?.keyboard ?? null,
            right?.gamepad ?? null,
            right?.keyboard ?? null,
        ];
    }

    return [
        left?.gamepad ?? null,
        right?.gamepad ?? null,
        left?.keyboard ?? null,
        right?.keyboard ?? null,
    ];
};

export const useControlsUI = ({ show, verseId }: IUseControlsUI) => {
    const topRowRef = useRef<Rectangle | null>(null);
    const bottomRowRef = useRef<Rectangle | null>(null);
    const isFirstLayoutRef = useRef(true);

    const { types, layout } = useMemo(() => getVerseControlsSlots(verseId), [verseId]);
    const [leftType, rightType] = types;

    useEffect(() => {
        if (!show) return;
        const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI-Controls");

        ui.idealWidth = REFERENCE_WIDTH;
        ui.idealHeight = REFERENCE_HEIGHT;
        ui.renderAtIdealSize = true;

        fadeInUI(ui);

        const background = new Rectangle("main-container");
        background.width = "37.5%";
        background.height = "1300px";
        background.paddingTop = "315px";
        background.paddingRight = "140px";
        background.paddingBottom = "250px";
        background.background = COLOR_3;
        background.thickness = 0;
        background.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        background.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        ui.addControl(background);

        const mainContainer = new StackPanel("main-container");
        mainContainer.width = "38%";
        mainContainer.height = "1300px";
        mainContainer.spacing = 12;
        mainContainer.paddingTop = "275px";
        mainContainer.paddingRight = "128px";
        mainContainer.paddingBottom = "250px";
        mainContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        mainContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        ui.addControl(mainContainer);

        const tableHeader = new Rectangle("table-header");
        tableHeader.width = "100%";
        tableHeader.height = "40px";
        tableHeader.thickness = 0;
        tableHeader.background = COLOR_1;
        mainContainer.addControl(tableHeader);

        const topRow = new Rectangle("controls-row-top");
        topRow.width = "100%";
        topRow.height = "350px";
        topRow.thickness = 0;
        mainContainer.addControl(topRow);

        const bottomRow = new Rectangle("controls-row-bottom");
        bottomRow.width = "100%";
        bottomRow.height = "360px";
        bottomRow.paddingBottom = "10px";
        bottomRow.thickness = 0;
        mainContainer.addControl(bottomRow);

        topRowRef.current = topRow;
        bottomRowRef.current = bottomRow;
        isFirstLayoutRef.current = true;

        return () => {
            topRowRef.current = null;
            bottomRowRef.current = null;
            ui.dispose();
        };
    }, [show]);

    useEffect(() => {
        const topRow = topRowRef.current;
        const bottomRow = bottomRowRef.current;
        if (!show || !topRow || !bottomRow) return;

        const profiles = [getControlsProfile(leftType), getControlsProfile(rightType)] as const;
        const [topLeft, topRight, bottomLeft, bottomRight] = getLayoutCells(profiles, layout);

        topRow.addControl(createControlsColumn("controls-top-left", topLeft, "left"));
        topRow.addControl(createControlsColumn("controls-top-right", topRight, "right"));
        bottomRow.addControl(createControlsColumn("controls-bottom-left", bottomLeft, "left"));
        bottomRow.addControl(createControlsColumn("controls-bottom-right", bottomRight, "right"));

        // Columns built together with the texture are already covered by its own fade in.
        if (!isFirstLayoutRef.current) {
            [...topRow.children, ...bottomRow.children].forEach((column) => {
                fadeInControl(column);
            });
        }

        isFirstLayoutRef.current = false;

        return () => {
            // Refs are nulled when the whole texture is disposed, nothing left to clean up then.
            if (!topRowRef.current || !bottomRowRef.current) return;

            [...topRow.children, ...bottomRow.children].forEach((child) => child.dispose());
        };
    }, [show, leftType, rightType, layout]);
};
