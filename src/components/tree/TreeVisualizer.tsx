import './Tree.scss';

import * as d3 from 'd3';
import {HierarchyNode} from 'd3';
import * as React from 'react';

import {TreeNode} from '~src/models/TreeViewModels';
import {pointLink} from '~src/models/ViewModels';

interface TreeVisualizerProps {
    width: number;
    height: number;
    data: TreeNode;
    linkDistance: number;
    linkStrength: number;
    chargeStrength: number;
    centerWidth: number;
    centerHeight: number;
}

// http://qiutianaimeili.com/html/page/2020/09/2034ek3ddhvmcf.html
export default function TreeVisualizer(
    props: TreeVisualizerProps,
): JSX.Element {
    const container = React.useRef(null);

    const layerDepth = 35;
    const margin = {
        top: 20,
        right: 90,
        bottom: 20,
        left: 90,
    };
    const duration = 750;
    const width = props.width - margin.left - margin.right;
    const height = props.height - margin.top - margin.bottom;

    const tree: d3.TreeLayout<TreeNode> = d3
        .tree<TreeNode>()
        .size([width, height])
        .separation(function (a, b) {
            return a.parent == b.parent ? 1 : 5;
        });

    const simulatePositions = (
        selected: TreeNode,
    ): d3.HierarchyPointNode<TreeNode> => {
        const root: HierarchyNode<TreeNode> = d3.hierarchy(selected);
        const treeRoot: d3.HierarchyPointNode<TreeNode> = tree(root);

        // Normalize for fixed-depth.
        treeRoot.descendants().forEach((n: d3.HierarchyPointNode<TreeNode>) => {
            n.y = n.depth * layerDepth;
        });

        return treeRoot;
    };
    const root: TreeNode = props.data;

    root._x = props.height / 2;
    root._y = 0;

    React.useEffect(() => {
        if (root && container.current) {
            const svg = d3.select(container.current);
            const g = svg.select('.tree');
            const gLink = g.append('g').attr('class', 'links');
            const gNode = g
                .append('g')
                .attr('class', 'nodes')
                .attr('cursor', 'pointer')
                .attr('pointer-events', 'all');
            const rootNode: d3.HierarchyPointNode<TreeNode> = simulatePositions(
                root,
            );
            drawTree(rootNode);
            //furtherInterface();
        }
    });

    const drawTree = (selected: d3.HierarchyPointNode<TreeNode>): void => {
        const svg = d3.select(container.current);
        const g = svg.select('.tree');
        const gLink = g.select('.links');
        const gNode = g.select('.nodes');

        const rootNode: d3.HierarchyPointNode<TreeNode> = simulatePositions(
            root,
        );

        // adds each node as a group
        const nodes = gNode.selectAll('.node').data(rootNode.descendants());

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = nodes
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', function (d) {
                return (
                    'translate(' +
                    selected.data._y +
                    ',' +
                    selected.data._x +
                    ')'
                );
            })
            .on('click', toggleExpandChildren);

        // adds the circle to the node
        nodeEnter
            .append('circle')
            .attr('r', (d) =>
                d.data.radiusSize == null ? 6 : d.data.radiusSize,
            )
            .style('fill', function (d) {
                return d.data._children && d.data._children.length != 0
                    ? 'lightsteelblue'
                    : '#fff';
            });

        // adds the text to the node
        nodeEnter
            .append('text')
            .attr('dy', '.35em')
            .attr('x', (d) =>
                d.children || d.data._children ? (15 + 5) * -1 : 15 + 5,
            )
            .attr('y', (d) => (d.children && d.depth !== 0 ? -(15 + 5) : 5))
            .style('text-anchor', (d) =>
                d.children || d.data._children ? 'end' : 'start',
            )
            .text((d) => (d.data.label == null ? '' : d.data.label))
            .style('fill-opacity', 1e-6);

        const nodeUpdate = nodes.merge(nodeEnter);
        nodeUpdate
            .transition()
            .duration(duration)
            .attr(
                'transform',
                (d: d3.HierarchyPointNode<TreeNode>) =>
                    'translate(' + d.y + ',' + d.x + ')',
            );

        // Transition nodes to their new position.
        nodeUpdate
            .select('circle')
            .attr('r', 10)
            .style('fill', function (d) {
                return d.data._children && d.data._children.length != 0
                    ? 'lightsteelblue'
                    : '#fff';
            });

        nodeUpdate.select('text').style('fill-opacity', 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = nodes
            .exit()
            .transition()
            .duration(duration)
            .attr('transform', function (d) {
                return 'translate(' + selected.y + ',' + selected.x + ')';
            })
            .remove();

        nodeExit.select('circle').attr('r', 1e-6);

        nodeExit.select('text').style('fill-opacity', 1e-6);

        // adds the links between the nodes
        const links = gLink.selectAll('.link').data(rootNode.links());

        const linkEnter = links
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', function (d) {
                if (selected.data._x == null || selected.data._y == null) {
                    return '';
                }
                const o = {x: selected.data._x, y: selected.data._y};
                return diagonal({source: o, target: o});
            });
        const linkUpdate = links.merge(linkEnter);
        // Transition links to their new position.
        linkUpdate
            .transition()
            .duration(duration)
            .attr('d', (d) => diagonal(d));

        // Transition exiting nodes to the parent's new position.
        links
            .exit()
            .transition()
            .duration(duration)
            .attr('d', function (d) {
                const o = {x: selected.x, y: selected.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Store the old positions for transition.
        rootNode.descendants().forEach((d: d3.HierarchyPointNode<TreeNode>) => {
            d.data._x = d.x;
            d.data._y = d.y;
        });
    };

    const furtherInterface = (): void => {
        const svg = d3.select(container.current);
        const nodes = svg.selectAll('.node');
        nodes.on('click', toggleExpandChildren);
    };

    function toggleExpandChildren(
        event: MouseEvent,
        node: d3.HierarchyPointNode<TreeNode>,
    ): void {
        if (node.data.children) {
            node.data._children = node.data.children;
            node.data.children = null;
        } else {
            node.data.children = node.data._children;
            node.data._children = null;
        }
        drawTree(node);
    }

    return (
        <svg
            ref={container}
            style={{
                height: props.height,
                width: props.width,
            }}
        >
            <g
                style={{
                    transform: `translate(${margin.left}px, ${margin.top}px)`,
                }}
                className="tree"
            />
        </svg>
    );
}

function diagonal(d: d3.HierarchyPointLink<TreeNode> | pointLink): string {
    if (d.source == undefined || d.target == undefined) {
        return '';
    }
    return (
        'M' +
        d.target.y +
        ',' +
        d.target.x +
        'C' +
        (d.target.y + d.source.y) / 2 +
        ',' +
        d.target.x +
        ' ' +
        (d.target.y + d.source.y) / 2 +
        ',' +
        d.source.x +
        ' ' +
        d.source.y +
        ',' +
        d.source.x
    );
}
