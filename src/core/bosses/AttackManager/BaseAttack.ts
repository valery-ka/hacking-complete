import { Scene, TransformNode } from "@babylonjs/core";

export abstract class BaseAttack {
    protected scene: Scene;

    protected parent: TransformNode;

    private subscriptions: Array<() => void> = [];

    private onDispose?: () => void;
    private onFinished?: () => void;

    protected isDisposed = false;

    constructor(scene: Scene, parent: TransformNode) {
        this.scene = scene;
        this.parent = parent;
    }

    public get disposed() {
        return this.isDisposed;
    }

    public setDisposeCallback(callback: () => void) {
        this.onDispose = callback;
    }

    public setFinishedCallback(callback: () => void) {
        this.onFinished = callback;
    }

    protected subscribe(callback: (dt: number) => void) {
        const wrappedCallback = (dt: number) => {
            if (this.isDisposed) return;

            callback(dt);
        };

        const unsubscribe = this.scene.metadata.gameClock.subscribe(wrappedCallback);

        this.subscriptions.push(unsubscribe);

        return unsubscribe;
    }

    protected unsubscribe(unsubscribe: () => void) {
        unsubscribe();

        const index = this.subscriptions.indexOf(unsubscribe);

        if (index !== -1) {
            this.subscriptions.splice(index, 1);
        }
    }

    protected unsubscribeAll() {
        this.subscriptions.forEach((unsubscribe) => {
            unsubscribe();
        });

        this.subscriptions = [];
    }

    public abstract start(): void;

    protected finish() {
        this.onFinished?.();
    }

    public dispose() {
        if (this.isDisposed) return;

        this.isDisposed = true;

        this.unsubscribeAll();

        this.onDispose?.();
    }
}
