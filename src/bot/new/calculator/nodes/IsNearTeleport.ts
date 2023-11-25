import {
  SUCCESS,
  // @ts-ignore
} from 'behavior3js';

import BaseNode from './BaseNode';

class IsNearTeleport extends BaseNode {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(ref: any) {
    super(ref);
  }

  tick(_tree: any) {
    const { grid, blackboard } = this.ref;
    const player = this.ref.getMyPlayer();
    const {
      // id,
      currentPosition: { col:x, row: y },
    } = player;

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
  }
}

export default IsNearTeleport;
