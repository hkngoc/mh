import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const CheckWinner = function(ref, which) {
  MyBaseNode.apply(this, [ref]);
  this.which = which;
};

CheckWinner.prototype = newChildObject(MyBaseNode.prototype);

CheckWinner.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const winner = blackboard.get(this.which, true);

  if (winner) {
    return SUCCESS;
  }

  return FAILURE;
};

export default CheckWinner;
