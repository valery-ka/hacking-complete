import { LS_KEYS } from "core_constants";

export type ChapterLabel =
    | "◼ CHAPTER  01"
    | "◼ CHAPTER  02"
    | "◼ CHAPTER  03"
    | "◼ CHAPTER  04"
    | "◼ CHAPTER  05";

export const versesLayout: Readonly<Record<ChapterLabel, readonly string[]>> = {
    "◼ CHAPTER  01": ["00", "01", "02", "03", "04", "05", "06", "07", "09", "51", "10"],
    "◼ CHAPTER  02": ["11", "12", "13", "14", "15", "16", "17", "18", "19", "52", "21"],
    "◼ CHAPTER  03": ["22", "23", "24", "25", "26", "27", "28", "29", "30", "47", "32"],
    "◼ CHAPTER  04": ["33", "34", "35", "36", "37", "38", "39", "40", "44", "48", "43"],
    "◼ CHAPTER  05": ["08", "20", "41", "42", "31", "45", "46", "49", "50", "53", "54"],
};

export const VERSES_ORDER = Object.freeze(Object.values(versesLayout).flat());

const PROGRESS_VERSION = 1;
const VERSES_SET = new Set(VERSES_ORDER);

interface VerseProgress {
    version: typeof PROGRESS_VERSION;
    completedVerseIds: string[];
}

const EMPTY_PROGRESS: VerseProgress = {
    version: PROGRESS_VERSION,
    completedVerseIds: [],
};

const hasStorage = () => typeof localStorage !== "undefined";

const readProgress = (): VerseProgress => {
    if (!hasStorage()) return EMPTY_PROGRESS;

    const raw = localStorage.getItem(LS_KEYS.VERSE_PROGRESS);
    if (!raw) return EMPTY_PROGRESS;

    try {
        const parsed: unknown = JSON.parse(raw);
        if (
            typeof parsed !== "object" ||
            parsed === null ||
            !("version" in parsed) ||
            parsed.version !== PROGRESS_VERSION ||
            !("completedVerseIds" in parsed) ||
            !Array.isArray(parsed.completedVerseIds)
        ) {
            return EMPTY_PROGRESS;
        }

        const completedVerseIds = Array.from(
            new Set(
                parsed.completedVerseIds.filter(
                    (verseId): verseId is string =>
                        typeof verseId === "string" && VERSES_SET.has(verseId),
                ),
            ),
        );

        return { version: PROGRESS_VERSION, completedVerseIds };
    } catch {
        return EMPTY_PROGRESS;
    }
};

const writeProgress = (progress: VerseProgress) => {
    if (!hasStorage()) return;
    localStorage.setItem(LS_KEYS.VERSE_PROGRESS, JSON.stringify(progress));
};

export type UnlockAllVersesSetting = "ON" | "OFF";

export const getUnlockAllVersesSetting = (): UnlockAllVersesSetting =>
    hasStorage() && localStorage.getItem(LS_KEYS.UNLOCK_ALL_VERSES) === "ON" ? "ON" : "OFF";

export const setUnlockAllVersesSetting = (setting: UnlockAllVersesSetting) => {
    if (!hasStorage()) return;
    localStorage.setItem(LS_KEYS.UNLOCK_ALL_VERSES, setting);
};

export const isUnlockAllVersesEnabled = () => getUnlockAllVersesSetting() === "ON";

export const getUnlockedVerseIds = (): string[] => {
    if (isUnlockAllVersesEnabled()) return [...VERSES_ORDER];

    const completed = new Set(readProgress().completedVerseIds);
    let unlockedCount = 1;

    while (
        unlockedCount < VERSES_ORDER.length &&
        completed.has(VERSES_ORDER[unlockedCount - 1])
    ) {
        unlockedCount++;
    }

    return VERSES_ORDER.slice(0, unlockedCount);
};

export const isVerseUnlocked = (verseId: string) => getUnlockedVerseIds().includes(verseId);

export const markVerseCompleted = (verseId: string): boolean => {
    if (isUnlockAllVersesEnabled() || !VERSES_SET.has(verseId) || !isVerseUnlocked(verseId)) {
        return false;
    }

    const progress = readProgress();
    if (progress.completedVerseIds.includes(verseId)) return false;

    writeProgress({
        version: PROGRESS_VERSION,
        completedVerseIds: [...progress.completedVerseIds, verseId],
    });
    return true;
};
