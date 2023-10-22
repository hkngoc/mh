import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const CleanGrid = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

CleanGrid.prototype = newChildObject(MyBaseNode.prototype);

CleanGrid.prototype.tick = function(tree) {
  const { grid, map: { map_info: { size: { cols, rows } } } } = this.ref;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const node = grid.getNodeAt(j, i);

      delete node['f'];
      delete node['travelCost'];
      delete node['bombProfit'];
      delete node['scoreProfit'];
      delete node['opened'];
      delete node['closed'];
      delete node['parent'];
    }
  }

  return SUCCESS;
};

export default CleanGrid;
