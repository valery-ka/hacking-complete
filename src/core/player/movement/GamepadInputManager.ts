import { Gamepad, GamepadManager, Scene, Xbox360Pad } from "@babylonjs/core";

export interface GamepadInputState {
    leftStickX: number;
    leftStickY: number;
    rightStickX: number;
    rightStickY: number;
    buttons: boolean[];
}

const X_BUTTON = 2; // Xbox X / PlayStation Square
const BACK_BUTTON = 8;
const START_BUTTON = 9;

const DPAD_UP_BUTTON = 12;
const DPAD_DOWN_BUTTON = 13;
const DPAD_LEFT_BUTTON = 14;
const DPAD_RIGHT_BUTTON = 15;

export class GamepadInputManager {
    private scene: Scene;
    private gamepadManager: GamepadManager;
    private activeGamepads: Map<number, Gamepad> = new Map();
    private leftStickDeadzone: number = 0.2;
    private rightStickDeadzone: number = 0.5;

    private observers: Array<{ gamepad: Gamepad; observer: any }> = [];

    constructor(scene: Scene) {
        this.scene = scene;
        this.gamepadManager = new GamepadManager();

        this.gamepadManager.onGamepadConnectedObservable.add((gamepad) => {
            this.activeGamepads.set(gamepad.index, gamepad);
            this.setupButtonObservers(gamepad);
        });

        this.gamepadManager.onGamepadDisconnectedObservable.add((gamepad) => {
            this.cleanupButtonObservers(gamepad);
            this.activeGamepads.delete(gamepad.index);
        });

        this.scene.metadata = { ...scene.metadata, gamepad: this };
    }

    private setupButtonObservers(gamepad: Gamepad): void {
        const observer = (gamepad as any).onButtonDownObservable.add((button: number) => {
            // Each player creates its own manager; only the active one should fire globals
            // (otherwise X / Start / Back toggle twice with 2 players and cancel out).
            if (this.scene.metadata?.gamepad !== this) return;

            if (button === START_BUTTON) {
                this.scene.metadata?.callbacks?.toggle_game_pause?.();
            } else if (button === BACK_BUTTON) {
                if (process.env.NODE_ENV === "development") {
                    this.scene.metadata?.callbacks?.back_to_menu?.();
                }
            } else if (button === X_BUTTON) {
                this.scene.metadata?.callbacks?.toggle_auto_aim?.();
            }
        });

        this.observers.push({ gamepad, observer });
    }

    private cleanupButtonObservers(gamepad: Gamepad): void {
        const observerIndex = this.observers.findIndex((item) => item.gamepad === gamepad);
        if (observerIndex !== -1) {
            const { observer } = this.observers[observerIndex];
            (gamepad as any).onButtonDownObservable.remove(observer);
            this.observers.splice(observerIndex, 1);
        }
    }

    private getGamepad(index: number): Gamepad | undefined {
        return this.activeGamepads.get(index);
    }

    public getInputState(index: number = 2): GamepadInputState {
        const gamepad = this.getGamepad(index);

        if (!gamepad) {
            return {
                leftStickX: 0,
                leftStickY: 0,
                rightStickX: 0,
                rightStickY: 0,
                buttons: [],
            };
        }

        const leftStick = this.applyDeadzone(
            (gamepad as any).leftStick?.x || 0,
            (gamepad as any).leftStick?.y || 0,
            this.leftStickDeadzone,
        );

        const rightStick = this.applyDeadzone(
            (gamepad as any).rightStick?.x || 0,
            (gamepad as any).rightStick?.y || 0,
            this.rightStickDeadzone,
        );

        const buttons = (gamepad as any).browserGamepad.buttons;
        const buttonStates: boolean[] = [];
        if (buttons) {
            for (let i = 0; i < buttons.length; i++) {
                buttonStates.push(buttons[i].pressed);
            }
        }

        return {
            leftStickX: leftStick.x,
            leftStickY: leftStick.y,
            rightStickX: rightStick.x,
            rightStickY: rightStick.y,
            buttons: buttonStates,
        };
    }

    public getLeftStick(): { x: number; y: number } {
        let maxX = 0;
        let maxY = 0;

        for (const [index] of this.activeGamepads) {
            const st = this.getInputState(index);
            const absX = Math.abs(st.leftStickX);
            const absY = Math.abs(st.leftStickY);

            if (absX > Math.abs(maxX)) {
                maxX = st.leftStickX;
            }
            if (absY > Math.abs(maxY)) {
                maxY = st.leftStickY;
            }
        }

        if (this.activeGamepads.size === 0) {
            return { x: 0, y: 0 };
        }

        return { x: maxX, y: maxY };
    }

    public getRightStick(): { x: number; y: number } {
        let maxX = 0;
        let maxY = 0;

        for (const [index] of this.activeGamepads) {
            const st = this.getInputState(index);
            const absX = Math.abs(st.rightStickX);
            const absY = Math.abs(st.rightStickY);

            if (absX > Math.abs(maxX)) {
                maxX = st.rightStickX;
            }
            if (absY > Math.abs(maxY)) {
                maxY = st.rightStickY;
            }
        }

        if (this.activeGamepads.size === 0) {
            return { x: 0, y: 0 };
        }

        return { x: maxX, y: maxY };
    }

    public isButtonPressed(buttonIndex: number): boolean {
        let isPressed = false;

        for (const [index] of this.activeGamepads) {
            const st = this.getInputState(index);
            if (st.buttons[buttonIndex]) {
                isPressed = true;
                break;
            }
        }

        return isPressed;
    }

    private applyDeadzone(x: number, y: number, deadzone: number): { x: number; y: number } {
        const magnitude = Math.sqrt(x * x + y * y);

        if (magnitude < deadzone) {
            return { x: 0, y: 0 };
        }

        const normalizedMagnitude = (magnitude - deadzone) / (1 - deadzone);
        const scale = normalizedMagnitude / magnitude;

        return {
            x: x * scale,
            y: y * scale,
        };
    }

    public hasGamepads(): boolean {
        return this.activeGamepads.size > 0;
    }

    public setLeftStickDeadzone(deadzone: number): void {
        this.leftStickDeadzone = Math.max(0, Math.min(1, deadzone));
    }

    public setRightStickDeadzone(deadzone: number): void {
        this.rightStickDeadzone = Math.max(0, Math.min(1, deadzone));
    }

    public dispose(): void {
        this.observers.forEach(({ gamepad, observer }) => {
            (gamepad as any).onButtonDownObservable.remove(observer);
        });
        this.observers = [];

        this.gamepadManager.onGamepadConnectedObservable.clear();
        this.gamepadManager.onGamepadDisconnectedObservable.clear();
        this.gamepadManager.dispose();

        this.activeGamepads.clear();
    }
}
