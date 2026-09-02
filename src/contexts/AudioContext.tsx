import { createContext, ReactNode, useContext, useRef, useEffect, useState } from "react";

import { AudioManager } from "core/audio/AudioManager";

import { Nullable } from "types/common";
import { CategoryVolume } from "types/music/MusicConfig.types";

interface AudioContextType {
    audioManagerRef: React.RefObject<Nullable<AudioManager>>;
    currentSong: string;
    setCurrentSong: React.Dispatch<React.SetStateAction<string>>;
    currentLayersVolume: CategoryVolume;
    setCurrentLayersVolume: React.Dispatch<React.SetStateAction<CategoryVolume>>;
    audioEngineLoaded: boolean;
    setAudioEngineLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    audioLoaded: boolean;
    setAudioLoaded: React.Dispatch<React.SetStateAction<boolean>>;
    audioLoadProgress: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

const MESSAGES = ["Music", "Common", "Player", "Enemy", "Voice"];

export const AudioProvider = ({ children }: { children: ReactNode }) => {
    const [audioEngineLoaded, setAudioEngineLoaded] = useState<boolean>(false);

    const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
    const [audioLoadProgress, setAudioLoadProgress] = useState(0);
    const receivedMessagesRef = useRef<Set<string>>(new Set());

    const audioManagerRef = useRef<AudioManager | null>(null);

    const [currentSong, setCurrentSong] = useState<string>("");
    const [currentLayersVolume, setCurrentLayersVolume] = useState<CategoryVolume>({});

    const getMessage = (message: string) => {
        receivedMessagesRef.current.add(message);

        const allReceived = MESSAGES.every((msg) => receivedMessagesRef.current.has(msg));

        if (allReceived) {
            setAudioLoadProgress(100);
            setAudioLoaded(true);
        }
    };

    useEffect(() => {
        const audioManager = new AudioManager(
            (message: string) => getMessage(message),
            (loaded, total) => {
                const percent = total > 0 ? Math.round((loaded / total) * 100) : 0;
                setAudioLoadProgress(Math.max(0, Math.min(100, percent)));
            },
        );

        audioManager.initialize().then(() => {
            audioManagerRef.current = audioManager;
        });
    }, []);

    return (
        <AudioContext.Provider
            value={{
                audioManagerRef,
                currentSong,
                setCurrentSong,
                currentLayersVolume,
                setCurrentLayersVolume,
                audioEngineLoaded,
                setAudioEngineLoaded,
                audioLoaded,
                setAudioLoaded,
                audioLoadProgress,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudioEngine = () => {
    const ctx = useContext(AudioContext);
    if (!ctx) throw new Error("useAudioEngine must be inside provider");
    return ctx;
};
