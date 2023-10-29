import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const HasTargetToCompareWithBomb = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

HasTargetToCompareWithBomb.prototype = newChildObject(MyBaseNode.prototype);

HasTargetToCompareWithBomb.prototype.tick = function(tree) {
  const { blackboard, lastResult } = this.ref;

  const key = blackboard.get('compareWithBomb', true);

  if (key) {
    return SUCCESS;
  } else {
    return FAILURE;
  }
};

export default HasTargetToCompareWithBomb;

