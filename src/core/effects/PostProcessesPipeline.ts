import { Scene, PostProcess, Vector2, Color3, Camera } from "@babylonjs/core";

import { Nullable } from "types/common";

import { REFERENCE_WIDTH } from "core_constants";

type ActiveEffect = {
    pp: Nullable<PostProcess>;
    disable: () => void;
    cancel: () => void;
};

export class PostProcessesPipeline {
    private scene: Scene;
    private camera: Camera;

    public gridLayoutPostProcess: Nullable<PostProcess> = null;
    public rgbPostProcess: Nullable<PostProcess> = null;
    public distortionPostProcess: Nullable<PostProcess> = null;
    public pixelationPostProcess: Nullable<PostProcess> = null;
    public toneMappingPostProcess: Nullable<PostProcess> = null;
    public shatteringPostProcess: Nullable<PostProcess> = null;
    public negativePostProcess: Nullable<PostProcess> = null;
    public squareShatterPostProcess: Nullable<PostProcess> = null;
    public radialBlurPostProcess: Nullable<PostProcess> = null;

    public glitch00PostProcess: Nullable<PostProcess> = null;
    public glitch01PostProcess: Nullable<PostProcess> = null;
    public glitch02PostProcess: Nullable<PostProcess> = null;

    private toneColors: Color3[] = [
        new Color3(0.2, 0.25, 0.025),
        new Color3(0.45, 0.435, 0.375),
        new Color3(0.24, 0.09, 0.07),
        new Color3(0.1, 0.1, 0.1),
    ];

    private activeEffects: ActiveEffect[] = [];
    private readonly MAX_ACTIVE_EFFECTS = 3;

    constructor(scene: Scene, camera: Camera) {
        this.scene = scene;
        this.camera = camera;
    }

    public create() {
        this.createPostProcesses();
    }

    private createPostProcesses() {
        this.createGridLayoutPostProcess();
        this.createNegativePostProcess();
        this.createShatteringPostProcess();
        this.createPixelationPostProcess();
        this.createToneMappingPostProcess();
        this.createGlitch00PostProcess();
        this.createSquareShatterPostProcess();
        this.createDistortionEffect();
        this.createGlitch01PostProcess();
        this.createGlitch02PostProcess();
        this.createRadialBlurPostProcess();
        this.createRGBPostProcess();

        this.disableShatteringPostProcess();
        this.disablePixelationPostProcess();
        this.disableToneMappingPostProcess();
        this.disableDistortionEffect();
        this.disableGlitch00PostProcess();
        this.disableGlitch01PostProcess();
        this.disableGlitch02PostProcess();
        this.disableNegativePostProcess();
        this.disableSquareShatterPostProcess();
        this.disableRadialBlurPostProcess();
        this.disableRGBPostProcess();
    }

    private createRGBPostProcess() {
        this.rgbPostProcess = new PostProcess(
            "customRgb",
            "customRgb",
            ["time"],
            null,
            1.0,
            this.camera,
        );

        this.rgbPostProcess.onApply = (effect) => {
            effect.setFloat("time", performance.now() * 0.001);
        };
    }

    private createRadialBlurPostProcess() {
        this.radialBlurPostProcess = new PostProcess(
            "customRadialBlur",
            "customRadialBlur",
            ["strength"],
            null,
            1.0,
            this.camera,
        );

        this.radialBlurPostProcess.onApply = (effect) => {
            effect.setFloat("strength", 0.1);
        };
    }

    private createSquareShatterPostProcess() {
        this.squareShatterPostProcess = new PostProcess(
            "squareShatter",
            "squareShatter",
            ["time"],
            null,
            1.0,
            this.camera,
        );

        this.squareShatterPostProcess.onApply = (effect) => {
            effect.setFloat("time", performance.now() * 0.002);
        };
    }

    private createNegativePostProcess(intensity: number = 0.85) {
        this.negativePostProcess = new PostProcess(
            "negative",
            "negative",
            ["intensity"],
            null,
            1.0,
            this.camera,
        );

        this.negativePostProcess.onApply = (effect) => {
            effect.setFloat("intensity", intensity);
        };
    }

