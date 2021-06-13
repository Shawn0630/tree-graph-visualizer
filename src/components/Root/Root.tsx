import {MuiThemeProvider as MuiThemeProviderCore} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import {muiThemeCore} from '@src/Themes';

import {App} from '../app/app';

class Root extends React.PureComponent<unknown> {
    public render(): JSX.Element {
        return (
            <Typography component="div">
                <MuiThemeProviderCore theme={muiThemeCore}>
                    <App />
                </MuiThemeProviderCore>
            </Typography>
        );
    }
}

export {Root};
