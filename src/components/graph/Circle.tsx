/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/SimpleForceGraph/Circle.tsx
*/

import * as d3 from 'd3';
import {D3DragEvent} from 'd3';
import * as React from 'react';

import {datum, node} from '@src/models/GraphViewModels';

export default function Circle(props: ICircleProps): JSX.Element {
    let ref: SVGCircleElement | undefined;

    React.useEffect(() => {
        if (ref) d3.select(ref).data([props.node]);
    });

    return (
        // eslint-disable-next-line no-return-assign
        <circle
            className="node"
            r={props.node.radiusSize ? props.node.radiusSize : 3}
            fill={
                (props.node.fillColor as string)
                    ? props.node.fillColor
                    : 'black'
            }
            ref={(reference: SVGCircleElement) => (ref = reference)}
        >
            <title>{props.node.label}</title>
        </circle>
    );
}

interface ICircleProps {
    node: node;
}
