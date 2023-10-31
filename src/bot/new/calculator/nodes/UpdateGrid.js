import {
  SUCCESS
} from 'behavior3js';

import {
  DiagonalMovement
} from 'pathfinding';

import Heap from 'heap';
import _ from 'lodash';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';
import { Pos, Queue } from '../core/helper';

const UpdateGrid = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

UpdateGrid.prototype = newChildObject(MyBaseNode.prototype);

UpdateGrid.prototype.tick = function(tree) {
  const { grid } = this.ref;
  const player = this.ref.getMyPlayer();
  const { id, currentPosition: { col:x, row: y } } = player;

  this.travelGrid(id, { x, y }, grid);

  Logger.debug(grid);

  return SUCCESS;
};

UpdateGrid.prototype.travelGrid = function(playerId, pos, grid) {
  const { blackboard } = this.ref;
  const { cols, rows } = blackboard.get('emptyCheck', true);

  let openList = new Heap((nodeA, nodeB) => {
    return nodeA.f - nodeB.f;
  });

  const playerNumber = this.ref.getPlayerNumber(playerId);
  const { x, y } = pos;
  const startNode = grid.getNodeAt(x, y);
  startNode.f = 0;
  startNode.travelCost = 0;
  startNode.bombProfit = {};
  startNode.scoreProfit = {};
  startNode.opened = true;

  openList.push(startNode);

  while (!openList.empty()) {
    const node = openList.pop();
    node.closed = true;

    // try place bomb and calculate score of that bomb
    const bombProfit = (rows[node.y] || cols[node.x]) ? this.tryPlaceBomb(playerId, node, grid) : {};
    node.bombProfit = bombProfit;

    const nextTravelCost = node.travelCost + 1;
    const neighbors = grid.getNeighbors(node, DiagonalMovement.Never, playerNumber);

    for (const neighbor of neighbors) {
      // really walkable under bomb flame remain
      const { score: scoreProfit, merged: mergeProfit } = this.ref.scoreForWalk(playerId, node, neighbor, grid, nextTravelCost, 700, node.scoreProfit);
      const walkable = this.canPlayerWalk(playerId, node, neighbor, grid, nextTravelCost, 0, 300, false, mergeProfit);

      if (neighbor.closed || !walkable) {
        continue;
      }

      const safeProfit = this.ref.safeScoreForWalk(playerId, node, neighbor, nextTravelCost);

      // collect gift bonus on this path, it make better path
      const adder = 1 - this.getProfitAdder(bombProfit, scoreProfit, safeProfit);
      const ng = node.f + adder;

      if (!neighbor.opened || ng < neighbor.g) {
        neighbor.f = ng;
        neighbor.parent = node;
        neighbor.travelCost = nextTravelCost ;
        neighbor.scoreProfit = mergeProfit;

        if (!neighbor.opened) {
          neighbor.opened = true;
          openList.push(neighbor);
        } else {
          // the neighbor can be reached with smaller cost.
          // Since its f value has been updated, we have to
          // update its position in the open list
          openList.updateItem(neighbor);
        }
      }
    }
  }
};

UpdateGrid.prototype.tryPlaceBomb = function(playerId, pos, grid) {
  const tpc = this.ref.timeToCrossACell(playerId);
  const power = this.ref.getPlayerPower(playerId);

  // place bomb at node to grid clone
  const { x, y, travelCost } = pos;
  grid.dropBombAt(x, y);
  //col, row, remainTime, power, index
  const tempBomb = {
    col: x,
    row: y,
    index: 0, // hardcode, current implement no need infor about index of bomb, but it may need in future
    playerId,
    power,
    remainTime: 2000
  };

  // calculate score of explore and kill enemy...
  const profit = this.ref.drawBombFlames(tempBomb, grid, this.ref.updateFlameFunction, 'tempFlameRemain');

  // check where can find safe place/path
  // this below check make bot has a new bug about new target better than current
  // const safe = this.ref.canPlayerWalkByFlame(playerId, pos, pos, grid, travelCost, 0, 400, true) && this.findSafePlace(playerId, pos, grid);
  const safe = this.findSafePlace(playerId, pos, grid);
  profit.safe = safe;

  // reverse state
  grid.removeBombAt(x, y);
  this.ref.drawBombFlames(tempBomb, grid, this.ref.reverseFlameFunction, 'tempFlameRemain');

  return profit;
};

UpdateGrid.prototype.findSafePlace = function(playerId, pos, grid) {
  const playerNumber = this.ref.getPlayerNumber(playerId);

  const { x, y, travelCost: preCost } = pos;
  const startNode = grid.getNodeAt(x, y);
  startNode.safeOpened = true;
  startNode.safeTravelCost = 0;

  const openList = new Queue();
  openList.enqueue(startNode);

  let safe = false;
  let faster0 = 0;

  while (!openList.isEmpty()) {
    const node = openList.dequeue();
    node.safeClosed = true;

    const nextTravelCost = node.safeTravelCost + 1;
    if (this.isSafePlace(node, playerId)) {
      const fasterEnemy = this.ref.fasterEnemy(node, nextTravelCost, preCost);
      const faster = this.ref.fasterEnemy(node, nextTravelCost, 0);

      if (faster) {
        faster0++;
      }

      if (fasterEnemy || faster0 >= 4) {
        safe = true;
        break;
      }
    }

    const neighbors = grid.getNeighbors(node, DiagonalMovement.Never, playerNumber);
    for (const neighbor of neighbors) {
      // skip this neighbor if it has been inspected before
      if (neighbor.safeClosed || neighbor.safeOpened) {
        continue;
      }

      const { /*score,*/ merged: mergeProfit } = this.ref.scoreForWalk(playerId, node, neighbor, grid, nextTravelCost, 100, node.scoreProfit);
      const walkable = this.canPlayerWalk(playerId, node, neighbor, grid, nextTravelCost, preCost, 300, true, mergeProfit);

      if (walkable) {
        neighbor.safeOpened = true;
        neighbor.safeTravelCost = nextTravelCost;
        openList.enqueue(neighbor);
      }
    }
  }

  const after = openList.elements();

  for (const node of after) {
    delete node['safeOpened'];
    delete node['safeClosed'];
    delete node['safeTravelCost'];
  }

  return safe;
};

UpdateGrid.prototype.canPlayerWalk = function(...params) {
  return this.ref.canPlayerWalkByFlame(...params) && this.ref.canPlayerWalkBySarsCov(...params);
  // return this.ref.canPlayerWalkByFlame(...params);
};

UpdateGrid.prototype.isSafePlace = function(node, playerId) {
  const { flameRemain = [], tempFlameRemain = [], enemyFlameRemain = [], safeTravelCost } = node;
  // const tpc = this.ref.timeToCrossACell(playerId);
  // const max = Math.round(0.8 * Math.round(2000 / tpc));

  return [ ...flameRemain, ...tempFlameRemain].length <= 0 /*&& safeTravelCost >= 0 && safeTravelCost <= max*/;
};

UpdateGrid.prototype.getProfitAdder = function(bomb, items, safer) {
  const { box = 0, enemy = 0, safe } = bomb;
  const { gifts = [], spoils = [] } = items;

  let score = 0;

  score = score + gifts.length;
  score = score + _.sumBy(spoils, s => s == 5 ? 2 : 1);
  score = score + safer;

  return score / 10;
};

export default UpdateGrid;
