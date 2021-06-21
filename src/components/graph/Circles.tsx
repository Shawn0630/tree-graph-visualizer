/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/SimpleForceGraph/Circles.tsx
*/

import * as d3 from 'd3';
import * as React from 'react';

import {datum, node} from '~src/models/GraphViewModels';

import Circle from './Circle';

export default function Circles(props: ICirclesProps): JSX.Element {
    React.useEffect(() => {
        if (props.allowDragNDrop) {
            setMouseEventsListeners();
        }
    });

    function setMouseEventsListeners(): void {
        d3.selectAll('.node')
            // @ts-ignore
            .call(
                d3
                    .drag<SVGCircleElement, datum>()
                    .on('start', onDragStart)
                    .on('drag', onDrag)
                    .on('end', onDragEnd),
            )
            .on('mouseover', focus)
            .on('mouseout', unfocus);

        // @ts-ignore
        function onDragStart(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: datum,
        ) {
            if (props.allowDragNDrop) {
                if (!event.active && props.restartDrag) {
                    props.restartDrag();
                }
                // eslint-disable-next-line no-param-reassign
                d.fx = d.x;
                // eslint-disable-next-line no-param-reassign
                d.fy = d.y;
            }
        }

        function onDrag(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: datum,
        ) {
            if (props.allowDragNDrop) {
                // eslint-disable-next-line no-param-reassign
                d.fx = event.x;
                // eslint-disable-next-line no-param-reassign
                d.fy = event.y;
            }
        }

        function onDragEnd(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: datum,
        ) {
            if (props.allowDragNDrop) {
                if (!event.active && props.stopDrag) {
                    props.stopDrag();
                }
                // eslint-disable-next-line no-param-reassign
                d.fx = null;
                // eslint-disable-next-line no-param-reassign
                d.fy = null;
            }
        }

        function focus(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: node,
        ) {
            if (!event.active && props.focus) {
                props.focus(d.id);
            }
        }

        function unfocus(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: node,
        ) {
            if (!event.active && props.unfocus) {
                props.unfocus();
            }
        }
    }

    const nodes = props.nodes.map((node: node) => {
        return <Circle key={`node-${node.id}`} node={node} />;
    });
    return <g className="nodes">{nodes}</g>;
}

interface ICirclesProps {
    nodes: node[];
    allowDragNDrop?: boolean;
    restartDrag?: () => void;
    stopDrag?: () => void;
    focus?: (id: number) => void;
    unfocus?: () => void;
}
