import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteBombWithTarget = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteBombWithTarget.prototype = newChildObject(MyBaseNode.prototype);

VoteBombWithTarget.prototype.tick = function(tree) {
  const { blackboard, lastResult } = this.ref;

  // const remain = blackboard.get('bombRemain', true);
  // const candidates = blackboard.get('bombCandidates', true);

  // const ordered = _.orderBy(candidates, ['extreme', 'score', 'diff', 'cost'], ['desc', 'desc', 'asc', 'asc']);
  // const { winner: { position } } = lastResult;

  // const index = _.findIndex(ordered, candidate => candidate.x == position.x && candidate.y == position.y);
  // some compare here

  blackboard.set('bombWinner', { ...lastResult, watch: true }, true);

  return SUCCESS;
};

export default VoteBombWithTarget;
