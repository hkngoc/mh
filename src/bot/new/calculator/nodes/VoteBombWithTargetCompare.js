import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteBombWithTargetCompare = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteBombWithTargetCompare.prototype = newChildObject(MyBaseNode.prototype);

VoteBombWithTargetCompare.prototype.tick = function(tree) {
  const { blackboard, lastResult } = this.ref;

  const key = blackboard.get('compareWithBomb', true);
  const compare = blackboard.get(key, true);
  const target = _.first(compare);
  const candidates = blackboard.get('bombCandidates', true);
  const nearTeleport = blackboard.get('nearTeleport', true);
  const isSafe = blackboard.get('isSafe', true);

  let accept = false;

  if (nearTeleport || !isSafe || !this.ref.checkPathInDanger(lastResult.positions)) {
    accept = true;
  } else {
    const index = _.findIndex(candidates, candidate => candidate.position.x == target.position.x && candidate.position.y == target.position.y);

    if (index >= 0) {
      if (index <= Math.round(candidates.length / 2.0)) {
        accept = true;
      }

      // if (target.which == 'safe') {
      //   accept = true;
      // }
    } else {
      const ordered = _.orderBy(candidates, ['extreme', 'score', 'cost'], ['desc', 'desc', 'asc']);
      const best = _.first(ordered);

      if (target.travelCost <= 5 || target.extreme > 0.5 * best.extreme) {
        accept = true;
      }
      // if (target.which == 'safe') {
      //   accept = true;
      // }
    }
  }

  Logger.info('compare', accept);
  if (accept) {
    const { lastResult } = this.ref;
    blackboard.set('result', { ...lastResult, watch: true }, true);
    return SUCCESS;
  }

  return FAILURE;
};

export default VoteBombWithTargetCompare;
