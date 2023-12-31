import AI from './ai';

import Pos from '../Pos';

import {
  DIRECT
} from '../constants';

import _ from 'lodash';

AI.prototype.drawBombFlames = function(bomb, grid, fn, which) {
  const { col, row, remainTime, power, index, playerId } = bomb;

  const pos = new Pos(col, row);

  let directs = {};
  directs[DIRECT.LEFT] = pos;
  directs[DIRECT.RIGHT] = pos;
  directs[DIRECT.UP] = pos;
  directs[DIRECT.DOWN] = pos;

  let flameSize = power;//boot bomb power
  // let score = 0;

  let profit = fn.apply(this, [playerId, pos, grid, remainTime, index, {}, which]);

  while (flameSize > 0 && _.keys(directs).length > 0) {
    for (const direct in directs) {
      const p = directs[direct];
      const near = p.adj(direct);

      // update grid at near
      profit = fn.apply(this, [playerId, near, grid, remainTime, index, profit, which]);
      directs[direct] = near;

      const stop = grid.wouldStopFlameAt(near.x, near.y, remainTime);
      if (stop) {
        directs = _.omit(directs, direct);
      }
    }

    flameSize--;
  }

  return profit;
};

AI.prototype.updateFlameFunction = function(playerId, pos, grid, remainTime, index, profit = {}, which = 'flameRemain') {
  const { x, y } = pos;

  const node = grid.getNodeAt(x, y);
  node[which] = [ ...(node[which] || []), remainTime];

  const score = this.scoreForBombing(playerId, pos, grid, remainTime);

  return this.mergeProfit(profit, score);
};

AI.prototype.reverseFlameFunction = function(playerId, pos, grid, remainTime, index, profit = {}, which = 'tempFlameRemain') {
  const { x, y } = pos;

  const node = grid.getNodeAt(x, y);
  delete node[which];

  return 0;
};

AI.prototype.scoreForBombing = function(playerId, pos, grid, remainTime) {
  // const playerNumber = this.getPlayerNumber(playerId);
  const score = {};

  const { x, y } = pos;
  const node = grid.getNodeAt(x, y);

  // kill enemy
  const { myId, enemyId, map_info: { players, dragonEggs } } = this.map;

  const id = myId == playerId ? enemyId : myId;
  const {
    [id]: {
      currentPosition: { col, row },
      // enemy score here
      score: enemyScore,
    }
  } = players;

  if (x == col && y == row) {
    score.enemy = 1;
  }

  const {
    [id]: { col: eCol, row: eRow },
    [myId]: { col: eCol2, row: eRow2 }
  } = dragonEggs;

  if (node.value == 2 && grid.wouldStopFlameAt(x, y, remainTime)) {
    score.box = 1;
    // check box near enemy dragon
    if ((x == eCol && Math.abs(y - eRow) == 1) || (y == eRow && Math.abs(x - eCol) == 1) || (Math.abs(y - eRow) == 1 && Math.abs(x - eCol) == 1)) {
      score.box_near_enemy_egg = 1;
    }
  }

  if (x == eCol && y == eRow) {
    score.enemy_egg = 1;
    score.enemyScore = enemyScore;
  }

  if (x == eCol2 && y == eRow2) {
    score.my_egg = 1;
  }

  return score;
};

AI.prototype.acceptFlame = function(remain, cost, preCost, tpc, offset, ping) {
  const distance = cost + preCost;

  const previousCellTravelTime = tpc * ((distance - 1) || 0);
  const nextCellTravelTime = tpc * (distance + 1);
  const travelTime = tpc * distance;

  // need so much more thinking about that formula about range time of flame effect
  // currenly, I approve that with:
  // flame time = 400ms
  // offset = 200

  // -------------------remain-----------remain+400---------------
  //------------------xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx------------

  /**
   * flame fps = 15
   * 1 frame = 66.7
   * flame animation ~ 6 frame
   * offset 2 frame = 120
   * safe = offset + ping
   * previous > remain + flametime 
   * next < remain
   */

  const flametime = 400;
  const offset1 = 120;
  const offsetSafe = offset1 + ping;

  // if ((travelTime - tpc/2 > remain + 400 + offset * 1.5) || (travelTime + tpc/2 < remain - offset)) {
  if ((previousCellTravelTime > remain + flametime + offsetSafe) || (nextCellTravelTime < remain - offsetSafe)) {
    return true;
  } else {
    return false;
  }
};

AI.prototype.isPathInLastResult = function(node, neighbor) {
  const { lastResult } = this;

  if (!lastResult) {
    return false;
  }

  const { positions } = lastResult;

  const index1 = _.findLastIndex(positions, p => p.x == node.x  && p.y == node.y);
  const index2 = _.findLastIndex(positions, p => p.x == neighbor.x  && p.y == neighbor.y);

  if (index1 >= 0 && index2 >= 0 && Math.abs(index1 - index2) == 1)  {
    return true;
  }

  return false;
};

AI.prototype.canPlayerWalkByFlame = function(playerId, node, neighbor, grid, cost, preCost = 0, offset = 300, includeTemp = true, _1, usePing = false) {
  const { pingObject: { ping = 0} = {} } = this;
  const offsetPing = usePing && !this.isPathInLastResult(node, neighbor) ? ping : 0;

  const tpc = this.timeToCrossACell(playerId);
  const travelTime = tpc * cost;

  let safe = true;

  /* check travel time with flame */
  const { flameRemain = [], tempFlameRemain = [] } = neighbor;
  const remainTime = [
    ..._.map(flameRemain, remain => ({ remain, preCost })),
  ];
  if (includeTemp) {
    remainTime.push(..._.map(tempFlameRemain, remain => ({ remain, preCost: 0 })));
  }

  for (const flame of remainTime) {
    const { remain, preCost } = flame;

    const accept = this.acceptFlame(remain, cost, preCost, tpc, offset, offsetPing);

    if (!accept) {
      safe = false;
      break;
    }
  }

  return safe;
};

export default AI;
