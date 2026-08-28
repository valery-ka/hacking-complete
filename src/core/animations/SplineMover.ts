import { Scalar, Scene, Mesh, Vector3 } from "@babylonjs/core";

type SplineStep = `${"x" | "y" | "z"}:${number}`;

interface SplineMoverParams {
    scene: Scene;
    target: Mesh;

    spline: SplineStep[];

    startPosition?: Vector3;

    speed?: number;
    loop?: boolean;

    pauseTime?: number;

    rotateToDirection?: boolean;
    reverse?: boolean;
}

export class SplineMover {
    private readonly scene: Scene;
    private readonly target: Mesh;

    private readonly path: Vector3[] = [];

    private readonly segmentLengths: number[] = [];
    private totalLength = 0;

    private readonly speed: number;
    private readonly loop: boolean;
    private readonly pauseTime: number;

    private readonly rotateToDirection: boolean;
    private readonly reverse: boolean;

    private distance = 0;

    private pauseTimer = 0;
    private paused = false;

    private observer: any = null;

    constructor(params: SplineMoverParams) {
        this.scene = params.scene;
        this.target = params.target;

        this.speed = params.speed ?? 5;
        this.loop = params.loop ?? true;
        this.pauseTime = params.pauseTime ?? 0;

        this.rotateToDirection = params.rotateToDirection ?? false;
        this.reverse = params.reverse ?? false;

        const start = params.startPosition?.clone() ?? this.target.position.clone();

        this.path.push(start);

        let current = start.clone();

        for (const step of params.spline) {
            const [axis, rawValue] = step.split(":");
            const value = parseFloat(rawValue);

            const next = current.clone();

            switch (axis) {
                case "x":
                    next.x += value;
                    break;

                case "y":
                    next.y += value;
                    break;

                case "z":
                    next.z += value;
                    break;
            }

            this.path.push(next);

            const length = Vector3.Distance(current, next);

            this.segmentLengths.push(length);
            this.totalLength += length;

            current = next;
        }
    }

    public start() {
        if (this.observer) return;

        this.observer = this.scene.metadata.gameClock.subscribe((dt: number) => {
            dt = Math.min(dt, 1 / 30);

            if (this.paused) {
                this.pauseTimer += dt;

                if (this.pauseTimer >= this.pauseTime) {
                    this.paused = false;
                    this.pauseTimer = 0;
                }

                return;
            }

            const direction = this.reverse ? -1 : 1;

            this.distance += this.speed * dt * direction;

            if (this.loop) {
                this.distance = Scalar.Repeat(this.distance, this.totalLength);
            } else {
                this.distance = Scalar.Clamp(this.distance, 0, this.totalLength);
            }

            const result = this.getPositionAtDistance(this.distance);

            this.target.position.copyFrom(result.position);

            if (this.rotateToDirection) {
                const dir = result.direction;

                if (dir.lengthSquared() > 0.0001) {
                    this.target.lookAt(this.target.position.add(dir));
                }
            }

            this.target.physicsImpostor?.forceUpdate();

            if (!this.loop && (this.distance <= 0 || this.distance >= this.totalLength)) {
                if (this.pauseTime > 0) {
                    this.paused = true;
                }
            }
        });
    }

    public stop() {
        if (!this.observer) return;

        this.observer();
        this.observer = null;
    }

    public dispose() {
        this.stop();
    }

    private getPositionAtDistance(distance: number) {
        let accumulated = 0;

        for (let i = 0; i < this.segmentLengths.length; i++) {
            const segmentLength = this.segmentLengths[i];

            if (distance <= accumulated + segmentLength) {
                const localDistance = distance - accumulated;

                const t = segmentLength <= 0 ? 0 : localDistance / segmentLength;

                const from = this.path[i];
                const to = this.path[i + 1];

                const position = Vector3.Lerp(from, to, t);

                const direction = to.subtract(from).normalize();

                return {
                    position,
                    direction,
                };
            }

            accumulated += segmentLength;
        }

        const last = this.path[this.path.length - 1];

        return {
            position: last.clone(),
            direction: Vector3.Forward(),
        };
    }
}
