import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const TargetSuitableWithSafe = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

TargetSuitableWithSafe.prototype = newChildObject(MyBaseNode.prototype);

TargetSuitableWithSafe.prototype.tick = function(tree) {
  const { grid, lastResult } = this.ref;

  if (!lastResult) {
    return FAILURE;
  }

  const { blackboard } = this.ref;
  const candidates = blackboard.get('safeCandidates', true);
  const { winner: { position } } = lastResult;

  const index = _.findIndex(candidates, candidate => candidate.position.x == position.x && candidate.position.y == position.y);

  if (index < 0) {
    blackboard.set('rejectTarget', true, true);
    return FAILURE;
  }
  // if (index < 0 || (index >= 0 && candidates.length > 10 && index > candidates.length / 3)) {
  //   return FAILURE;
  // }

  const { directs: rDirects } = lastResult;
  const { directs } = this.ref.tracePath(position, grid);

  if (!rDirects.endsWith(directs)) {
    // not same path
    blackboard.set('rejectTarget', true, true);
    return FAILURE;
  }

  return SUCCESS;
};

export default TargetSuitableWithSafe;
