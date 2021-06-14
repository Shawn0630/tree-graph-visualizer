import './GraphVisualizer.scss';
import './GraphVisualizer.scss';

import * as d3 from 'd3';
import * as React from 'react';

import {Graph, link, node, point} from '@src/models/GraphViewModels';
import {GraphViewPropertyHelper} from '@src/utilities/GraphHelpers';

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
    const graphWithDisplayProperty: Graph = GraphViewPropertyHelper.setGraphViewProperty(
        props.data,
    );
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
            addZoomCapabilities();
        }
    });

    const simulatePositions = (): void => {
        simulation = d3
            .forceSimulation()
            .nodes(graphWithDisplayProperty.nodes as d3.SimulationNodeDatum[])
            .force(
                'link',
                d3
                    .forceLink()
                    .id((d) => {
                        return (d as node).id;
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
        simulation.force('link').links(graphWithDisplayProperty.links);
    };

    const drawTicks = (): void => {
        const nodes = d3.selectAll('.node');
        const links = d3.selectAll('.link');
        const labels = d3.selectAll('.label');

        if (simulation) {
            simulation
                .nodes(
                    graphWithDisplayProperty.nodes as d3.SimulationNodeDatum[],
                )
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

    function addZoomCapabilities(): void {
        const container = d3.select('.container');
        const zoom = d3
            .zoom()
            .scaleExtent([1, 8])
            .translateExtent([
                [100, 100],
                [300, 300],
            ])
            .extent([
                [100, 100],
                [200, 200],
            ])
            .on('zoom', (event) => {
                let {x, y, k} = event.transform;
                x = 0;
                y = 0;
                k *= 1;
                container
                    .attr('transform', `translate(${x}, ${y})scale(${k})`)
                    .attr('width', props.width)
                    .attr('height', props.height);
            });

        // @ts-ignore
        container.call(zoom);
    }

    function restartDrag(): void {
        if (simulation) simulation.alphaTarget(0.2).restart();
    }

    function stopDrag(): void {
        if (simulation) simulation.alphaTarget(0);
    }

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
                <Links links={graphWithDisplayProperty.links as link[]} />
                <Circles
                    nodes={graphWithDisplayProperty.nodes as node[]}
                    restartDrag={restartDrag}
                    stopDrag={stopDrag}
                />
                <Labels nodes={graphWithDisplayProperty.nodes as node[]} />
            </g>
        </svg>
    );
}
