import {
  BaseNode as B3BaseNode,
  // @ts-ignore
} from 'behavior3js';

class BaseNode extends B3BaseNode {
  protected ref: any;
  
  constructor(ref: any) {
    super();

    this.ref = ref;
  }
}

export default BaseNode;
