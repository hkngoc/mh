import AI from './ai';

import { DIRECT_OF } from '../constants';

import _ from 'lodash';

AI.prototype.getPlayerSortId = function(id) {
  const split = id.split('-');

  return `${split[0]}-${split[1]}`;
};

AI.prototype.getPlayerNumber = function(id) {
  const { playerNumber: { [id]: number } } = this.map;

  return number;
};

AI.prototype.getPlayerPower = function(id) {
  const { map_info: { players: { [id]: player } } } = this.map;
  const { power } = player;

  return power;
};

AI.prototype.playerPassiveNumber = function(id) {
  const { map_info: { players: { [id]: player } } } = this.map;
  const { pill = 0, pillUsed = 0 } = player;

  // return 0; // mock
  return pill;
};

AI.prototype.getPlayer = function(id) {
  const { map_info: { players: { [id]: player } } } = this.map;

  return player;
};

AI.prototype.getMyPlayer = function() {
  const { myId }= this.map;

  return this.getPlayer(myId);
};

AI.prototype.getEnemyPlayer = function() {
  const { enemyId } = this.map;

  return this.getPlayer(enemyId);
};

AI.prototype.getDirectOf = function(direction) {
  return DIRECT_OF[direction];
};

AI.prototype.mergeProfit = function(left, right) {
  return _.mergeWith.apply(_, [{...left}].concat([{...right}], (obj, src, key) => {
    if (Array.isArray(src)) {
      const merged =  [ ...(obj || []), ...src ];
      return merged;
    }
    return (obj || 0) + src;
  }));
};

AI.prototype.fasterEnemy = function(node, travelCost, preCost = 0) {
  const { enemyTravelCost } = node;

  if (enemyTravelCost >= 0 && enemyTravelCost <= travelCost + preCost) {
    return false;
  }

  return true;
};

AI.prototype.timeToCrossACell = function(id) {
  const { timestamp, myId, map_info: { virusSpeed, humanSpeed, players } } = this.map;

  if (id == 'human') {
    var speed = humanSpeed;
  } else if (id == 'virus') {
    speed = virusSpeed;
  } else {
    speed = players[id].speed;
  }

  // need Q&A and confirm from BTC
  // current by hack of source code
  // I found that the value is 35 in traning mode and 55 in fighting mode
  const SIZE = myId.includes('player') ? 55 : 55;
  return 1000 * SIZE / speed;
};

export default AI;
