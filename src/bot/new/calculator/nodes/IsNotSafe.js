import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import Logger from 'js-logger';
import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const IsNotSafe = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

IsNotSafe.prototype = newChildObject(MyBaseNode.prototype);

IsNotSafe.prototype.tick = function(tree) {
  const { grid, blackboard } = this.ref;
  const player = this.ref.getMyPlayer();
  const { id, currentPosition: { col: x, row: y } } = player;

  const node = grid.getNodeAt(x, y);
  const isSafe = this.isSafePlace(node, grid, id);

  blackboard.set('isSafe', isSafe, true);
  Logger.debug('isSafe', isSafe);

  return isSafe ? FAILURE : SUCCESS;
};

IsNotSafe.prototype.isSafePlace = function(node, grid, playerId) {
  const {
    flameRemain = [],
    x, y,
    scare = []
  } = node;

  // const scare = this.ref.countingScareByRadar(node, grid);
  // already loaded from new implement

  const passive = this.ref.playerPassiveNumber(playerId);

  const scareCount = _(scare)
    .uniqBy(o => `${o.type}-${o.index}`)
    .filter(o => (o.step >= 0 && o.main) || (o.step <= 3))
    .value();

  if (flameRemain.length > 0 || passive < scareCount.length) {
    return false;
  }

  return true;
};

export default IsNotSafe;
