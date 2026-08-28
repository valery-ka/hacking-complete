import { ReactNode } from "react";
import {
    EngineProvider,
    VersesProvider,
    GameStateProvider,
    AudioProvider,
    InputDeviceProvider,
} from "contexts";

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <AudioProvider>
            <InputDeviceProvider>
                <GameStateProvider>
                    <EngineProvider>
                        <VersesProvider>{children}</VersesProvider>
                    </EngineProvider>
                </GameStateProvider>
            </InputDeviceProvider>
        </AudioProvider>
    );
};
