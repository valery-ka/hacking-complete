export type ActiveInputDevice = "keyboardMouse" | "gamepad";

type Listener = (device: ActiveInputDevice) => void;

const STICK_DEADZONE = 0.25;
const STICK_ACTIVITY_DELTA = 0.05;
const MOUSE_MOVE_THRESHOLD = 2;
const GAMEPAD_POLL_MS = 50;

class InputDeviceTrackerImpl {
    private activeDevice: ActiveInputDevice = "keyboardMouse";
    private listeners = new Set<Listener>();
    private started = false;
    private pollId: ReturnType<typeof setInterval> | null = null;
    private prevButtonPressed: boolean[][] = [];
    private prevAxes: number[][] = [];

    getDevice(): ActiveInputDevice {
        return this.activeDevice;
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        listener(this.activeDevice);
        return () => {
            this.listeners.delete(listener);
        };
    }

    start(): void {
        if (this.started || typeof window === "undefined") return;
        this.started = true;

        window.addEventListener("keydown", this.handleKeyboardMouse, true);
        window.addEventListener("mousedown", this.handleKeyboardMouse, true);
        window.addEventListener("mousemove", this.handleMouseMove, true);

        this.pollId = setInterval(this.pollGamepads, GAMEPAD_POLL_MS);
    }

    stop(): void {
        if (!this.started || typeof window === "undefined") return;
        this.started = false;

        window.removeEventListener("keydown", this.handleKeyboardMouse, true);
        window.removeEventListener("mousedown", this.handleKeyboardMouse, true);
        window.removeEventListener("mousemove", this.handleMouseMove, true);

        if (this.pollId !== null) {
            clearInterval(this.pollId);
            this.pollId = null;
        }
    }

    private setDevice(device: ActiveInputDevice): void {
        if (this.activeDevice === device) return;
        this.activeDevice = device;
        this.listeners.forEach((listener) => listener(device));
    }

    private handleKeyboardMouse = (): void => {
        this.setDevice("keyboardMouse");
    };

    private handleMouseMove = (event: MouseEvent): void => {
        if (
            Math.abs(event.movementX) < MOUSE_MOVE_THRESHOLD &&
            Math.abs(event.movementY) < MOUSE_MOVE_THRESHOLD
        ) {
            return;
        }
        this.setDevice("keyboardMouse");
    };

    private pollGamepads = (): void => {
        if (typeof navigator === "undefined" || !navigator.getGamepads) return;

        const pads = navigator.getGamepads();
        for (let i = 0; i < pads.length; i++) {
            const pad = pads[i];
            if (!pad) {
                this.prevButtonPressed[i] = [];
                this.prevAxes[i] = [];
                continue;
            }

            const prev = this.prevButtonPressed[i] ?? [];
            const next: boolean[] = [];

            for (let b = 0; b < pad.buttons.length; b++) {
                const pressed = !!pad.buttons[b]?.pressed;
                next.push(pressed);
                if (pressed && !prev[b]) {
                    this.setDevice("gamepad");
                }
            }
            this.prevButtonPressed[i] = next;

            const previousAxes = this.prevAxes[i] ?? [];
            const nextAxes: number[] = [];
            for (let a = 0; a < pad.axes.length; a++) {
                const value = pad.axes[a] ?? 0;
                const previousValue = previousAxes[a] ?? 0;
                nextAxes.push(value);

                if (
                    Math.abs(value) > STICK_DEADZONE &&
                    Math.abs(value - previousValue) > STICK_ACTIVITY_DELTA
                ) {
                    this.setDevice("gamepad");
                }
            }
            this.prevAxes[i] = nextAxes;
        }
    };
}

export const inputDeviceTracker = new InputDeviceTrackerImpl();
