import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const KeepOldTarget = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

KeepOldTarget.prototype = newChildObject(MyBaseNode.prototype);

KeepOldTarget.prototype.tick = function(tree) {
  const { blackboard, lastResult } = this.ref;

  const appliedResult = { ...lastResult, watch: true };
  blackboard.set('result', appliedResult, true);

  return SUCCESS;
};

export default KeepOldTarget;
