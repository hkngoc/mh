import {
  SUCCESS
} from 'behavior3js';

import {
  DiagonalMovement
} from 'pathfinding';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const UpdateEnemy = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

UpdateEnemy.prototype = newChildObject(MyBaseNode.prototype);

UpdateEnemy.prototype.tick = function(tree) {
  const { map, grid } = this.ref;
  const player = this.ref.getEnemyPlayer();

  const { id, power, currentPosition: { col:x, row: y } } = player;

  const tempBomb = {
    col: x,
    row: y,
    index: -1, // hardcode, current implement no need infor about index of bomb, but it may need in future
    playerId: id,
    power,
    remainTime: 2000
  };

  this.ref.drawBombFlames(tempBomb, grid, this.ref.updateFlameFunction, 'enemyFlameRemain');

  this.travelGrid(id, { x, y }, grid);

  return SUCCESS;
};

UpdateEnemy.prototype.travelGrid = function(playerId, pos, grid) {
  const { x, y } = pos;

  const startNode = grid.getNodeAt(x, y);
  startNode.enemyOpened = true;
  startNode.enemyTravelCost = 0;

  const openList = [];
  openList.push(startNode);

  while (openList.length > 0) {
    const node = openList.shift();
    node.enemyClosed = true;

    const nextTravelCost = node.enemyTravelCost + 1;
    const neighbors = grid.getNeighbors(node, DiagonalMovement.Never);
    for (const neighbor of neighbors) {
      if (neighbor.enemyClosed || neighbor.enemyOpened) {
          continue;
      }

      const walkable = this.enemyCanWalk(neighbor);

      if (walkable) {
        openList.push(neighbor);
        neighbor.enemyOpened = true;
        neighbor.enemyTravelCost = nextTravelCost;
      }
    }
  }
};

UpdateEnemy.prototype.enemyCanWalk = function(node){
  const { value } = node;

  if ([1, 2, 6].includes(value)) {
    return false;
  }

  return true;
};

export default UpdateEnemy;
