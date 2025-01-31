import { PromptHandle } from './PromptHandle';
import { TreeNode, CompositeTreeNode } from '../tree';
import { TreeNodeType } from '../types';

export class NewPromptHandle extends PromptHandle {
  private _id: number = TreeNode.nextId();

  constructor(public readonly type: TreeNodeType, public readonly parent: CompositeTreeNode) {
    super();
  }

  get id(): number {
    return this._id;
  }

  get depth() {
    return this.parent.depth + 1;
  }
}
