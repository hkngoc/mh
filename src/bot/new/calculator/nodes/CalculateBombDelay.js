import {
  SUCCESS,
} from 'behavior3js';

import _ from 'lodash';

import BaseNode from './BaseNode';

class CalculateBombDelay extends BaseNode {
  tick(_tree) {
    const { map: { myId, map_info }, blackboard } = this.ref;
    const { bombs } = map_info;
    const { delay } = this.ref.getPlayer(myId);
  
    const own = _.filter(bombs, bomb => bomb.playerId === myId);
    let remain = 0;
  
    if (own.length > 0) {
      const max = (_.maxBy(own, 'remainTime')).remainTime;
      remain = delay - (2000 - max);
    }
  
    blackboard.set('bombRemain', remain, true);
  
    return SUCCESS;
  }
}

export default CalculateBombDelay;
