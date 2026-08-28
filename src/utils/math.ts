export function deg2rad(deg: number) {
    return (deg * Math.PI) / 180;
}

export function normalizeAngleDifference(target: number, current: number): number {
    let diff = target - current;
    diff = ((diff + Math.PI) % (2 * Math.PI)) - Math.PI;
    return diff < -Math.PI ? diff + 2 * Math.PI : diff;
}

export function generateDirections(n: number, offset = 0): number[] {
    const step = Math.PI / n;
    const directions: number[] = [];

    for (let i = 0; i < n; i++) {
        directions.push(-Math.PI / 2 + i * step + offset);
    }
    for (let i = 0; i < n; i++) {
        directions.push(-Math.PI / 2 + i * step + Math.PI + offset);
    }

    return directions;
}
