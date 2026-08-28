import { Scene } from "@babylonjs/core";
import { BaseAttack } from "./BaseAttack";

export class AttackManager {
    private attacks: BaseAttack[] = [];
    private delayedSubscriptions = new Map<BaseAttack, () => void>();

    constructor(private readonly scene: Scene) {}

    public add<T extends BaseAttack>(attack: T, delay: number = 0): T {
        attack.setDisposeCallback(() => {
            this.remove(attack);
        });

        this.attacks.push(attack);

        if (delay <= 0) {
            attack.start();

            return attack;
        }

        let elapsed = 0;

        const unsubscribe = this.scene.metadata.gameClock.subscribe((dt: number) => {
            if (attack.disposed) {
                unsubscribe();

                this.delayedSubscriptions.delete(attack);

                return;
            }

            elapsed += dt;

            if (elapsed >= delay) {
                unsubscribe();

                this.delayedSubscriptions.delete(attack);

                attack.start();
            }
        });

        this.delayedSubscriptions.set(attack, unsubscribe);

        return attack;
    }

    private remove(attack: BaseAttack) {
        const delayed = this.delayedSubscriptions.get(attack);

        if (delayed) {
            delayed();

            this.delayedSubscriptions.delete(attack);
        }

        const index = this.attacks.indexOf(attack);

        if (index !== -1) {
            this.attacks.splice(index, 1);
        }
    }

    public disposeAll() {
        for (const unsubscribe of this.delayedSubscriptions.values()) {
            unsubscribe();
        }
        this.delayedSubscriptions.clear();

        [...this.attacks].forEach((attack) => {
            attack.dispose();
        });

        this.attacks = [];
    }
}
