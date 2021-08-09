import {Graph, link} from '~models/GraphViewModels';
import {node} from '~models/ViewModels';
import * as d3 from 'd3';

namespace GraphGenerator {
    export function generateRandomGraph(node: number, link: number): Graph {
        const nodes: node[] = [...Array(node).keys()].map((id: number) => {
            return {id: id};
        });

        const links: link[] = randomChoose(unorderedPairs(nodes), link).map(
            (pair: node[]) => {
                return {
                    source: pair[0].id,
                    target: pair[1].id,
                };
            },
        );

        return {
            nodes: nodes,
            links: links,
        };
    }

    function randomChoose(s: node[][], k: number) {
        // returns a random k element subset of s
        const a = [];
        let i = -1,
            j;
        while (++i < k) {
            j = Math.floor(Math.random() * s.length);
            a.push(s.splice(j, 1)[0]);
        }
        return a;
    }

    function unorderedPairs(s: node[]) {
        // returns the list of all unordered pairs from s
        let i = -1,
            j;
        const a = [];
        while (++i < s.length) {
            j = i;
            while (++j < s.length) a.push([s[i], s[j]]);
        }
        return a;
    }
}

namespace GraphViewPropertyHelper {
    export function setGraphViewProperty(graph: Graph): Graph {
        let maxConnection = 0;
        const links: link[] = graph.links;
        graph.nodes.forEach((node: node) => {
            let connection = 0;
            links.forEach((link: link) => {
                if (link.source == node.id || link.target == node.id)
                    connection++;
            });
            maxConnection = Math.max(connection, maxConnection);
        });
        const linear = d3
            .scaleLinear()
            .domain([0, maxConnection])
            .range([0, 1]);
        const compute: (scale: number) => string = d3.interpolate(
            'red',
            'blue',
        );

        const nodes: node[] = graph.nodes.map((node: node) => {
            const id: number = node.id;
            let connection = 0;
            links.forEach((link: link) => {
                if (link.source == id || link.target == id) connection++;
            });

            return {
                ...node,
                radiusSize: 3 + 3 * connection,
                fillColor: compute(linear(connection)),
            };
        });

        return {
            ...graph,
            nodes: nodes,
        };
    }

    export function isNeighbour(a: number, b: number, graph: Graph): boolean {
        if (a == b) return true;
        for (const link of graph.links) {
            if (
                (link.source == a && link.target == b) ||
                (link.source == b && link.target == a)
            ) {
                return true;
            }
        }

        return false;
    }
}

export {GraphGenerator, GraphViewPropertyHelper};
