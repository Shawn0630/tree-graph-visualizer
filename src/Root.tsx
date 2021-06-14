import {MuiThemeProvider as MuiThemeProviderCore} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import {ThunkDispatch} from 'redux-thunk';

import {muiThemeCore} from '@src/Themes';

import {App} from '@components/app/app';

import GraphVisualizer from './components/graph/GraphVisualizer';
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

const graph: Graph = GraphGenerator.generateRandomGraph(10, 10);
class Root extends React.PureComponent<unknown> {
    public render(): JSX.Element {
        return (
            <Typography component="div">
                <MuiThemeProviderCore theme={muiThemeCore}>
                    <GraphVisualizer
                        width={800}
                        height={350}
                        data={graph}
                        linkDistance={80}
                        linkStrength={1}
                        chargeStrength={-20}
                        centerWidth={350}
                        centerHeight={170}
                    />
                </MuiThemeProviderCore>
            </Typography>
        );
    }
}

export default ReactRedux.connect(mapStateToProps, mapDispatchToProps)(Root);
