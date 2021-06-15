import {GraphViewPropertyHelper} from '~utilities/GraphHelpers';

// import {GraphViewPropertyHelper} from '../../src/utilities/GraphHelpers';
import no_dege from '../test_data/no_edge.json';

describe('test isNeighbour', () => {
    it.each`
        a    | b    | graph      | result
        ${1} | ${2} | ${no_dege} | ${false}
    `(
        'should return $result when $a and $b are used',
        ({a, b, graph, result}) => {
            expect(GraphViewPropertyHelper.isNeighbour(a, b, graph)).toEqual(
                result,
            );
        },
    );
});
