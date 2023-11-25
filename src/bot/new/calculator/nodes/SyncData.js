import {
  SUCCESS
} from 'behavior3js';

import _ from 'lodash';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';
import Grid from '../core/Grid';

const SyncData = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

SyncData.prototype = newChildObject(MyBaseNode.prototype);

SyncData.prototype.tick = function(tree) {
  let { map, config: { playerId } } = this.ref;
  let { map_info: { players, bombs, human, viruses, dragonEggGSTArray, size: { cols, rows } } } = map;

  // map players from array to map
  players = _.keyBy(players, 'id');

  const dragonEggs = _.keyBy(dragonEggGSTArray, 'id');

  map.map_info.players = players;
  map.map_info.dragonEggs = dragonEggs;

  map.map_info.gifts = [];

  // sync bomb power by reference bomb.playerId to
  bombs = _.map(bombs, (bomb, index) => {
    const { playerId } = bomb;

    return {
      ...bomb,
      power: players[playerId].power,
      index
    };
  });
  map.map_info.bombs = bombs;

  human = _.map(human, (h, index) => {
    return {
      ...h,
      index
    };
  });
  map.map_info.human = human;

  viruses = _.map(viruses, (virus, index) => {
    return {
      ...virus,
      index
    };
  });
  map.map_info.viruses = viruses;

  // map player sort Id
  const myId = this.ref.getPlayerSortId(playerId);
  // const { col: mCol, row: mRow } = players[myId].currentPosition;
  // map.map_info.map[mRow][mCol] = 9;

  const enemies = _(players)
    .keys()
    .filter(k => k !== myId)
    .value();

  const enemyId = enemies[0];
  const { col: eCol, row: eRow } = players[enemyId].currentPosition;
  // enemy is 10
  map.map_info.map[eRow][eCol] = 10;

  // const { col: eCol2, row: eRow2 } = dragonEggs[enemyId];
  // map.map_info.map[eRow2][eCol2] = 12;
  

  map.myId = myId;
  map.enemyId = enemyId;
  map.playerNumber = {
    [myId]: 9,
    [enemyId]: 10
  };

  const grid = new Grid(cols, rows, map.map_info.map);
  this.ref.map =  map;
  this.ref.grid = grid;

  Logger.debug(map);
  return SUCCESS;
};

export default SyncData;
