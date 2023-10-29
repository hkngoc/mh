import {
  BaseNode,
  SUCCESS
} from 'behavior3js';

import { newChildObject } from '../../utils';

const MyBaseNode = function(ref) {
  BaseNode.apply(this);
  this.ref = ref;
};

MyBaseNode.prototype = newChildObject(BaseNode.prototype);

export default MyBaseNode;
