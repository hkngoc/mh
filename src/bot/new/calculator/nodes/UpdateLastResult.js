import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';
import moment from 'moment';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const UpdateLastResult = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

UpdateLastResult.prototype = newChildObject(MyBaseNode.prototype);

UpdateLastResult.prototype.tick = function(tree) {
  const { lastResult, map: { timestamp } } = this.ref;

  if (!lastResult) {
    return SUCCESS;
  }

  const { positions } = lastResult;

  if (!positions || positions.length <= 0) {
    this.ref.lastResult = null;
    return SUCCESS;
  }

  const player = this.ref.getMyPlayer();
  const { id, currentPosition: { col, row } } = player;

  const index = _.findLastIndex(positions, pos => pos.visited);

  if (index >= positions.length - 1) {
    this.ref.lastResult = null;

    return SUCCESS;
  }

  const current = positions[index];
  const next = positions[index + 1];

  if (current.x == col && current.y == row) {
    // same as last event
    const tpc = this.ref.timeToCrossACell(id);
    const diff = this.diffTimestamp(current.timestamp, timestamp);
    if (diff > (index > 0 ? 1.3 * tpc + 50 : 1.5 * tpc + 100)) {
      // long time no move, remove target
      Logger.info('long time no move');
      this.ref.lastResult = null;
    }
  } else {
    if (next.x == col && next.y == row) {
      // new pos, collect visited
      this.ref.lastResult.positions[index + 1].visited = true;
      this.ref.lastResult.positions[index + 1].timestamp = timestamp;

      if (index == positions.length - 2) {
        // meet target, remove target
        Logger.info('target done');
        this.ref.lastResult = null;
      }
    } else {
      // wrong way, remove target
      Logger.info('wrong way');
      this.ref.lastResult = null;
    }
  }

  Logger.debug(this.ref.lastResult);

  return SUCCESS;
};

UpdateLastResult.prototype.diffTimestamp = function(t1, t2) {
  const m1 = moment(t1);
  const m2 = moment(t2);

  return m2.diff(m1);
};

export default UpdateLastResult;
