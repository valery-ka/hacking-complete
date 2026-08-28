import { useEffect } from "react";

import { useAudioEngine, useVersesContext } from "contexts";

export const useMenuMusic = () => {
    const { audioManagerRef, audioLoaded } = useAudioEngine();
    const { currentVerseConfig } = useVersesContext();

    useEffect(() => {
        if (!audioLoaded) return;

        const musicEngine = audioManagerRef.current?.getMusicAudio();
        if (!musicEngine) return;

        const menuTrack = currentVerseConfig.music?.to_play_in_menu;
        if (!menuTrack) return;

        musicEngine.playMenuMusic(menuTrack);

        return () => {
            musicEngine.stopMenuMusic(menuTrack);
        };
    }, [audioLoaded, audioManagerRef, currentVerseConfig]);
};
