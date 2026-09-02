import { ChapterLabel, versesLayout } from "./verseProgression";

/**
 * Demo build ships Radio Mode only. Per-chapter stems are not included, so these
 * lists stay empty: verse start must not try to decode layered tracks.
 */
export const chapterMusic: Readonly<Record<ChapterLabel, readonly string[]>> = {
    "◼ CHAPTER  01": [],
    "◼ CHAPTER  02": [],
    "◼ CHAPTER  03": [],
    "◼ CHAPTER  04": [],
    "◼ CHAPTER  05": [],
};

/** Demo build has no menu themes and no per-chapter stems. */
export const alwaysResidentMusic: readonly string[] = [];

const chapterLabels = Object.keys(versesLayout) as ChapterLabel[];

export const getChapterForVerse = (verseId: string): ChapterLabel | null =>
    chapterLabels.find((chapter) => versesLayout[chapter].includes(verseId)) ?? null;

export const getChapterMusicPaths = (chapter: ChapterLabel): readonly string[] =>
    chapterMusic[chapter];
