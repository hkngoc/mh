import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteBombWithBonusCompare = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteBombWithBonusCompare.prototype = newChildObject(MyBaseNode.prototype);

VoteBombWithBonusCompare.prototype.tick = function(tree) {
  const { blackboard, map: { myId } } = this.ref;
  const tpc = this.ref.timeToCrossACell(myId);

  const remain = blackboard.get('bombRemain', true);
  const key = blackboard.get('compareWithBomb', true);
  const compare = blackboard.get(key, true);
  const candidates = blackboard.get('bombCandidates', true);

  const bombOrdered = _.orderBy(candidates, ['extreme', 'score', 'cost'], ['desc', 'desc', 'asc']);
  const bestBomb = _.first(bombOrdered);

  const bonusOrdered = _.orderBy(compare, ['extreme', 'score', 'cost'], ['desc', 'desc', 'asc']);
  const bestBonus = _.first(bonusOrdered);

  const nearBomb = _.filter(bombOrdered, candidate => candidate.cost <= 1);
  if (nearBomb.length > 0) {
    const bestNear = _.first(nearBomb);
    if (bestNear.extreme > 0.8 * bestBonus.extreme) {
      blackboard.set('bombWinner', bestNear, true);
      return SUCCESS;
    }
  }
  if (bestBomb.travelCost <= 1 && remain < tpc) {
    // move to drop bomb
    blackboard.set('bombWinner', bestBomb, true);
    return SUCCESS;
  }
  if (bestBonus.travelCost <= 5 || bestBonus.extreme > 0.8 * bestBomb.extreme) {
    // move to bonus
    blackboard.set('bonusWinner', bestBonus, true);
    return SUCCESS;
  }

  return FAILURE;
};

export default VoteBombWithBonusCompare;
