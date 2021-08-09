import {Nullable} from './common';
import {node} from './ViewModels';

export interface TreeNode extends node {
    children: Nullable<TreeNode[]>;
    _children?: Nullable<TreeNode[]>;
    _x?: number;
    _y?: number;
}
