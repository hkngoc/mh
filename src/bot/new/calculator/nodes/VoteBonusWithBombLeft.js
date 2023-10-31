import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteBonusWithBombLeft = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteBonusWithBombLeft.prototype = newChildObject(MyBaseNode.prototype);

VoteBonusWithBombLeft.prototype.tick = function(tree) {
  const { blackboard, map: { myId } } = this.ref;
  const tpc = this.ref.timeToCrossACell(myId);

  const remain = blackboard.get('bombRemain', true);
  const candidates = blackboard.get('bonusCandidates', true);

  const ordered = _(candidates)
    .filter(candidate => {
      const { cost } = candidate;

      return cost * tpc >= remain;
    })
    .orderBy(['extreme', 'score', 'cost'], ['desc', 'desc', 'asc'])
    .value();

  if (ordered.length > 0) {
    const winner =  _.first(ordered);

    blackboard.set('bonusWinner', winner, true);

    return SUCCESS;
  } else {
    return FAILURE;
  }

};

export default VoteBonusWithBombLeft;
