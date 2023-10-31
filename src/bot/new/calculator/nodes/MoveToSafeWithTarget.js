import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const MoveToSafeWithTarget = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

MoveToSafeWithTarget.prototype = newChildObject(MyBaseNode.prototype);

MoveToSafeWithTarget.prototype.tick = function(tree) {
  const { blackboard } = this.ref;
  const winner = blackboard.get('safeWinner', true);

  // console.log(winner);

  blackboard.set('result', winner, true);

  return SUCCESS;
};

export default MoveToSafeWithTarget;