    public createGridLayoutPostProcess(cellSize: number = 7.0, gridAlpha: number = 0.03) {
        const engine = this.scene.metadata.engine;

        this.gridLayoutPostProcess = new PostProcess(
            "gridOverlay",
            "gridOverlay",
            ["cellSize", "screenSize", "gridAlpha"],
            null,
            1.0,
            this.camera,
        );

        this.gridLayoutPostProcess.onApply = (effect) => {
            effect.setFloat("cellSize", cellSize);
            effect.setVector2(
                "screenSize",
                new Vector2(engine.getRenderWidth(), engine.getRenderHeight()),
            );
            effect.setFloat("gridAlpha", gridAlpha);
        };
    }

    private createDistortionEffect(intensity: number = 0.2) {
        this.distortionPostProcess = new PostProcess(
            "distortion",
            "distortion",
            ["intensity"],
            null,
            1.0,
            this.camera,
        );

        this.distortionPostProcess.onApply = (effect) => {
            effect.setFloat("intensity", intensity);
        };
    }

    private createPixelationPostProcess(pixelSize: number = 16) {
        const engine = this.scene.metadata.engine;

        this.pixelationPostProcess = new PostProcess(
            "pixelation",
            "pixelation",
            ["screenSize", "pixelSize"],
            ["textureSampler"],
            1.0,
            this.camera,
        );

        this.pixelationPostProcess.onApply = (effect) => {
            const width = engine.getRenderWidth();
            const height = engine.getRenderHeight();

            effect.setFloat2("screenSize", width, height);
            effect.setFloat(
                "pixelSize",
                Math.max(1, Math.round(pixelSize * (width / REFERENCE_WIDTH))),
            );
        };
    }

    private createToneMappingPostProcess(toneColor: Color3 = new Color3(0.2, 0.25, 0.025), modeSwitch: number = 0.0) {
        this.toneMappingPostProcess = new PostProcess(
            "tone",
            "tone",
            ["toneColor", "modeSwitch"],
            null,
            1.0,
            this.camera,
        );

        this.toneMappingPostProcess.onApply = (effect) => {
            effect.setColor3("toneColor", toneColor);
            effect.setFloat("modeSwitch", modeSwitch);
        };
    }

    private createShatteringPostProcess(timeMultiplier: number = 2) {
        this.shatteringPostProcess = new PostProcess(
            "shattering",
            "shattering",
            ["time"],
            null,
            1.0,
            this.camera,
        );

        this.shatteringPostProcess.onApply = (effect) => {
            effect.setFloat("time", performance.now() * timeMultiplier);
        };
    }

    private createGlitch00PostProcess() {
        const engine = this.scene.metadata.engine;

        this.glitch00PostProcess = new PostProcess(
            "glitch00",
            "glitch00",
            ["screenSize", "time"],
            null,
            1.0,
            this.camera,
        );

        this.glitch00PostProcess.onApply = (effect) => {
            effect.setVector2(
                "screenSize",
                new Vector2(engine.getRenderWidth(), engine.getRenderHeight()),
            );
            effect.setFloat("time", performance.now() * 0.001);
        };
    }

    public createGlitch01PostProcess() {
        const engine = this.scene.metadata.engine;

        let frameCounter = 0;

        this.glitch01PostProcess = new PostProcess(
            "glitch01",
            "glitch01",
            ["iResolution", "iTime", "iFrame"],
            ["textureSampler"],
            1.0,
            this.camera,
        );

        this.glitch01PostProcess.onApply = (effect) => {
            effect.setFloat("iTime", performance.now() * 0.1);
            effect.setVector2(
                "iResolution",
                new Vector2(engine.getRenderWidth(), engine.getRenderHeight()),
            );
            effect.setFloat("iFrame", frameCounter);
            frameCounter++;
        };
    }

    private createGlitch02PostProcess() {
        const engine = this.scene.getEngine();

        this.glitch02PostProcess = new PostProcess(
            "glitch02",
            "glitch02",
            ["iResolution", "iTime", "iFrame"],
            ["textureSampler"],
            1.0,
            this.camera,
        );

        this.glitch02PostProcess.onApply = (effect) => {
            effect.setFloat("iTime", performance.now() * 0.1);
            effect.setVector2(
                "iResolution",
                new Vector2(engine.getRenderWidth(), engine.getRenderHeight()),
            );
            effect.setFloat("iFrame", this.scene.getFrameId());
        };
    }

