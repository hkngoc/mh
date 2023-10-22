import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const FilterEvent = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

FilterEvent.prototype = newChildObject(MyBaseNode.prototype);

FilterEvent.prototype.tick = function(tree) {
  const { map: { tag, player_id }, config: { playerId } } = this.ref;

  if (['start-game', 'update-data'].includes(tag)) {
    return SUCCESS;
  }

  if (playerId.startsWith(player_id) && ['player:stop-moving'].includes(tag)) {
    return SUCCESS;
  }

  return FAILURE;
};

export default FilterEvent;
