import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const HasBonusCandidate = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

HasBonusCandidate.prototype = newChildObject(MyBaseNode.prototype);

HasBonusCandidate.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const candidates = blackboard.get('bonusCandidates', true);

  if (candidates.length <= 0) {
    return FAILURE;
  } else {
    return SUCCESS;
  }
};

export default HasBonusCandidate;
