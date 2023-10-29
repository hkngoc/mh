import AI from './ai';
import _ from 'lodash';

AI.prototype.canPlayerWalkBySarsCov = function(playerId, node, neighbor, grid, cost, preCost = 0, offset = 700, byPassParam, profit = {}) {
  const tpc = this.timeToCrossACell(playerId);
  const travelTime = tpc * cost;

  /* check travel time with virus, human infected */
  const passive = this.playerPassiveNumber(playerId);
  const { virus = [], human = [] } = profit;

  /* uniq virus/human by id (index) */
  const passiveNeededByVirus = _(virus)
    .uniqBy('index')
    .sumBy(v => 1);

  const passiveNeededByHuman = _(human)
    .groupBy('index')
    .map((v, k) => {
      const infected = _.find(v, h => h.infected == true);
      return infected ? 1 : 0
    })
    .sum();

  if (passive < passiveNeededByVirus + passiveNeededByHuman) {
    return false;
  }

  return true;
};

AI.prototype.countingScareByRadar = function(node, grid, offset = 2) {
  const { x, y } = node;
  const scare = [];

  for (let i = -1 * offset; i <= offset; i++) {
    for (let j = -1 * offset; j <= offset; j++) {
      if (!grid.isInside(x + i, y + j)) {
        continue;
      }

      const distance = Math.abs(i) + Math.abs(j); // Manhattan distance.

      const near = grid.getNodeAt(x + i, y + j);
      if (!near.travelCost || near.travelCost > distance) {
        continue;
      }
      const { humanTravel = [], virusTravel = [] } = near;
      scare.push(..._.map(humanTravel, h => ({ ...h, distance, dx: i, dy: j, type: 'human' })));
      scare.push(..._.map(virusTravel, v => ({ ...v, distance, dx: i, dy: j, type: 'virus' })));
    }
  }

  return _.uniqBy(scare, o => `${o.type}-${o.index}`);
};

AI.prototype.humanCanBeInfected = function(pos, grid, cost, offset = 700) {
  const { x, y } = pos;
  const node = grid.getNodeAt(x, y);
  const { humanTravel = [], virusTravel = [] } = node;

  const htpc = this.timeToCrossACell('human');
  const vtpc = this.timeToCrossACell('virus');

  const travelTime = htpc * cost;
  const left = travelTime - htpc/2;
  const right = travelTime + htpc/2;

  for (const h of humanTravel) {
    if (h.infected == false) {
      continue;
    }

    const { step, curedRemainTime = 0, main = false } = h;

    if (main == false && step > 3) {
      continue;
    }

    const hTravelTime = curedRemainTime + step * htpc;
    const hLeft       = hTravelTime - htpc/2 - offset;
    const hRight      = hTravelTime + htpc/2 + offset;

    if ((hLeft < left && left < hRight) || (hLeft < right && right < hRight)) {
      return true;
    }
  }

  for (const v of virusTravel) {
    const { index, step, main = false } = v;
    if (main == false && step > 3) {
      continue;
    }

    const vTravelTime = step * vtpc;
    const vLeft       = vTravelTime - vtpc/2 - offset;
    const vRight      = vTravelTime + vtpc/2 + offset

    if ((vLeft < left && left < vRight) || (vLeft < right && right < vRight)) {
      return true;
    }
  }

  return false;
};

export default AI;
