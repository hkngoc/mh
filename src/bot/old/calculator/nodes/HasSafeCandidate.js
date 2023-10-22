import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const HasSafeCandidate = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

HasSafeCandidate.prototype = newChildObject(MyBaseNode.prototype);

HasSafeCandidate.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const candidates = blackboard.get('safeCandidates', true);

  if (candidates.length <= 0) {
    return FAILURE;
  } else {
    return SUCCESS;
  }
};

export default HasSafeCandidate;

