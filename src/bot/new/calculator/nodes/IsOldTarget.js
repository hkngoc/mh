import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const IsOldTarget = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

IsOldTarget.prototype = newChildObject(MyBaseNode.prototype);

IsOldTarget.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const key = blackboard.get('compareWithBomb', true);
  const compare = blackboard.get(key, true);

  if (compare.length == 1 && compare[0].isLastResult) {
    return SUCCESS;
  }

  return FAILURE;
};

export default IsOldTarget;
