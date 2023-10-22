import {
  SUCCESS
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';
import { Pos, Direct } from '../core/helper';

const UpdateVirus = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

UpdateVirus.prototype = newChildObject(MyBaseNode.prototype);

UpdateVirus.prototype.tick = function(tree) {
  const { map, grid } = this.ref;
  const { map_info: { viruses } } = map;

  for (const virus of viruses) {
    this.drawPath(virus, grid, this.updateFn);
  }

  return SUCCESS;
};

UpdateVirus.prototype.drawPath = function(virus, grid, fn) {
  const { position, direction, index } = virus;
  const { col, row } = position;

  let directs = {};
  const pos = new Pos(col, row);
  directs[Direct.LEFT] = pos;
  directs[Direct.RIGHT] = pos;
  directs[Direct.UP] = pos;
  directs[Direct.DOWN] = pos;

  const mainDirect = this.ref.getDirectOf(direction);

  fn.apply(this, [pos, grid, 0, index]);
  let step = 1;
  while (_.keys(directs).length > 0) {
    for (const direct in directs) {
      const p = directs[direct];
      const near = p.adj(direct);

      const stop = grid.wouldStopVirusAt(near.x, near.y);
      if (stop) {
        directs = _.omit(directs, direct);
      } else {
        // update grid at near
        fn.apply(this, [near, grid, step, index, direct == mainDirect]);

        directs[direct] = near;
      }
    }

    step++;
  }
};

UpdateVirus.prototype.updateFn = function(pos, grid, step, index, main, which = 'virusTravel') {
  const { x, y } = pos;

  const node = grid.getNodeAt(x, y);
  node[which] = [ ...(node[which] || []), { step, index, main } ];
};

export default UpdateVirus;
