import {GraphViewPropertyHelper} from '~utilities/GraphHelpers';

import as_link from '../test_data/graph_as_link.json';
import no_dege from '../test_data/graph_no_edge.json';
import no_node from '../test_data/graph_no_node.json';
import with_loop from '../test_data/graph_with_loop.json';

describe('test isNeighbour', () => {
    it.each`
        a     | b     | graph        | graph_type     | result
        ${1}  | ${2}  | ${no_node}   | ${'no_node'}   | ${false}
        ${1}  | ${2}  | ${no_dege}   | ${'no_edge'}   | ${false}
        ${1}  | ${1}  | ${as_link}   | ${'as_link'}   | ${true}
        ${1}  | ${2}  | ${as_link}   | ${'as_link'}   | ${true}
        ${2}  | ${1}  | ${as_link}   | ${'as_link'}   | ${true}
        ${1}  | ${3}  | ${as_link}   | ${'as_link'}   | ${false}
        ${3}  | ${1}  | ${as_link}   | ${'as_link'}   | ${false}
        ${2}  | ${3}  | ${as_link}   | ${'as_link'}   | ${true}
        ${3}  | ${2}  | ${as_link}   | ${'as_link'}   | ${true}
        ${1}  | ${4}  | ${as_link}   | ${'as_link'}   | ${false}
        ${4}  | ${1}  | ${as_link}   | ${'as_link'}   | ${false}
        ${1}  | ${19} | ${with_loop} | ${'with_loop'} | ${true}
        ${19} | ${1}  | ${with_loop} | ${'with_loop'} | ${true}
    `(
        'should return $result when calling isNeighbour($a, $b) to $graph_type graph',
        ({a, b, graph, result}) => {
            expect(GraphViewPropertyHelper.isNeighbour(a, b, graph)).toEqual(
                result,
            );
        },
    );
});
