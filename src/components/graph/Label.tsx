/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/SimpleForceGraph/Label.tsx
*/

import * as d3 from 'd3';
import * as React from 'react';
import {Dispatch, SetStateAction} from 'react';

import {node} from '@src/models/GraphViewModels';

export default function Label(props: ILabelProps): JSX.Element {
    let ref: SVGTextElement | undefined;

    React.useEffect(() => {
        if (ref) d3.select(ref).data([props.node]);
    });

    return (
        <text
            style={{cursor: 'pointer'}}
            className="label"
            // eslint-disable-next-line no-return-assign
            ref={(reference: SVGTextElement) => (ref = reference)}
        >
            {props.node.label}
        </text>
    );
}

interface ILabelProps {
    node: node;
}
