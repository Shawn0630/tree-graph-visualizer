import {MuiThemeProvider as MuiThemeProviderCore} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {TreeNode} from '~models/TreeViewModels';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {ThunkDispatch} from 'redux-thunk';

import {muiThemeCore} from '~src/Themes';

import {App} from '~components/app/app';

import GraphDrawPad from './components/graph/GraphDrawPad';
import GraphVisualizer from './components/graph/GraphVisualizer';
import TreeVisualizer from './components/tree/TreeVisualizer';
import {Graph} from './models/GraphViewModels';
import {GraphGenerator} from './utilities/GraphHelpers';

function mapStateToProps(state: unknown, ownProps: unknown): unknown {
    return {};
}

function mapDispatchToProps(
    dispatch: ThunkDispatch<unknown, unknown, Redux.AnyAction>,
): unknown {
    return {};
}

const graph: Graph = GraphGenerator.generateRandomGraph(20, 23);
const root: TreeNode = {
    id: 1,
    children: [
        {
            id: 2,
            children: [
                {
                    id: 4,
                    children: [
                        {
                            id: 5,
                            children: [],
                        },
                        {
                            id: 6,
                            children: [],
                        },
                    ],
                },
            ],
        },
        {id: 3, children: []},
    ],
};
class Root extends React.PureComponent<unknown> {
    public render(): JSX.Element {
        return (
            <Typography component="div">
                <MuiThemeProviderCore theme={muiThemeCore}>
                    {/* <GraphVisualizer
                        width={800}
                        height={800}
                        data={JSON.parse(JSON.stringify(graph))}
                        linkDistance={80}
                        linkStrength={1}
                        chargeStrength={-200}
                        centerWidth={350}
                        centerHeight={170}
                    />
                    <GraphDrawPad
                        width={800}
                        height={800}
                        data={JSON.parse(JSON.stringify(graph))}
                        linkDistance={60}
                        linkStrength={1}
                        chargeStrength={-300}
                        centerWidth={400}
                        centerHeight={400}
                    /> */}
                    <TreeVisualizer
                        width={800}
                        height={800}
                        data={JSON.parse(JSON.stringify(root))}
                        linkDistance={80}
                        linkStrength={1}
                        chargeStrength={-200}
                        centerWidth={350}
                        centerHeight={170}
                    />
                </MuiThemeProviderCore>
            </Typography>
        );
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Root);
