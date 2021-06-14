export type node = {
    id: number;
    label?: string;
    group?: number;
    radiusSize?: number;
    fillColor?: string;
};
export type link = {
    source: number;
    target: number;
    value?: string;
};
export type Graph = {
    nodes: node[];
    links: link[];
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
