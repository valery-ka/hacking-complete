import {
    Scene,
    Mesh,
    SolidParticleSystem,
    StandardMaterial,
    MeshBuilder,
    Vector3,
    Scalar,
    Color4,
    TransformNode,
} from "@babylonjs/core";
import { createWireCube } from "utils/babylon";
import { EffectLifetime } from "core/effects/EffectLifetime";

interface MaterialPair {
    material: StandardMaterial;
    baseColor: Color4;
}

interface ScaleRange {
    a: number;
    b: number;
}

type ExplodeArgs = [
    Mesh | TransformNode,
    number,
    number,
    number,
    number,
    string,
    number,
    number,
    string,
    number?,
    number?,
    boolean?,
];

const WHITE_COLOR = new Color4(0.95, 0.95, 0.95, 1);
const LIGHT_COLOR = new Color4(0.97, 0.96, 0.87, 1);
const DARK_COLOR = new Color4(0.24, 0.23, 0.19, 1);
const RED_COLOR = new Color4(1.0, 0.34, 0.17, 1);
const GREEN_COLOR = new Color4(0.0, 1.0, 0.0, 1);
const BLUE_COLOR = new Color4(0.0, 0.0, 1.0, 1);
const YELLOW_COLOR = new Color4(1.0, 1.0, 0.0, 1);

export class CubesExplosion {
    private scene: Scene;
    private readonly lifetime = new EffectLifetime();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public dispose() {
        this.lifetime.dispose();
    }

