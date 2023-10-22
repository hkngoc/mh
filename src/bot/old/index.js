import Logger from 'js-logger';

import ai from './calculator';
import { throttle } from './utils';

const Brain = function(config, callback) {
  this.config = config;
  this.callback = callback;
  this.throttled = throttle(ai, this.onCalculated.bind(this));
  this.lastResult = null;
  this.lastMap = null;
  this.enemyDrive = null;
};

Brain.prototype.ticktack = function(map) {
  // console.log("work on brain", map);
  // some logic handle latest data, middleware ...
  this.lastMap = map;

  // invoke ai func with some data from preprocessing
  // this.throttled?.(map, this.config, this.lastResult, this.enemyDrive);
  this.throttled.apply(this, [map, this.config, this.lastResult, this.enemyDrive]);
};

Brain.prototype.onDrive = function(data) {
  const { direction, player_id } = data;
  const { playerId } = this.config;

  if (!playerId.startsWith(player_id) && this.lastMap) {
    // enemy drive
    const { map_info: { players: { [player_id]: { currentPosition } } } } = this.lastMap;
    this.enemyDrive = {
      directs: direction,
      position: currentPosition
    }
  }
};

Brain.prototype.onCalculated = function(result) {
  this.lastResult = result;

  Logger.info('result', result);

  this.callback(result);

  // if (!result) {
  //   return;
  // }

  // const { watch } = result;
  // // console.log(result, watch);

  // if (this.callback && !watch) {
  // }
};

export default Brain;
