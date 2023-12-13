import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const TargetBonusStillGood = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

TargetBonusStillGood.prototype = newChildObject(MyBaseNode.prototype);

TargetBonusStillGood.prototype.tick = function(tree) {
  const { blackboard, lastResult, grid } = this.ref;
  const candidates = blackboard.get('bonusCandidates', true);
  const { winner: { position }, which } = lastResult;

  if (!which || !which.includes('bonus')) {
    return FAILURE;
  }

  const index = _.findIndex(candidates, candidate => candidate.position.x == position.x && candidate.position.y == position.y);

  if (index < 0) {
    blackboard.set('rejectTarget', true, true);
    return FAILURE;
  }

  const { directs: rDirects } = lastResult;
  const { directs, positions } = this.ref.tracePath(position, grid);

  if (!rDirects.endsWith(directs) || !this.ref.checkPathCanWalk(positions)) {
    // not same path
    blackboard.set('rejectTarget', true, true);
    return FAILURE;
  }

  blackboard.set('targetCandidate', [{ ...candidates[index], isLastResult: true, which }], true);

  return SUCCESS;
};

export default TargetBonusStillGood;
