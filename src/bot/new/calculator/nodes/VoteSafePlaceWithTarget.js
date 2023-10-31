import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteSafePlaceWithTarget = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteSafePlaceWithTarget.prototype = newChildObject(MyBaseNode.prototype);

VoteSafePlaceWithTarget.prototype.tick = function(tree) {
  const { blackboard, lastResult } = this.ref;

  // const candidates = blackboard.get('safeCandidates', true);

  // const ordered = _.orderBy(candidates, ['extreme', 'score', 'cost'], ['desc', 'desc', 'asc']);
  // const { winner: { position } } = lastResult;

  // const index = _.findIndex(ordered, candidate => candidate.x == position.x && candidate.y == position.y);
  // some compare here

  blackboard.set('safeWinner', { ...lastResult, watch: true }, true);

  return SUCCESS;
};

export default VoteSafePlaceWithTarget;
