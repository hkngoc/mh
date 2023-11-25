import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';
import Logger from 'js-logger';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const FindCandidate = function(ref, faster = false) {
  MyBaseNode.apply(this, [ref]);
  this.faster = faster;
};

FindCandidate.prototype = newChildObject(MyBaseNode.prototype);

FindCandidate.prototype.tick = function(tree) {
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

  let safeCandidates = [];
  let bombCandidates = [];
  let bonusCandidates = [];

  const passive = this.ref.playerPassiveNumber(myId);
  const tpc = this.ref.timeToCrossACell(myId);
  const remain = blackboard.get('bombRemain', true);

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      const node = grid.getNodeAt(j, i);

      const { travelCost } = node;
      const scare = [];
      node.scare = scare;

      // find safe place
      const {
        acceptFlame,
        acceptFaster
      } = this.ref.conditionSafeFn.apply(this.ref, [node, grid, passive, scare, this.faster]);

      if (/*travelCost >= 0 && */acceptFlame && acceptFaster) {
        const { travelCost } = node;
        const score = this.ref.scoreFn.apply(this.ref, [node, scare.length]);
        const extreme = this.ref.extremeFn.apply(this.ref, [score, travelCost]);

        safeCandidates.push({
          position: {
            x: j,
            y: i
          },
          score,
          extreme,
          cost: travelCost,
          scare: scare
        });
      }

      // find bomb candidate
      const acceptDropBomb = this.ref.conditionBombFn.apply(this.ref, [node, tpc, remain]);
      if (acceptDropBomb) {
        const score = this.ref.scoreFn.apply(this.ref, [node]);
        const extreme = this.ref.extremeFn.apply(this.ref, [score, travelCost]);

        bombCandidates.push({
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

      // find bonus
      const acceptBonus = this.ref.conditionBonusFn.apply(this.ref, [node]);
      if (acceptBonus) {
        const score = this.ref.scoreFn.apply(this.ref, [node]);
        const extreme = this.ref.extremeFn.apply(this.ref, [score, travelCost]);

        bonusCandidates.push({
          position: {
            x: j,
            y: i
          },
          score,
          extreme,
          cost: travelCost
        });
      }
    }
  }

  safeCandidates = this.ref.interviewSafe(safeCandidates, passive);
  bombCandidates = this.ref.interviewBomb(bombCandidates);
  bonusCandidates = this.ref.interviewBonus(bonusCandidates);

  blackboard.set('safeCandidates', safeCandidates, true);
  blackboard.set('bombCandidates', bombCandidates, true);
  blackboard.set('bonusCandidates', bonusCandidates, true);

  return SUCCESS;
};

export default FindCandidate;
