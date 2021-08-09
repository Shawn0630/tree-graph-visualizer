import {datum, node} from './ViewModels';

export type link = {
    source: number;
    target: number;
    value?: string;
};
export type extendedLink = {
    source: node & datum;
    target: node & datum;
};
export type Graph = {
    nodes: node[];
    links: link[];
};
