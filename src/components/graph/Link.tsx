/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/SimpleForceGraph/Node.tsx
*/

import * as d3 from 'd3';
import * as React from 'react';

import {link} from '@src/models/GraphViewModels';

export default function Link(props: ILinkProps): JSX.Element {
    let ref: SVGElement | undefined;

    React.useEffect(() => {
        if (ref) d3.select(ref).data([props.link]);
    });

    return (
        <g className="linkGroup">
            <line
                // eslint-disable-next-line no-return-assign
                ref={(referce: SVGLineElement) => (ref = referce)}
                className="link"
            />
        </g>
    );
}

interface ILinkProps {
    link: link;
}
