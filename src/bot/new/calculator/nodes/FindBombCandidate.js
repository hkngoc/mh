import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const FindBombCandidate = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

FindBombCandidate.prototype = newChildObject(MyBaseNode.prototype);

FindBombCandidate.prototype.tick = function(tree) {
  const {
    map: {
      map_info: {
        size: { cols, rows }
      },
      myId
    },
    grid,
    blackboard
  } = this.ref;

  const candidates = [];
  const tpc = this.ref.timeToCrossACell(myId);
  const remain = blackboard.get('bombRemain', true);

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      const node = grid.getNodeAt(j, i);
      const { travelCost } = node;

      // bombable
      // travel time >= remainTime or
      // travel time < remain and safe place
      const accept = this.ref.conditionBombFn.apply(this.ref, [node, tpc, remain]);
      if (accept) {
      // if (accept && remain <= travelCost * tpc) {
        const score = this.ref.scoreFn.apply(this.ref, [node]);
        const extreme = this.ref.extremeFn.apply(this.ref, [score, travelCost]);

        candidates.push({
          position: {
            x: j,
            y: i
          },
          score,
          extreme,
          cost: travelCost,
          diff: remain - travelCost * tpc
        });
      }
    }
  }

  Logger.debug(candidates);
  blackboard.set('bombCandidates', candidates, true);

  return SUCCESS;
};

export default FindBombCandidate;
