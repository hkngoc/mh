import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const MoveToSafe = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

MoveToSafe.prototype = newChildObject(MyBaseNode.prototype);

MoveToSafe.prototype.tick = function(tree) {
  const { blackboard, grid, config: { other: { rejectByStop } } } = this.ref;

  const reject = blackboard.get('rejectTarget', true);
  if (rejectByStop && reject) {
    blackboard.set('result', { directs: 'x', positions: [], which: 'reject' }, true);

    return SUCCESS;
  }

  const winner = blackboard.get('safeWinner', true);
  const { position } = winner;
  const { directs, positions } = this.ref.tracePath(position, grid);

  const prefix = blackboard.get('safeDirectPrefix', true);

  if (prefix) {
    blackboard.set('result', { directs: `${prefix}${directs}`, positions, winner, which: 'safe' }, true);
  } else {
    blackboard.set('result', { directs, positions, winner, which: 'safe' }, true);
  }

  return SUCCESS;
};

export default MoveToSafe;
