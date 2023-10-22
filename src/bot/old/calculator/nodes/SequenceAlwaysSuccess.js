import {
  SUCCESS,
  FAILURE,
  Sequence,
  Class
} from 'behavior3js';

import _ from 'lodash';

export default Class(Sequence, {
  name: 'SequenceAlwaysSuccess',

  tick: function(tick) {
    for (var i=0; i<this.children.length; i++) {
      var status = this.children[i]._execute(tick);

      if (status !== SUCCESS) {
        return SUCCESS;
      }
    }

    return SUCCESS;
  }
});
