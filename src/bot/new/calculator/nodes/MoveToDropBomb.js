import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const MoveToDropBomb = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

MoveToDropBomb.prototype = newChildObject(MyBaseNode.prototype);

MoveToDropBomb.prototype.tick = function(tree) {
  const { blackboard, grid, config: { other: { rejectByStop } } } = this.ref;

  const reject = blackboard.get('rejectTarget', true);
  if (rejectByStop && reject) {
    blackboard.set('result', { directs: 'x', positions: [], which: 'reject' }, true);

    return SUCCESS;
  }

  const winner = blackboard.get('bombWinner', true);
  const remain = blackboard.get('bombRemain', true);

  const { position } = winner;

  const { directs, positions } = this.ref.tracePath(position, grid);

  if (directs.length > 0) {
    blackboard.set('result', { directs, positions, winner, which: 'bomb' }, true);

    return SUCCESS;
  } else {
    if (remain > 0) {
      // blackboard.set('result', { directs: 'x', positions: [] }, true);

      return SUCCESS;
    } else {
      const player = this.ref.getMyPlayer();
      const { power, id: playerId } = player;
      const { x, y } = position;
      const bomb = {
        col: x,
        row: y,
        index: 0, // hardcode, current implement no need infor about index of bomb, but it may need in future
        playerId,
        power,
        remainTime: 2000
      };
      // dropBomb to current pos
      this.ref.map.map_info.bombs.push(bomb);
      grid.dropBombAt(x, y);
      this.ref.drawBombFlames(bomb, grid, this.ref.updateFlameFunction);
      // attach b prefix to directs output of safe path
      blackboard.set('safeDirectPrefix', 'b', true);

      return FAILURE;
    }
  }
};

export default MoveToDropBomb;
