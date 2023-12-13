import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const TargetSuitableWithBomb = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

TargetSuitableWithBomb.prototype = newChildObject(MyBaseNode.prototype);

TargetSuitableWithBomb.prototype.tick = function(tree) {
  const { grid, lastResult } = this.ref;

  if (!lastResult /*|| !lastResult.which || !lastResult.which.includes('bomb') */) {
    return FAILURE;
  }

  const { blackboard } = this.ref;
  const candidates = blackboard.get('bombCandidates', true);

  const { winner: { position } } = lastResult;
  // console.log('check last result', lastResult, candidates);

  const index = _.findIndex(candidates, candidate => candidate.position.x == position.x && candidate.position.y == position.y);
  // console.log(index, position, 'keep old bomb');

  if (index < 0) {
    Logger.info('target remove 1');
    blackboard.set('rejectTarget', true, true);
    return FAILURE;
  }

  const { directs: rDirects } = lastResult;
  const { directs, positions } = this.ref.tracePath(position, grid);

  if (!rDirects.endsWith(directs) || !this.ref.checkPathCanWalk(positions)) {
    // not same path
    Logger.info('target remove 2');
    blackboard.set('rejectTarget', true, true);
    return FAILURE;
  }

  return SUCCESS;
};

export default TargetSuitableWithBomb;
