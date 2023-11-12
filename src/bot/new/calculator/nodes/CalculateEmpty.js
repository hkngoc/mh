import {
  SUCCESS,
  FAILURE
} from 'behavior3js';

import _ from 'lodash';

import { newChildObject } from '../../utils';
import MyBaseNode from './MyBaseNode';

const CalculateEmpty = function(ref) {
  MyBaseNode.apply(this, [ref]);
};

CalculateEmpty.prototype = newChildObject(MyBaseNode.prototype);

CalculateEmpty.prototype.tick = function(tree) {
  const {
    map: {
      map_info: {
        size: { cols, rows },
        map
      },
      myId,
      dragonEggs,
    },
    blackboard
  } = this.ref;

  const rowCheck = new Array(rows).fill(false);
  const colCheck = new Array(cols).fill(false);

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      const val = map[i][j];

      if (val == 2 || val == 10 || val == 5) {
        rowCheck[i] = true;
        colCheck[j] = true;
      }
    }
  }

  blackboard.set('emptyCheck', { rows: rowCheck, cols: colCheck }, true);

  return SUCCESS;
};

export default CalculateEmpty;
