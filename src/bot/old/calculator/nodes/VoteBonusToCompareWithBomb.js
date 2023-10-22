import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const VoteBonusToCompareWithBomb = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

VoteBonusToCompareWithBomb.prototype = newChildObject(MyBaseNode.prototype);

VoteBonusToCompareWithBomb.prototype.tick = function(tree) {
  const { blackboard } = this.ref;

  blackboard.set('compareWithBomb', 'bonusCandidates', true);

  return SUCCESS;
};

export default VoteBonusToCompareWithBomb;
