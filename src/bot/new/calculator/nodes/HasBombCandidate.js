import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const HasBombCandidate = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

HasBombCandidate.prototype = newChildObject(MyBaseNode.prototype);

HasBombCandidate.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const candidates = blackboard.get('bombCandidates', true);

  if (candidates.length <= 0) {
    return FAILURE;
  } else {
    return SUCCESS;
  }
};

export default HasBombCandidate;
