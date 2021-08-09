import * as d3 from 'd3';
import * as React from 'react';

import {Graph, extendedLink, link} from '~src/models/GraphViewModels';
import {datum, node, point} from '~src/models/ViewModels';

import Circles from './Circles';
import Labels from './Labels';
import Links from './Links';

interface GraphDrawPadProps {
    width: number;
    height: number;
    data: Graph;
    linkDistance: number;
    linkStrength: number;
    chargeStrength: number;
    centerWidth: number;
    centerHeight: number;
}

export default function GraphDrawPad(props: GraphDrawPadProps): JSX.Element {
    /* The useRef Hook creates a variable that "holds on" to a value across rendering
    passes. In this case it will hold our component's SVG DOM element. It's
    initialized null and React will assign it later (see the return statement) */
    const container = React.useRef(null);
    const [graphState, setGraphState] = React.useState(props.data);
    let simulation:
        | d3.Simulation<d3.SimulationNodeDatum, undefined>
        | undefined;
    let mousedownNode: (node & datum) | undefined = undefined;

    // let lastNodeId = props.data.nodes[props.data.nodes.length - 1].id;

    /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
    React.useEffect(() => {
        if (graphState && container.current) {
            const svg = d3.select(container.current);
            simulatePositions();
            drawTicks();
            furtherInterface();
            if (simulation) {
                simulation.alpha(0.8).restart();
            }
        }
    }, [graphState]);

    const simulatePositions = (): void => {
        simulation = d3
            .forceSimulation()
            .nodes(graphState.nodes as d3.SimulationNodeDatum[])
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
            .force(
                'charge',
                d3
                    .forceManyBody()
                    .strength(props.chargeStrength)
                    .distanceMax(props.width / 2),
            )
            .force('x', d3.forceX(props.width / 2))
            .force('y', d3.forceY(props.height / 2));

        // @ts-ignore
        simulation.force('link').links(graphState.links);
    };

    const drawTicks = (): void => {
        const svg = d3.select(container.current);
        const nodes = svg.selectAll('.node');
        const links = svg.selectAll('.link');
        const labels = svg.selectAll('.label');

        if (simulation) {
            simulation
                .nodes(graphState.nodes as d3.SimulationNodeDatum[])
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
        const svg = d3.select(container.current);
        svg.on('mousedown', addNode)
            .on('mousemove', updateDragLine)
            .on('mouseup', hideDragLine);
        const nodes = svg.selectAll('.node');
        nodes
            .on('mousedown', beginDragLine)
            .on('mouseup', endDragLine)
            .on('contextmenu', removeNode);
    };

    function addNode(event: MouseEvent, d: datum) {
        if (event.button == 0) {
            const newNode: node & point = {
                x: event.x,
                y: event.y,
                id: graphState.nodes[graphState.nodes.length - 1].id + 1,
            };
            setGraphState({
                ...graphState,
                nodes: [...graphState.nodes, newNode],
            });
        }
    }

    function beginDragLine(event: MouseEvent, d: node & datum) {
        //to prevent call of addNode through svg
        event.stopPropagation();
        //to prevent dragging of svg in firefox
        event.preventDefault();
        if (event.ctrlKey || event.button != 0) return;
        mousedownNode = d;
        const svg = d3.select(container.current);
        const dragLine = svg.select('.dragLine');
        dragLine
            .classed('hidden', false)
            .attr(
                'd',
                'M' +
                    mousedownNode.x +
                    ',' +
                    mousedownNode.y +
                    'L' +
                    mousedownNode.x +
                    ',' +
                    mousedownNode.y,
            );
    }

    //no need to call hideDragLine() and restart() in endDragLine
    //mouseup on vertices propagates to svg which calls hideDragLine
    function endDragLine(event: MouseEvent, d: node & datum) {
        if (!mousedownNode || mousedownNode === d) return;
        //return if link already exists
        for (let i = 0; i < graphState.links.length; i++) {
            const l: extendedLink = (graphState.links[
                i
            ] as unknown) as extendedLink;
            if (
                (l.source.id === mousedownNode.id && l.target.id === d.id) ||
                (l.source.id === d.id && l.target.id === mousedownNode.id)
            ) {
                return;
            }
        }
        const newLink = {source: mousedownNode.id, target: d.id};
        setGraphState({
            ...graphState,
            links: [...graphState.links, newLink],
        });
    }

    function removeNode(event: MouseEvent, data: node) {
        //to make ctrl-drag works for mac/osx users
        if (event.ctrlKey) return;
        event.preventDefault();
        const removedNode: node[] = graphState.nodes.filter(
            (node: node) => data.id !== node.id,
        );
        const removedLink: link[] = graphState.links.filter(
            (link: link) =>
                ((link as unknown) as extendedLink).source.id !== data.id &&
                ((link as unknown) as extendedLink).target.id !== data.id,
        );
        setGraphState({
            nodes: removedNode,
            links: removedLink,
        });
    }

    function updateDragLine(event: MouseEvent, d: datum) {
        if (!mousedownNode) return;
        const svg = d3.select(container.current);
        const dragLine = svg.select('.dragLine');
        dragLine
            .attr('x1', mousedownNode.x)
            .attr('y1', mousedownNode.y)
            .attr('x2', event.offsetX)
            .attr('y2', event.offsetY);
    }

    function hideDragLine() {
        const svg = d3.select(container.current);
        const dragLine = svg.select('.dragLine');
        dragLine
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0)
            .classed('hidden', true);
        mousedownNode = undefined;
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
                <line className="dragLine" />
                <Links links={graphState.links as link[]} />
                <Circles nodes={graphState.nodes as node[]} />
                <Labels nodes={graphState.nodes as node[]} />
            </g>
        </svg>
    );
}
