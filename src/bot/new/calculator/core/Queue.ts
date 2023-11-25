class Queue {
  private _elements: any[];
  private _offset: number

  constructor(elements: any) {
    this._elements = Array.isArray(elements) ? elements : [];
    this._offset = 0;
  }

  public enqueue(element: any) {
    this._elements.push(element);
  
    return this;
  };

  public dequeue() {
    if (this.size() === 0) return null;
  
    const first = this.front();
    this._offset += 1;
  
    // if (this._offset * 2 < this._elements.length) return first;
  
    // // only remove dequeued elements when reaching half size
    // // to decrease latency of shifting elements.
    // this._elements = this._elements.slice(this._offset);
    // this._offset = 0;
  
    return first;
  };

  public front() {
    return this.size() > 0 ? this._elements[this._offset] : null;
  };

  public back() {
    return this.size() > 0 ? this._elements[this._elements.length - 1] : null;
  };

  public size() {
    return this._elements.length - this._offset;
  };

  public isEmpty() {
    return this.size() === 0;
  };

  public toArray() {
    return this._elements.slice(this._offset);
  };

  public elements() {
    return this._elements;
  };

  public clear() {
    this._elements = [];
    this._offset = 0;
  }

  public clone() {
    return new Queue(this._elements.slice(this._offset));
  }
}

export default Queue;