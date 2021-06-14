/**
 * Created by: Andrey Polyakov (andrey@polyakov.im)
 */
import '@styles/styles.less';
import '@styles/styles.scss';

import React from 'react';
import ReactDom from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';

import {rootReducer} from '@src/reducers';
import Root from '@src/Root';

const store: Redux.Store<unknown> = Redux.createStore(rootReducer);

ReactDom.render(
    <ReactRedux.Provider store={store}>
        <Root />
    </ReactRedux.Provider>,
    document.getElementById('root'),
);
