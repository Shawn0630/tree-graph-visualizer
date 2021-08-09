export type node = {
    id: number;
    label?: string;
    group?: number;
    radiusSize?: number;
    fillColor?: string;
};
export type point = {
    x: number;
    y: number;
};
export type datum = {
    x: number;
    y: number;
    fx: number | null;
    fy: number | null;
};
export type pointLink = {
    source: point;
    target: point;
};
