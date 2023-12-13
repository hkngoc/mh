import AI from './ai';

import _ from 'lodash';

import Pos from '../Pos';

AI.prototype.checkPathCanWalk = function(positions) {
  const { map: { myId }, grid } = this;

  const index = _.findLastIndex(positions, p => p.visited == true);

  let wakable = true;
  let travelCost = 1;
  let profit = {};
  for (let i = index; i < positions.length - 1; i++) {
    const node = positions[i];
    const neighbor = positions[i+1];

    const { score, merged } = this.scoreForWalk(myId, node, neighbor, grid, travelCost, 100, profit);
    wakable = this.canPlayerWalkByFlame(
      myId,
      grid.getNodeAt(node.x, node.y),
      grid.getNodeAt(neighbor.x, neighbor.y),
      grid,
      travelCost,
      0,
      300,
      false,
      [],
      false,
    );
    profit = merged;
    travelCost++;

    if (!wakable) {
      break;
    }
  }

  return wakable;
};

AI.prototype.checkPathInDanger = function(positions) {
  const { map: { myId }, grid }= this;

  const index = _.findLastIndex(positions, p => p.visited == true);
  const left = index >= 2 ? index - 2 : 0;

  let profit = {};
  let accept = true;
  for (let i = left; i <= index; i++) {
    const node = grid.getNodeAt(positions[i].x, positions[i].y);

    const { flameRemain = [], humanTravel = [], virusTravel = [] } = node;
    profit = this.mergeProfit(profit, { humanTravel, virusTravel });
    if (flameRemain.length > 0) {
      accept = false;
      break;
    }
  }

  return accept;
};

AI.prototype.tracePath = function(pos, grid) {
  let node = grid.getNodeAt(pos.x, pos.y);
  let directs = '';
  const positions = [{
    x: pos.x,
    y: pos.y
  }];

  while (node.parent) {
    const { parent } = node;
    const direct = Pos.getDirect({ x: parent.x, y: parent.y }, { x: node.x, y: node.y });
    directs = direct + directs;
    positions.splice(0, 0, {
      x: parent.x,
      y: parent.y
    });

    node = parent;
  }

  const { timestamp } = this.map;
  positions[0].visited = true;
  positions[0].timestamp = timestamp;

  return {
    directs,
    positions
  };
};

export default AI;
