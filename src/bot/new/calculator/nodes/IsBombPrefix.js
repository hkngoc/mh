import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const IsBombPrefix = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

IsBombPrefix.prototype = newChildObject(MyBaseNode.prototype);

IsBombPrefix.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const prefix = blackboard.get('safeDirectPrefix', true);

  if (prefix == 'b') {
    return SUCCESS;
  } else {
    return FAILURE;
  }
};

export default IsBombPrefix;
