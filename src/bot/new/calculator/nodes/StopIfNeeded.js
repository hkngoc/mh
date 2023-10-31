import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const StopIfNeeded = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

StopIfNeeded.prototype = newChildObject(MyBaseNode.prototype);

StopIfNeeded.prototype.tick = function(tree) {
  const { blackboard, grid, config: { other: { rejectByStop } } } = this.ref;

  const reject = blackboard.get('rejectTarget', true);
  if (reject) {
    blackboard.set('result', { directs: 'x', positions: [], which: 'reject' }, true);

    return SUCCESS;
  }

  return FAILURE;
};

export default StopIfNeeded;
