import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteBonus = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteBonus.prototype = newChildObject(MyBaseNode.prototype);

VoteBonus.prototype.tick = function(tree) {
  const { blackboard, map: { myId } } = this.ref;

  const candidates = blackboard.get('bonusCandidates', true);
  const tpc = this.ref.timeToCrossACell(myId);

  const ordered = _.orderBy(candidates, ['extreme', 'score', 'cost'], ['desc', 'desc', 'asc']);
  const winner =  _.first(ordered);

  blackboard.set('bonusWinner', winner, true);

  return SUCCESS;
};

export default VoteBonus;
