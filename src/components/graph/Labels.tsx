/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/SimpleForceGraph/Labels.tsx
*/

import * as React from 'react';

import {node} from '@src/models/GraphView';

import Label from './Label';

export default function Labels(props: ILabelsProps): JSX.Element {
    const labels = props.nodes.map((node: node) => {
        return <Label key={`label-${node.label}`} node={node} />;
    });
    return <g className="labels">{labels}</g>;
}

interface ILabelsProps {
    nodes: node[];
}
