import './GraphVisualizer.scss';
import './GraphVisualizer.scss';

import * as d3 from 'd3';
import * as React from 'react';

import {
    Graph,
    datum,
    extendedLink,
    link,
    node,
    point,
} from '~src/models/GraphViewModels';
import {GraphViewPropertyHelper} from '~src/utilities/GraphHelpers';

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
    const clonedGraph: Graph = JSON.parse(JSON.stringify(props.data));
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
            simulatePositions();
            drawTicks();
            furtherInterface();
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
        const svg = d3.select(container.current);
        const nodes = svg.selectAll('.node');
        const links = svg.selectAll('.link');
        const labels = svg.selectAll('.label');

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

    const furtherInterface = (): void => {
        addZoomCapabilities();
        addDragAndDropFocusUnFocus();
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

    function addDragAndDropFocusUnFocus(): void {
        const svg = d3.select(container.current);
        svg.selectAll('.node')
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
            if (!event.active) {
                if (simulation) simulation.alphaTarget(0.2).restart();
            }
            // eslint-disable-next-line no-param-reassign
            d.fx = d.x;
            // eslint-disable-next-line no-param-reassign
            d.fy = d.y;
        }

        function onDrag(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: datum,
        ) {
            // eslint-disable-next-line no-param-reassign
            d.fx = event.x;
            // eslint-disable-next-line no-param-reassign
            d.fy = event.y;
        }

        function onDragEnd(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: datum,
        ) {
            if (!event.active) {
                if (simulation) simulation.alphaTarget(0);
            }
            // eslint-disable-next-line no-param-reassign
            d.fx = null;
            // eslint-disable-next-line no-param-reassign
            d.fy = null;
        }

        function focus(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: node,
        ) {
            if (!event.active) {
                const svg = d3.select(container.current);
                const nodes = svg.selectAll('.node');
                const links = svg.selectAll('.link');
                const labels = svg.selectAll('.label');
                nodes.style('opacity', function (o) {
                    return GraphViewPropertyHelper.isNeighbour(
                        d.id,
                        (o as node).id,
                        clonedGraph,
                    )
                        ? 1
                        : 0.1;
                });
                labels.attr('display', function (o) {
                    return GraphViewPropertyHelper.isNeighbour(
                        d.id,
                        (o as node).id,
                        clonedGraph,
                    )
                        ? 'block'
                        : 'none';
                });
                links.style('opacity', function (o) {
                    return (o as extendedLink).source.id == d.id ||
                        (o as extendedLink).target.id == d.id
                        ? 1
                        : 0.1;
                });
            }
        }

        function unfocus(
            event: d3.D3DragEvent<SVGCircleElement, never, never>,
            d: node,
        ) {
            if (!event.active) {
                const svg = d3.select(container.current);
                const nodes = svg.selectAll('.node');
                const links = svg.selectAll('.link');
                const labels = svg.selectAll('.label');
                labels.attr('display', 'block');
                nodes.style('opacity', 1);
                links.style('opacity', 1);
            }
        }
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
                <Circles nodes={graphWithDisplayProperty.nodes as node[]} />
                <Labels nodes={graphWithDisplayProperty.nodes as node[]} />
            </g>
        </svg>
    );
}
