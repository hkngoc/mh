import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteSafePlace = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteSafePlace.prototype = newChildObject(MyBaseNode.prototype);

VoteSafePlace.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  const candidates = blackboard.get('safeCandidates', true);
  const ordered = _.orderBy(candidates, ['extreme', 'score', 'cost'], ['desc', 'desc', 'asc']);

  const winner =  _.first(ordered);
  // console.log(ordered, winner);

  blackboard.set('safeWinner', winner, true);

  return SUCCESS;
};

export default VoteSafePlace;
