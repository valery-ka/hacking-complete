export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface Scale {
    w: number;
    h: number;
    d: number;
}

export interface Rotation {
    x: number;
    y: number;
    z: number;
}

export interface InvisibleTriggerAudio {
    name: string;
    volume: number;
}

export interface InvisibleTriggerConfig {
    position: Position;
    scale: Scale;
    rotation: Rotation;
    trigger: {
        pool: number;
        action: string;
        disposable: boolean;
        audio?: InvisibleTriggerAudio;
    };
    reset_killing_count?: boolean;
}
