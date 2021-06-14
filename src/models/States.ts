import {Graph} from './GraphViewModels';

export interface GraphViewStates {
    selectedGraph: Graph;
}

export interface RootState {
    graph: GraphViewStates;
}
