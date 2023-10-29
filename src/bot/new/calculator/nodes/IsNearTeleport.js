import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const IsNearTeleport = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

IsNearTeleport.prototype = newChildObject(MyBaseNode.prototype);

IsNearTeleport.prototype.tick = function(tree) {
  const { grid, blackboard } = this.ref;
  const player = this.ref.getMyPlayer();
  const { id, currentPosition: { col:x, row: y } } = player;

  const node = grid.getNodeAt(x, y);
  const neighbors = grid.getAllNeighbors(node);

  let near = false;

  for (const neighbor of neighbors) {
    if (neighbor.value == 6) {
      near = true;
      break;
    }
  }

  blackboard.set('nearTeleport', near, true);

  return SUCCESS;
};

export default IsNearTeleport;
