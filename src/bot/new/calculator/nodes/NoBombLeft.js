import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const NoBombLeft = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

NoBombLeft.prototype = newChildObject(MyBaseNode.prototype);

NoBombLeft.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const remain = blackboard.get('bombRemain', true);

  if (remain > 0) {
    return FAILURE;
  } else {
    return SUCCESS;
  }
};

export default NoBombLeft;
