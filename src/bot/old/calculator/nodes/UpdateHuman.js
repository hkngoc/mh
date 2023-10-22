import {
  SUCCESS
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';
import { Pos, Direct } from '../core/helper';

const UpdateHuman = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

UpdateHuman.prototype = newChildObject(MyBaseNode.prototype);

UpdateHuman.prototype.tick = function(tree) {
  const { map, grid } = this.ref;
  const { map_info: { human } } = map;

  const ordered = _.orderBy(human, ['infected'], ['desc']);
  for (const h of ordered) {
    this.drawPath(h, grid, this.updateFn);
  }
  return SUCCESS;
};

UpdateHuman.prototype.drawPath = function(human, grid, fn) {
  const { position, direction, index, infected, curedRemainTime } = human;
  const { col, row } = position;

  let beInfected = infected;
  let directs = {};
  const pos = new Pos(col, row);
  directs[Direct.LEFT] = pos;
  directs[Direct.RIGHT] = pos;
  directs[Direct.UP] = pos;
  directs[Direct.DOWN] = pos;
  const mainDirect = this.ref.getDirectOf(direction);

  fn.apply(this, [pos, grid, 0]);
  let step = 1;
  while (_.keys(directs).length > 0) {
    for (const direct in directs) {
      const p = directs[direct];
      const near = p.adj(direct);

      const stop = grid.wouldStopVirusAt(near.x, near.y);
      if (stop) {
        directs = _.omit(directs, direct);
      } else {
        beInfected = beInfected || this.ref.humanCanBeInfected(near, grid, step);
        // update grid at near
        fn.apply(this, [near, grid, step, index, beInfected, curedRemainTime, direct == mainDirect]);

        directs[direct] = near;
      }
    }

    step++;
  }
};

UpdateHuman.prototype.updateFn = function(pos, grid, step, index, infected, curedRemainTime, main, which = 'humanTravel') {
  const { x, y } = pos;

  const node = grid.getNodeAt(x, y);
  node[which] = [ ...(node[which] || []), { index, step, infected, curedRemainTime, main } ];
};

export default UpdateHuman;
