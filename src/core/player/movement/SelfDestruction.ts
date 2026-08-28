import { Observer, Nullable, Scene, KeyboardInfo, KeyboardEventTypes } from "@babylonjs/core";

import { Player } from "../Player";
import { GamepadInputManager } from "./GamepadInputManager";
import { PlayerAudioEngine } from "core/audio/PlayerAudioEngine";

export class SelfDestruction {
    private scene: Scene;
    private playerClass: Player;
    private gamepadManager: GamepadInputManager;

    private bindSoundToPlayer: boolean = false;
    private audioEngine: Nullable<PlayerAudioEngine>;

    private readonly startSoundName: string = "player_self_destruct_start";

    private keyboardObserver: Nullable<Observer<KeyboardInfo>> = null;
    private renderObserver: Nullable<Observer<Scene>> = null;

    private inputMap: Record<string, boolean> = {};

    private holdStartTime: number | null = null;
    private readonly requiredHoldTime: number = 1170;

    private hasTriggered: boolean = false;

    private wasActivated: boolean = false;

    constructor(scene: Scene, playerClass: Player) {
        this.scene = scene;
        this.playerClass = playerClass;
        this.gamepadManager = scene.metadata.gamepad;

        this.bindSoundToPlayer = playerClass?.player?.metadata?.config?.id === 0;

        this.audioEngine = this.bindSoundToPlayer ? scene.metadata.audio_engine?.getPlayerAudio() ?? null : null;

        this.observe();
    }

    private observe() {
        this.keyboardObserver = this.scene.onKeyboardObservable.add((kbInfo) => {
            const code = kbInfo.event.code;
            if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
                this.inputMap[code] = true;
            } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                this.inputMap[code] = false;
            }
        });

        this.renderObserver = this.scene.onBeforeRenderObservable.add(() => {
            const isPaused = !!this.scene.metadata?.gameClock?.paused;

            const isQPressed = !!this.inputMap["KeyQ"];
            const isEPressed = !!this.inputMap["KeyE"];
            const keyboardActivation = isQPressed && isEPressed;

            let gamepadActivation = false;
            if (this.gamepadManager) {
                const isBtn10Pressed = this.gamepadManager.isButtonPressed(10);
                const isBtn11Pressed = this.gamepadManager.isButtonPressed(11);
                gamepadActivation = isBtn10Pressed && isBtn11Pressed;
            }

            const isActivated = keyboardActivation || gamepadActivation;

            if (isPaused) {
                if (this.wasActivated) {
                    this.deactivation();
                    this.wasActivated = false;
                }
                return;
            }

            if (isActivated !== this.wasActivated) {
                if (isActivated) {
                    this.activation();
                } else {
                    this.deactivation();
                }
                this.wasActivated = isActivated;
            }

            if (isActivated) {
                if (this.holdStartTime === null) {
                    this.holdStartTime = Date.now();
                }

                const elapsed = Date.now() - this.holdStartTime;

                if (elapsed >= this.requiredHoldTime && !this.hasTriggered) {
                    this.triggerSelfDestruction();
                    this.hasTriggered = true;
                } else {
                    this.updateUITimer(this.requiredHoldTime - elapsed);
                }
            }
        });
    }

    private activation() {
        this.hasTriggered = false;
        this.holdStartTime = Date.now();

        this.playStartSound();

        this.scene.metadata.callbacks.show_self_destruct_ui();
    }

    private playStartSound() {
        this.audioEngine?.stopSound(this.startSoundName);
        this.audioEngine?.playSound(this.startSoundName, 1.0);
    }

    private stopStartSound() {
        this.audioEngine?.stopSound(this.startSoundName);
    }

    private updateUITimer(value: number = this.requiredHoldTime) {
        const seconds = (value / 1000).toFixed(2);
        this.scene.metadata.callbacks.update_self_destruct_ui(seconds);
    }

    public deactivation() {
        if (this.wasActivated) {
            this.holdStartTime = null;
            this.hasTriggered = false;

            this.stopStartSound();

            this.scene.metadata.callbacks.hide_self_destruct_ui();
        }
    }

    private triggerSelfDestruction() {
        if (this.playerClass) {
            this.stopStartSound();

            this.playerClass.selfDestruct();
            this.scene.metadata.callbacks.hide_self_destruct_ui();
        }
    }

    public dispose() {
        this.stopStartSound();

        if (this.keyboardObserver) {
            this.scene.onKeyboardObservable.remove(this.keyboardObserver);
            this.keyboardObserver = null;
        }

        if (this.renderObserver) {
            this.scene.onBeforeRenderObservable.remove(this.renderObserver);
            this.renderObserver = null;
        }

        this.inputMap = {};
        this.holdStartTime = null;
        this.hasTriggered = false;
        this.wasActivated = false;
    }
}
