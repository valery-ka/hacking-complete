import {
    Scene,
    DefaultRenderingPipeline,
    Vector2,
    Camera,
    Observer,
    AbstractEngine,
} from "@babylonjs/core";

import { Nullable } from "types/common";
import { disposeLeftoverCameraPostProcesses } from "utils/babylon";

import { REFERENCE_WIDTH } from "core_constants";

export class RenderingPipeline {
    private scene: Scene;
    public renderingPipeline: Nullable<DefaultRenderingPipeline> = null;

    private chromaticBaseAmount = 75;
    private chromaticEnabled = false;
    private resizeObserver: Nullable<Observer<AbstractEngine>> = null;

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public create(camera?: Camera) {
        if (this.renderingPipeline) return;

        let cameras: Camera[];

        if (camera) {
            cameras = [camera];
        } else {
            cameras = [this.scene.metadata?.cameras?.[0], this.scene.metadata?.cameras?.[1]].filter(
                Boolean,
            );
        }

        this.renderingPipeline = new DefaultRenderingPipeline(
            "default-rendering-pipeline",
            false,
            this.scene,
            cameras,
        );
    }

    private getAttachedCameras(): Camera[] {
        const pipeline = this.renderingPipeline as any;
        if (!pipeline) return [];
        return [...(pipeline.cameras ?? pipeline._cameras ?? [])].filter(Boolean);
    }

    public detachAllCameras() {
        if (!this.renderingPipeline) return;
        const cameras = this.getAttachedCameras();
        if (!cameras.length) return;

        try {
            this.scene.postProcessRenderPipelineManager.detachCamerasFromRenderPipeline(
                this.renderingPipeline.name,
                cameras,
            );
        } catch {
            // cameras may already be disposed
        }
    }

    public attachCameras(cameras: Camera[]) {
        if (!this.renderingPipeline) return;
        const next = cameras.filter((camera) => camera && !camera.isDisposed?.());
        if (!next.length) return;

        this.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
            this.renderingPipeline.name,
            next,
            true,
        );
    }

    public enableFXAA() {
        if (this.renderingPipeline) {
            this.renderingPipeline.fxaaEnabled = true;
        }
    }

    public disableFXAA() {
        if (this.renderingPipeline) {
            this.renderingPipeline.fxaaEnabled = false;
        }
    }

    public enableChromaticAbberation(
        aberrationAmount: number = 75,
        radialIntensity: number = 0.66,
    ) {
        if (!this.renderingPipeline) return;

        this.chromaticBaseAmount = aberrationAmount;
        this.chromaticEnabled = true;

        this.renderingPipeline.chromaticAberrationEnabled = true;
        this.renderingPipeline.chromaticAberration.radialIntensity = radialIntensity;
        this.renderingPipeline.chromaticAberration.direction = new Vector2(0.5, -0.5);
        this.applyResolutionScaledChromaticAberration();

        if (!this.resizeObserver) {
            this.resizeObserver = this.scene.getEngine().onResizeObservable.add(() => {
                this.applyResolutionScaledChromaticAberration();
            });
        }
    }

    public disableChromaticAbberation() {
        this.chromaticEnabled = false;
        this.clearResizeObserver();

        if (this.renderingPipeline) {
            this.renderingPipeline.chromaticAberration.aberrationAmount = 0;
            this.renderingPipeline.chromaticAberrationEnabled = false;
        }
    }

    private applyResolutionScaledChromaticAberration() {
        if (!this.renderingPipeline || !this.chromaticEnabled) return;

        const engine = this.scene.getEngine();
        const width = engine.getRenderWidth();
        const height = engine.getRenderHeight();
        const ca = this.renderingPipeline.chromaticAberration;

        // Babylon freezes these at pipeline creation; without a refresh the UV
        // offset stays calibrated to the old size (e.g. 1280 → fullscreen = 2×).
        ca.screenWidth = width;
        ca.screenHeight = height;
        ca.aberrationAmount =
            this.chromaticBaseAmount * (width / REFERENCE_WIDTH);
    }

    private clearResizeObserver() {
        if (this.resizeObserver) {
            this.scene.getEngine().onResizeObservable.remove(this.resizeObserver);
            this.resizeObserver = null;
        }
    }

    public enableGrain(strength: number = 100) {
        if (this.renderingPipeline) {
            this.renderingPipeline.grainEnabled = true;
            this.renderingPipeline.grain.animated = true;
            this.renderingPipeline.grain.intensity = strength;
        }
    }

    public disableGrain() {
        if (this.renderingPipeline) {
            this.renderingPipeline.grainEnabled = false;
        }
    }

    public enableVignette() {
        this.scene.imageProcessingConfiguration.vignetteEnabled = true;
        this.scene.imageProcessingConfiguration.vignetteWeight = 1.5;
        this.scene.imageProcessingConfiguration.vignetteCameraFov = 0.5;
    }

    public disableVignette() {
        if (this.renderingPipeline) {
            this.scene.imageProcessingConfiguration.vignetteWeight = 0.0;
        }
    }

    public enableDOF() {
        if (this.renderingPipeline) {
            this.renderingPipeline.depthOfFieldEnabled = true;
            this.renderingPipeline.depthOfFieldBlurLevel = 2;
            this.renderingPipeline.depthOfField.fStop = 50.0;
        }
    }

    public disableDOF() {
        if (this.renderingPipeline) {
            this.renderingPipeline.depthOfField.fStop = 50.0;
        }
    }

    public dispose() {
        this.chromaticEnabled = false;
        this.clearResizeObserver();
        this.scene.imageProcessingConfiguration.vignetteEnabled = false;

        const cameras = this.getAttachedCameras();
        this.detachAllCameras();

        if (this.renderingPipeline) {
            this.renderingPipeline.fxaaEnabled = false;
            this.renderingPipeline.chromaticAberrationEnabled = false;
            this.renderingPipeline.grainEnabled = false;
            this.renderingPipeline.depthOfFieldEnabled = false;
            this.renderingPipeline.dispose();
            this.renderingPipeline = null;
        }

        for (const camera of cameras) {
            disposeLeftoverCameraPostProcesses(camera);
        }
    }
}
