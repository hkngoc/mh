import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteBomb = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteBomb.prototype = newChildObject(MyBaseNode.prototype);

VoteBomb.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const candidates = blackboard.get('bombCandidates', true);

  const ordered = _.orderBy(candidates, ['extreme', 'score', 'cost'], ['desc', 'desc', 'asc']);
  const winner = _.first(ordered);
  // need reject position can drop bomb but remain time so small, that more safer. Maybe implement in Find Candidate node.

  const near = _.find(ordered, candidate => candidate.cost == 0);
  Logger.debug(ordered, winner, near);

  if (near && near.extreme > 0.3 * winner.extreme && winner.cost >= 5) {
    blackboard.set('bombWinner', near, true);
  } else {
    blackboard.set('bombWinner', winner, true);
  }

  return SUCCESS;
};

export default VoteBomb;
