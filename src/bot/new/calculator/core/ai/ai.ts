import {
  BehaviorTree,
  Blackboard,
  Priority, // Selector
  // @ts-ignore
} from 'behavior3js';

class AI {
  protected map;
  protected tree;
  protected config;
  protected blackboard;
  protected lastResult;
  protected pingObject;

  constructor(map: any, config: any, lastResult: any, ping: any) {
    const tree = new BehaviorTree(null, {
      title: 'BTs of iVengers'
    });
    tree.root = this.buildTree();
  
    const blackboard = new Blackboard();
  
    this.map        = map;
    this.tree       = tree;
    this.config     = config;
    this.blackboard = blackboard;
    this.lastResult = lastResult;
    this.pingObject = ping;
  }

  public buildTree() {
    return new Priority({
      children:[]
    });
  }

  public tick() {
    this.tree.tick({}, this.blackboard);

    const result = this.blackboard.get('result', true);

    return result;
  }
}

export default AI;
