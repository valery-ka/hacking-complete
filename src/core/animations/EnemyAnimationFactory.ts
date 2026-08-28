import { Animation, Vector3 } from "@babylonjs/core";

export class EnemyAnimationFactory {
    static create(animation: any, position: Vector3): Animation[] | null {
        switch (animation.animation_name) {
            case "bob": {
                const {
                    axes = {},
                    frames = 180,
                    is_linear = false,
                } = animation.animation_params || {};
                const anims: Animation[] = [];

                for (const axis of ["x", "y", "z"] as const) {
                    const axisParams = axes[axis];
                    if (!axisParams) continue;

                    const amplitude = axisParams.amplitude ?? 5;
                    const speed = axisParams.speed ?? 60;

                    const anim = new Animation(
                        `bob-${axis}`,
                        `position.${axis}`,
                        speed,
                        Animation.ANIMATIONTYPE_FLOAT,
                        Animation.ANIMATIONLOOPMODE_CYCLE,
                    );

                    const baseValue = position[axis];
                    const keys = [];

                    if (is_linear) {
                        const halfFrames = frames / 2;

                        for (let i = 0; i <= frames; i++) {
                            let offset: number;

                            if (i <= halfFrames) {
                                const t = i / halfFrames;
                                offset = -amplitude + t * amplitude * 2;
                            } else {
                                const t = (i - halfFrames) / halfFrames;
                                offset = amplitude - t * amplitude * 2;
                            }

                            keys.push({ frame: i, value: baseValue + offset });
                        }
                    } else {
                        for (let i = 0; i <= frames; i++) {
                            const t = (i / frames) * Math.PI * 2;
                            const offset = Math.sin(t) * amplitude;
                            keys.push({ frame: i, value: baseValue + offset });
                        }
                    }

                    anim.setKeys(keys);
                    anims.push(anim);
                }

                return anims;
            }

            case "circle": {
                const {
                    frames = 180,
                    radius = 5,
                    speed = 60,
                    plane = "xz",
                } = animation.animation_params || {};
                const anims: Animation[] = [];

                const axes = plane.split("");
                if (axes.length !== 2) return null;

                const [a1, a2] = axes as ("x" | "y" | "z")[];

                const anim1 = new Animation(
                    `circle-${a1}`,
                    `position.${a1}`,
                    speed,
                    Animation.ANIMATIONTYPE_FLOAT,
                    Animation.ANIMATIONLOOPMODE_CYCLE,
                );

                const anim2 = new Animation(
                    `circle-${a2}`,
                    `position.${a2}`,
                    speed,
                    Animation.ANIMATIONTYPE_FLOAT,
                    Animation.ANIMATIONLOOPMODE_CYCLE,
                );

                const base1 = position[a1];
                const base2 = position[a2];

                const keys1 = [];
                const keys2 = [];

                for (let i = 0; i <= frames; i++) {
                    const t = (i / frames) * Math.PI * 2;
                    keys1.push({ frame: i, value: base1 + Math.cos(t) * radius });
                    keys2.push({ frame: i, value: base2 + Math.sin(t) * radius });
                }

                anim1.setKeys(keys1);
                anim2.setKeys(keys2);

                anims.push(anim1, anim2);
                return anims;
            }

            case "glitch_position": {
                const {
                    frames = 48,
                    radius = 2,
                    speed = 60,
                    keyframes = 24,
                } = animation.animation_params || {};
                const axes = ["x", "y", "z"] as const;
                const points: Vector3[] = [position.clone()];
                const pointCount = Math.max(2, Math.floor(keyframes));

                for (let i = 1; i < pointCount; i++) {
                    const direction = new Vector3(
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1,
                        Math.random() * 2 - 1,
                    );

                    if (direction.lengthSquared() < 0.0001) {
                        direction.set(1, 0, 0);
                    }

                    const distance = Math.cbrt(Math.random()) * radius;
                    points.push(position.add(direction.normalize().scale(distance)));
                }

                points.push(position.clone());

                return axes.map((axis) => {
                    const anim = new Animation(
                        `glitch-position-${axis}`,
                        `position.${axis}`,
                        speed,
                        Animation.ANIMATIONTYPE_FLOAT,
                        Animation.ANIMATIONLOOPMODE_CYCLE,
                    );

                    anim.setKeys(
                        points.map((point, index) => ({
                            frame: (index / (points.length - 1)) * frames,
                            value: point[axis],
                        })),
                    );

                    return anim;
                });
            }

            case "glitch_rotation": {
                const {
                    frames = 48,
                    speed = 60,
                    keyframes = 24,
                    turns = 2,
                } = animation.animation_params || {};
                const axes = ["x", "y", "z"] as const;
                const pointCount = Math.max(2, Math.floor(keyframes));
                const rotations: Vector3[] = [Vector3.Zero()];
                const maxAngle = Math.PI * 2 * turns;

                for (let i = 1; i < pointCount; i++) {
                    rotations.push(
                        new Vector3(
                            (Math.random() * 2 - 1) * maxAngle,
                            (Math.random() * 2 - 1) * maxAngle,
                            (Math.random() * 2 - 1) * maxAngle,
                        ),
                    );
                }

                rotations.push(Vector3.Zero());

                return axes.map((axis) => {
                    const anim = new Animation(
                        `glitch-rotation-${axis}`,
                        `rotation.${axis}`,
                        speed,
                        Animation.ANIMATIONTYPE_FLOAT,
                        Animation.ANIMATIONLOOPMODE_CYCLE,
                    );

                    anim.setKeys(
                        rotations.map((rotation, index) => ({
                            frame: (index / (rotations.length - 1)) * frames,
                            value: rotation[axis],
                        })),
                    );

                    return anim;
                });
            }

            default:
                return null;
        }
    }
}