    getMaterialPair(material: string): MaterialPair {
        switch (material) {
            case "light":
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_light_material,
                    baseColor: LIGHT_COLOR,
                };
            case "dark":
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_dark_material,
                    baseColor: DARK_COLOR,
                };
            case "white":
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_white_material,
                    baseColor: WHITE_COLOR,
                };
            case "red":
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_red_material,
                    baseColor: WHITE_COLOR,
                };
            case "green":
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_green_material,
                    baseColor: GREEN_COLOR,
                };
            case "blue":
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_blue_material,
                    baseColor: BLUE_COLOR,
                };
            case "yellow":
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_yellow_material,
                    baseColor: YELLOW_COLOR,
                };
            default:
                return {
                    material: this.scene.metadata.effects_assets.cubes_explosion_dark_material,
                    baseColor: DARK_COLOR,
                };
        }
    }

    getCubesScale(material: string): ScaleRange {
        switch (material) {
            case "very-very-small":
                return {
                    a: 0.03,
                    b: 0.06,
                };
            case "very-small":
                return {
                    a: 0.01,
                    b: 0.1,
                };
            case "small":
                return {
                    a: 0.2,
                    b: 0.3,
                };
            case "medium":
                return {
                    a: 0.2,
                    b: 0.5,
                };
            case "large":
                return {
                    a: 0.4,
                    b: 1.0,
                };
            default:
                return {
                    a: 0.2,
                    b: 0.5,
                };
        }
    }

    public explode(
        parent: Mesh | TransformNode,
        innerRadius: number,
        outerRadius: number,
        normalCount: number,
        wireCount: number,
        material: string = "dark",
        velocityP: number = 0.5,
        velocityR: number = 0.05,
        size: string = "medium",
        lifeTime: number = 0.5,
        velocityDecrease: number = 0.995,
        useGravity: boolean = false,
    ) {
        const { material: mat, baseColor: baseColor } = this.getMaterialPair(material);

        const box = MeshBuilder.CreateBox("particle-box", { size: 1 }, this.scene);

        const spsNormal = new SolidParticleSystem(`mini-sps-normal-${material}`, this.scene);
        spsNormal.addShape(box, normalCount);
        const meshNormal = spsNormal.buildMesh();
        meshNormal.material = mat;
        meshNormal.hasVertexAlpha = true;
        box.dispose();

        const wireBox = createWireCube(this.scene, { size: 1 });

        const spsWire = new SolidParticleSystem(`mini-sps-wire-${material}`, this.scene);
        spsWire.addShape(wireBox, wireCount);
        const meshWire = spsWire.buildMesh();
        meshWire.hasVertexAlpha = true;
        meshWire.material = mat;
        wireBox.dispose();

        const { a: a, b: b } = this.getCubesScale(size);

        const initParticles = (sps: SolidParticleSystem) => {
            for (let i = 0; i < sps.nbParticles; i++) {
                const p = sps.particles[i];
                const localPos = this.randomPositionInside(
                    Vector3.Zero(),
                    innerRadius,
                    outerRadius,
                );

                let worldPos = localPos.add(parent.position);
                if (parent.rotationQuaternion) {
                    worldPos = Vector3.TransformCoordinates(localPos, parent.getWorldMatrix());
                }

                const scale = Scalar.RandomRange(a, b);
                p.position.copyFrom(worldPos);
                p.scale.setAll(scale);
                p.rotation = this.randomRotation();
                p.color = baseColor;

                let localDir = localPos.normalize();
                if (parent.rotationQuaternion) {
                    localDir = Vector3.TransformNormal(
                        localDir,
                        parent.getWorldMatrix(),
                    ).normalize();
                }

                const speed = Scalar.RandomRange(0.02, 0.05);

                p.props = {
                    velocity: localDir.scale(speed),
                    age: 0,
                    lifeTime: lifeTime + Math.random() * 0.25,
                    initialPosition: worldPos.clone(),
                    initialScale: scale,
                };
            }
        };

        initParticles(spsNormal);
        initParticles(spsWire);

        spsNormal.setParticles();
        spsWire.setParticles();

        spsNormal.mesh.alwaysSelectAsActiveMesh = true;
        spsWire.mesh.alwaysSelectAsActiveMesh = true;

        let v = velocityP;
        let r = velocityR;

        const updateParticle = (particle: any) => {
            if (this.scene.metadata.gameClock.paused) return;

            const dt = this.scene.getEngine().getDeltaTime();

            const props = particle.props;
            if (!props) return particle;

            const lerp = (speed: number) => 1 - Math.pow(1 - speed, dt / 16.6667);

            if (useGravity) props.velocity.y += -0.1 * lerp(0.02);

            particle.position.addInPlace(props.velocity.scale(v));
            particle.rotation.x += lerp(r);
            particle.rotation.y += lerp(r);

            v = v * velocityDecrease;
            r = r * 0.99;

            props.age += lerp(0.05);

            const lifeRatio = props.age / props.lifeTime;
            const fadeStart = 0.25;

            if (particle.color) {
                particle.color.a =
                    lifeRatio < fadeStart ? 1 : 1 - (lifeRatio - fadeStart) / (1 - fadeStart);
            }

            return particle;
        };

        spsNormal.updateParticle = updateParticle;
        spsWire.updateParticle = updateParticle;

        let elapsed = 0;
        let unsubscribe = () => {};

        const finish = this.lifetime.track(() => {
            unsubscribe();
            meshNormal.material = null;
            meshWire.material = null;
            if (!meshNormal.isDisposed()) meshNormal.dispose();
            if (!meshWire.isDisposed()) meshWire.dispose();
            spsNormal.dispose();
            spsWire.dispose();
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            if (this.scene.metadata.gameClock.paused) return;

            elapsed += dt;

            spsNormal.setParticles();
            spsWire.setParticles();

            if (elapsed >= lifeTime) {
                finish();
            }
        });
    }

    private randomPositionInside(
        center: Vector3,
        innerRadius: number,
        outerRadius: number,
    ): Vector3 {
        const r = Scalar.RandomRange(innerRadius, outerRadius);

        const theta = Scalar.RandomRange(0, Math.PI * 2);
        const phi = Scalar.RandomRange(0, Math.PI / 2);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);

        return center.add(new Vector3(x, y, z));
    }

    private randomRotation(): Vector3 {
        return new Vector3(
            Scalar.RandomRange(0, Math.PI * 2),
            Scalar.RandomRange(0, Math.PI * 2),
            Scalar.RandomRange(0, Math.PI * 2),
        );
    }

    private scheduleExplosions(schedule: { delay: number; args: ExplodeArgs }[]) {
        let elapsed = 0;
        let unsubscribe = () => {};

        const finish = this.lifetime.track(() => {
            unsubscribe();
        });

        unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            if (this.scene.metadata.gameClock.paused) return;

            elapsed += dt;

            while (schedule.length && elapsed >= schedule[0].delay) {
                const item = schedule.shift()!;
                this.explode(...item.args);
            }

            if (schedule.length === 0) {
                finish();
            }
        });
    }

    public apply(parent: Mesh | TransformNode, material: string = "dark", size: string = "medium") {
        this.explode(parent, 0.5, 5, 9, 3, material, 2.5, 0.25, size);
    }

    public applyTinyExplosion(
        parent: Mesh | TransformNode,
        material: string = "dark",
        size: string = "medium",
    ) {
        this.explode(parent, 0.5, 1.5, 3, 3, material, 1.0, 0.1, size);
    }

    public applySmallExplosion(
        parent: Mesh | TransformNode,
        material: string = "dark",
        size: string = "medium",
    ) {
        this.explode(parent, 0.5, 2.0, 20, 0, material, 5, 0.1, size, 1.0);
    }

    public applySphereBombExplosion(
        parent: Mesh | TransformNode,
        material: string = "dark",
        size: string = "medium",
    ) {
        const schedule: { delay: number; args: ExplodeArgs }[] = [
            { delay: 0, args: [parent, 0.0, 1.0, 50, 1, material, 5, 0.1, size, 2.5, 0.999, true] },
            { delay: 0, args: [parent, 0.0, 1.0, 25, 1, "dark", 5, 0.1, size, 2.0, 0.999, true] },
        ];

        this.scheduleExplosions(schedule);
    }

    public applyConfettiExplosion(parent: Mesh | TransformNode, size: string = "very-small") {
        const colors = ["red", "green", "blue", "yellow", "white"];

        const shuffledColors = [...colors];
        for (let i = shuffledColors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
        }
        const selectedColors = shuffledColors.slice(0, 1);

        const schedule = selectedColors.map((color, index) => ({
            delay: index * 0.01,
            args: [parent, 0.0, 1.0, 25, 1, color, 5, 0.1, size, 2.0, 0.999, true] as ExplodeArgs,
        }));

        this.scheduleExplosions(schedule);
    }

    public applyCore(
        parent: Mesh | TransformNode,
        material: string = "dark",
        size: string = "medium",
    ) {
        const schedule: { delay: number; args: ExplodeArgs }[] = [
            { delay: 0, args: [parent, 2, 3, 10, 1, material, 1.0, 0.1, size] },
            { delay: 0.1, args: [parent, 4, 5, 13, 2, material, 1.0, 0.1, size] },
            { delay: 0.2, args: [parent, 6, 7, 16, 2, material, 1.0, 0.1, size] },
            { delay: 0.3, args: [parent, 8, 9, 19, 3, material, 1.0, 0.1, size] },
            { delay: 0.35, args: [parent, 10, 11, 22, 3, material, 1.0, 0.1, size] },
            { delay: 0.4, args: [parent, 12, 13, 25, 3, material, 1.0, 0.1, size] },
        ];

        this.scheduleExplosions(schedule);
    }
}
