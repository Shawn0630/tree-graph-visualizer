/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/SimpleForceGraph/Circles.tsx
*/

import * as React from 'react';

import {node} from '@src/models/GraphViewModels';

import Circle from './Circle';

export default function Circles(props: ICirclesProps): JSX.Element {
    const nodes = props.nodes.map((node: node) => {
        return <Circle key={`node-${node.id}`} node={node} />;
    });
    return <g className="nodes">{nodes}</g>;
}

interface ICirclesProps {
    nodes: node[];
}
