import './GraphVisualizer.scss';
import './GraphVisualizer.scss';

import * as d3 from 'd3';
import * as React from 'react';

import {Graph, link, node, point} from '@src/models/GraphView';

import Circles from './Circles';
import Labels from './Labels';
import Links from './Links';

interface GraphVisualizerProps {
    width: number;
    height: number;
    data: Graph;
    linkDistance: number;
    linkStrength: number;
    chargeStrength: number;
    centerWidth: number;
    centerHeight: number;
}
interface Link {
    source: number;
    target: number;
}
export default function GraphVisualizer(
    props: GraphVisualizerProps,
): JSX.Element {
    /* The useRef Hook creates a variable that "holds on" to a value across rendering
    passes. In this case it will hold our component's SVG DOM element. It's
    initialized null and React will assign it later (see the return statement) */
    const container = React.useRef(null);
    let simulation:
        | d3.Simulation<d3.SimulationNodeDatum, undefined>
        | undefined;
    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
    React.useEffect(() => {
        if (props.data && container.current) {
            const svg = d3.select(container.current);
            simulatePositions();
            drawTicks();
        }
    });

    const simulatePositions = (): void => {
        simulation = d3
            .forceSimulation()
            .nodes(props.data.nodes as d3.SimulationNodeDatum[])
            .force(
                'link',
                d3
                    .forceLink()
                    .id((d) => {
                        return (d as node).label;
                    })
                    .distance(props.linkDistance)
                    .strength(props.linkStrength),
            )
            .force('charge', d3.forceManyBody().strength(props.chargeStrength))
            .force(
                'center',
                d3.forceCenter(props.centerWidth, props.centerHeight),
            );

        // @ts-ignore
        simulation.force('link').links(props.data.links);
    };

    const drawTicks = (): void => {
        const nodes = d3.selectAll('.node');
        const links = d3.selectAll('.link');
        const labels = d3.selectAll('.label');

        if (simulation) {
            simulation
                .nodes(props.data.nodes as d3.SimulationNodeDatum[])
                .on('tick', onTickHandler);
        }

        function onTickHandler() {
            links
                .attr('x1', (d) => {
                    return (d as {source: point}).source.x;
                })
                .attr('y1', (d) => {
                    return (d as {source: point}).source.y;
                })
                .attr('x2', (d) => {
                    return (d as {target: point}).target.x;
                })
                .attr('y2', (d) => {
                    return (d as {target: point}).target.y;
                });
            nodes
                .attr('cx', (d) => {
                    return (d as point).x;
                })
                .attr('cy', (d) => {
                    return (d as point).y;
                });
            labels
                .attr('x', (d) => {
                    return (d as point).x + 5;
                })
                .attr('y', (d) => {
                    return (d as point).y + 5;
                });
        }
    };

    return (
        <svg
            ref={container}
            style={{
                height: props.height,
                width: props.width,
                marginRight: '0px',
                marginLeft: '0px',
            }}
        >
            <g>
                <Links links={props.data.links as link[]} />
                <Circles nodes={props.data.nodes as node[]} />
                <Labels nodes={props.data.nodes as node[]} />
            </g>
        </svg>
    );
}