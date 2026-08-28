export type BobAxisParams = {
    amplitude?: number;
    speed?: number;
};

export type BobAnimation = {
    axes?: {
        x?: BobAxisParams;
        y?: BobAxisParams;
        z?: BobAxisParams;
    };
    frames?: number;
};

export type CircleAnimation = {
    plane?: "xy" | "xz" | "yz";
    radius?: number;
    speed?: number;
    frames?: number;
    from?: number;
};

export type AnimationName = "bob" | "circle";

export type AnimationParamsMap = {
    bob?: BobAnimation;
    circle?: CircleAnimation;
};

export type EnemyAnimation = {
    enabled: boolean;
    name?: string;
    params?: any;
};