    public applyRandomPostProcess(duration: number = 3) {
        const effects = [
            {
                pp: this.distortionPostProcess,
                enable: () => this.enableDistortionEffect(),
                disable: () => this.disableDistortionEffect(),
            },
            {
                pp: this.pixelationPostProcess,
                enable: () => this.enablePixelationPostProcess(),
                disable: () => this.disablePixelationPostProcess(),
            },
            {
                pp: this.toneMappingPostProcess,
                enable: () => this.enableToneMappingPostProcess(),
                disable: () => this.disableToneMappingPostProcess(),
            },
            {
                pp: this.shatteringPostProcess,
                enable: () => this.enableShatteringPostProcess(),
                disable: () => this.disableShatteringPostProcess(),
            },
            {
                pp: this.squareShatterPostProcess,
                enable: () => this.enableSquareShatterPostProcess(),
                disable: () => this.disableSquareShatterPostProcess(),
            },
            {
                pp: this.glitch01PostProcess,
                enable: () => this.enableGlitch01PostProcess(),
                disable: () => this.disableGlitch01PostProcess(),
            },
            {
                pp: this.glitch02PostProcess,
                enable: () => this.enableGlitch02PostProcess(),
                disable: () => this.disableGlitch02PostProcess(),
            },
            {
                pp: this.rgbPostProcess,
                enable: () => this.enableRGBPostProcess(),
                disable: () => this.disableRGBPostProcess(),
            },
        ];

        const activePostProcesses = this.camera._postProcesses ?? [];

        const available = effects.filter(({ pp }) => {
            return pp && !activePostProcesses.includes(pp);
        });

        if (available.length === 0) return;

        const randomEffect = available[Math.floor(Math.random() * available.length)];

        if (this.activeEffects.length >= this.MAX_ACTIVE_EFFECTS) {
            const oldestEffect = this.activeEffects.shift();

            if (oldestEffect) {
                oldestEffect.cancel();
                oldestEffect.disable();
            }
        }

        randomEffect.enable();

        const activeEffect: ActiveEffect = {
            pp: randomEffect.pp,
            disable: randomEffect.disable,
            cancel: () => { },
        };

        this.activeEffects.push(activeEffect);

        const clock = this.scene.metadata.gameClock;
        if (!clock) return;

        let elapsed = 0;

        const unsubscribe = clock.subscribe((dt: number) => {
            elapsed += dt;

            if (elapsed >= duration) {
                activeEffect.cancel();
                randomEffect.disable();

                this.activeEffects = this.activeEffects.filter((effect) => {
                    return effect !== activeEffect;
                });
            }
        });

        activeEffect.cancel = unsubscribe;
    }

    public cancelRandomPostProcesses() {
        const effects = this.activeEffects;
        this.activeEffects = [];

        effects.forEach((effect) => {
            effect.cancel();
            effect.disable();
        });
    }

    public enableRGBPostProcess() {
        if (this.rgbPostProcess) {
            this.camera.attachPostProcess(this.rgbPostProcess);
        }
    }

    public enableRadialBlurPostProcess() {
        if (this.radialBlurPostProcess) {
            this.camera.attachPostProcess(this.radialBlurPostProcess);
        }
    }

    public enableSquareShatterPostProcess() {
        if (this.squareShatterPostProcess) {
            this.camera.attachPostProcess(this.squareShatterPostProcess);
        }
    }

    public enableNegativePostProcess() {
        if (this.negativePostProcess) {
            this.camera.attachPostProcess(this.negativePostProcess);
        }
    }

    public enableGlitch00PostProcess() {
        if (this.glitch00PostProcess) {
            this.camera.attachPostProcess(this.glitch00PostProcess);
        }
    }

    public enableGlitch01PostProcess() {
        if (this.glitch01PostProcess) {
            this.camera.attachPostProcess(this.glitch01PostProcess);
        }
    }

    public enableGlitch02PostProcess() {
        if (this.glitch02PostProcess) {
            this.camera.attachPostProcess(this.glitch02PostProcess);
        }
    }

    public enableGridLayoutPostProcess() {
        if (this.gridLayoutPostProcess) {
            this.camera.attachPostProcess(this.gridLayoutPostProcess);
        }
    }

    public enableDistortionEffect() {
        if (this.distortionPostProcess) {
            this.camera.attachPostProcess(this.distortionPostProcess);
        }
    }

    public enablePixelationPostProcess() {
        if (this.pixelationPostProcess) {
            this.camera.attachPostProcess(this.pixelationPostProcess);
        }
    }

