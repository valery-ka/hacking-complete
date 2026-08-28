import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
    ActiveInputDevice,
    inputDeviceTracker,
} from "core/input/InputDeviceTracker";

interface InputDeviceContextType {
    activeDevice: ActiveInputDevice;
}

const InputDeviceContext = createContext<InputDeviceContextType | undefined>(undefined);

export const InputDeviceProvider = ({ children }: { children: ReactNode }) => {
    const [activeDevice, setActiveDevice] = useState<ActiveInputDevice>(
        inputDeviceTracker.getDevice(),
    );

    useEffect(() => {
        inputDeviceTracker.start();
        const unsubscribe = inputDeviceTracker.subscribe(setActiveDevice);
        return () => {
            unsubscribe();
            inputDeviceTracker.stop();
        };
    }, []);

    return (
        <InputDeviceContext.Provider value={{ activeDevice }}>
            {children}
        </InputDeviceContext.Provider>
    );
};

export const useActiveInputDevice = () => {
    const ctx = useContext(InputDeviceContext);
    if (!ctx) throw new Error("useActiveInputDevice must be used within InputDeviceProvider");
    return ctx;
};
