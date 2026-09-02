import { beforeEach, describe, expect, it } from "@jest/globals";
import { LS_KEYS } from "core_constants";
import {
    getUnlockedVerseIds,
    getUnlockAllVersesSetting,
    isVerseUnlocked,
    markVerseCompleted,
    setUnlockAllVersesSetting,
    VERSES_ORDER,
} from "./verseProgression";

describe("verse progression", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("unlocks only the first verse for a new profile", () => {
        expect(getUnlockedVerseIds()).toEqual(["00"]);
        expect(isVerseUnlocked("00")).toBe(true);
        expect(isVerseUnlocked("01")).toBe(false);
        expect(getUnlockAllVersesSetting()).toBe("OFF");
    });

    it("unlocks verses in layout order rather than numeric order", () => {
        VERSES_ORDER.slice(0, 8).forEach((verseId) => {
            expect(markVerseCompleted(verseId)).toBe(true);
        });

        expect(getUnlockedVerseIds()).toEqual(VERSES_ORDER.slice(0, 9));
        expect(VERSES_ORDER[8]).toBe("09");
        expect(isVerseUnlocked("08")).toBe(false);
    });

    it("does not change progress when an already completed verse is replayed", () => {
        expect(markVerseCompleted("00")).toBe(true);
        expect(markVerseCompleted("00")).toBe(false);
        expect(getUnlockedVerseIds()).toEqual(["00", "01"]);
    });

    it("temporarily unlocks all verses without recording completions", () => {
        setUnlockAllVersesSetting("ON");

        expect(getUnlockedVerseIds()).toEqual(VERSES_ORDER);
        expect(markVerseCompleted("54")).toBe(false);

        setUnlockAllVersesSetting("OFF");
        expect(getUnlockedVerseIds()).toEqual(["00"]);
    });

    it("falls back to a clean profile when stored progress is invalid", () => {
        localStorage.setItem(LS_KEYS.VERSE_PROGRESS, "{not-json");
        expect(getUnlockedVerseIds()).toEqual(["00"]);

        localStorage.setItem(
            LS_KEYS.VERSE_PROGRESS,
            JSON.stringify({ version: 999, completedVerseIds: ["00"] }),
        );
        expect(getUnlockedVerseIds()).toEqual(["00"]);
    });
});