    public enableToneMappingPostProcess(color?: Color3, modeSwitch: number = 0.0) {
        if (!this.toneMappingPostProcess) return;
        this.camera.detachPostProcess(this.toneMappingPostProcess);

        let toneColor: Color3;

        if (color) {
            toneColor = color;
        } else {
            const randomColor = this.toneColors[Math.floor(Math.random() * this.toneColors.length)];
            toneColor = randomColor;
        }

        console.log("modeSwitch", modeSwitch);

        this.toneMappingPostProcess.onApply = (effect) => {
            effect.setColor3("toneColor", toneColor);
            effect.setFloat("modeSwitch", modeSwitch);
        };

        this.camera.attachPostProcess(this.toneMappingPostProcess);
    }

    public enableShatteringPostProcess() {
        if (this.shatteringPostProcess) {
            this.camera.attachPostProcess(this.shatteringPostProcess);
        }
    }

    public disableRGBPostProcess() {
        if (this.rgbPostProcess) {
            this.camera.detachPostProcess(this.rgbPostProcess);
        }
    }

    public disableRadialBlurPostProcess() {
        if (this.radialBlurPostProcess) {
            this.camera.detachPostProcess(this.radialBlurPostProcess);
        }
    }

    public disableSquareShatterPostProcess() {
        if (this.squareShatterPostProcess) {
            this.camera.detachPostProcess(this.squareShatterPostProcess);
        }
    }

    public disableNegativePostProcess() {
        if (this.negativePostProcess) {
            this.camera.detachPostProcess(this.negativePostProcess);
        }
    }

    public disableGridLayoutPostProcess() {
        if (this.gridLayoutPostProcess) {
            this.camera.detachPostProcess(this.gridLayoutPostProcess);
        }
    }

    public disableGlitch00PostProcess() {
        if (this.glitch00PostProcess) {
            this.camera.detachPostProcess(this.glitch00PostProcess);
        }
    }

    public disableGlitch01PostProcess() {
        if (this.glitch01PostProcess) {
            this.camera.detachPostProcess(this.glitch01PostProcess);
        }
    }

    public disableGlitch02PostProcess() {
        if (this.glitch02PostProcess) {
            this.camera.detachPostProcess(this.glitch02PostProcess);
        }
    }

    public disableDistortionEffect() {
        if (this.distortionPostProcess) {
            this.camera.detachPostProcess(this.distortionPostProcess);
        }
    }

    public disablePixelationPostProcess() {
        if (this.pixelationPostProcess) {
            this.camera.detachPostProcess(this.pixelationPostProcess);
        }
    }

    public disableToneMappingPostProcess() {
        if (this.toneMappingPostProcess) {
            this.camera.detachPostProcess(this.toneMappingPostProcess);
        }
    }

    public disableShatteringPostProcess() {
        if (this.shatteringPostProcess) {
            this.camera.detachPostProcess(this.shatteringPostProcess);
        }
    }

    public dispose() {
        this.cancelRandomPostProcesses();

        const disposePp = (pp: Nullable<PostProcess>) => {
            if (!pp) return;
            try {
                this.camera.detachPostProcess(pp);
            } catch {
                // already detached / camera gone
            }
            try {
                pp.dispose(this.camera);
            } catch {
                // already disposed
            }
        };

        disposePp(this.gridLayoutPostProcess);
        this.gridLayoutPostProcess = null;
        disposePp(this.glitch00PostProcess);
        this.glitch00PostProcess = null;
        disposePp(this.glitch01PostProcess);
        this.glitch01PostProcess = null;
        disposePp(this.glitch02PostProcess);
        this.glitch02PostProcess = null;
        disposePp(this.pixelationPostProcess);
        this.pixelationPostProcess = null;
        disposePp(this.shatteringPostProcess);
        this.shatteringPostProcess = null;
        disposePp(this.toneMappingPostProcess);
        this.toneMappingPostProcess = null;
        disposePp(this.distortionPostProcess);
        this.distortionPostProcess = null;
        disposePp(this.negativePostProcess);
        this.negativePostProcess = null;
        disposePp(this.squareShatterPostProcess);
        this.squareShatterPostProcess = null;
        disposePp(this.radialBlurPostProcess);
        this.radialBlurPostProcess = null;
        disposePp(this.rgbPostProcess);
        this.rgbPostProcess = null;
    }
}
