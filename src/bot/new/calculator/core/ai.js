import {
  BehaviorTree,
  Blackboard,
  Priority, // Selector
} from 'behavior3js';

const AI = function(map, config, lastResult, enemyDrive) {
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
};

AI.prototype.buildTree = function() {
  return new Priority({
    children:[]
  });
};

AI.prototype.tick = function() {
  this.tree.tick({}, this.blackboard);

  const result = this.blackboard.get('result', true);

  return result;
};

export default AI;
