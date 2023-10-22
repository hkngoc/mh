import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const MoveToBonus = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

MoveToBonus.prototype = newChildObject(MyBaseNode.prototype);

MoveToBonus.prototype.tick = function(tree) {
  const { blackboard, grid } = this.ref;

  const winner = blackboard.get('bonusWinner', true);
  const { position } = winner;
  const { directs, positions } = this.ref.tracePath(position, grid);

  blackboard.set('result', { directs, positions, winner, which: 'bonus' }, true);

  return SUCCESS;
};

export default MoveToBonus;
