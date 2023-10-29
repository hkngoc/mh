import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const MoveToDropBombWithTarget = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

MoveToDropBombWithTarget.prototype = newChildObject(MyBaseNode.prototype);

MoveToDropBombWithTarget.prototype.tick = function(tree) {
  const { blackboard } = this.ref;
  const winner = blackboard.get('bombWinner', true);

  // console.log(winner);

  blackboard.set('result', winner, true);

  return SUCCESS;
};

export default MoveToDropBombWithTarget;
