import {
  Grid, 
  Node
} from 'pathfinding';

import { newChildObject } from '../../utils';

//===============================================================
const Direct = {
  LEFT: '1',
  RIGHT: '2',
  UP: '3',
  DOWN: '4'
};

const DirectOf = {
  '1': Direct.LEFT,
  '2': Direct.RIGHT,
  '3': Direct.UP,
  '4': Direct.DOWN
};

//===============================================================
const Pos = function(x, y) {
  this.x = x;
  this.y = y;
};

Pos.prototype.adj = function(direct) {
  switch (direct) {
    case Direct.LEFT:
      return new Pos(this.x - 1, this.y);
    case Direct.RIGHT:
      return new Pos(this.x + 1, this.y);
    case Direct.UP:
      return new Pos(this.x, this.y - 1);
    case Direct.DOWN:
      return new Pos(this.x, this.y + 1);
  }
};

Pos.prototype.directTo = function(other) {
  if (this.x == other.x) {
    if (this.y < other.y) {
      return Direct.DOWN;
    } else {
      return Direct.UP;
    }
  } else {
    if (this.x < other.x) {
      return Direct.RIGHT;
    } else {
      return Direct.LEFT;
    }
  }
};

const getDirect = (fromPos, toPos) => {
  if (fromPos.x == toPos.x) {
    if (fromPos.y < toPos.y) {
      return Direct.DOWN;
    } else {
      return Direct.UP;
    }
  } else {
    if (fromPos.x < toPos.x) {
      return Direct.RIGHT;
    } else {
      return Direct.LEFT;
    }
  }
};

//===============================================================
const CustomGrid = function(width, height, matrix) {
  Grid.apply(this, [width, height, matrix]);
};

CustomGrid.prototype = newChildObject(Grid.prototype);

CustomGrid.prototype._buildNodes = function(width, height, matrix) {
  let nodes = new Array(height);

  for (let i = 0; i < height; ++i) {
    nodes[i] = new Array(width);
    for (let j = 0; j < width; ++j) {
      nodes[i][j] = new Node(j, i);
    }
  }


  if (matrix === undefined) {
    return nodes;
  }

  if (matrix.length !== height || matrix[0].length !== width) {
    throw new Error('Matrix size does not fit');
  }

  for (let i = 0; i < height; ++i) {
    for (let j = 0; j < width; ++j) {
      const value = matrix[i][j];

      nodes[i][j].value = value;

      if (value) {
        // 0, false, null will be walkable
        // while others will be un-walkable
        nodes[i][j].walkable = false;
      }
    }
  }

  return nodes;
};

CustomGrid.prototype.isWalkableAt = function(x, y, playerNumber) {
    return this.isInside(x, y) && (this.nodes[y][x].walkable || this.nodes[y][x].value == playerNumber);
};

/**
 * Get the neighbors of the given node.
 * in current game rule, ignore diagonalMovement
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {DiagonalMovement} diagonalMovement
 */
CustomGrid.prototype.getNeighbors = function(node, diagonalMovement, playerNumber) {
  const { x, y } = node;
  const neighbors = [];
  const nodes = this.nodes;

  // ↑
  if (this.isWalkableAt(x, y - 1, playerNumber)) {
    neighbors.push(nodes[y - 1][x]);
  }
  // →
  if (this.isWalkableAt(x + 1, y, playerNumber)) {
    neighbors.push(nodes[y][x + 1]);
  }
  // ↓
  if (this.isWalkableAt(x, y + 1, playerNumber)) {
    neighbors.push(nodes[y + 1][x]);
  }
  // ←
  if (this.isWalkableAt(x - 1, y, playerNumber)) {
    neighbors.push(nodes[y][x - 1]);
  }

  return neighbors;
};

CustomGrid.prototype.getAllNeighbors = function(node) {
  const { x, y } = node;
  const neighbors = [];
  const nodes = this.nodes;

  // ↑
  if (this.isInside(x, y - 1,)) {
    neighbors.push(nodes[y - 1][x]);
  }
  // →
  if (this.isInside(x + 1, y)) {
    neighbors.push(nodes[y][x + 1]);
  }
  // ↓
  if (this.isInside(x, y + 1)) {
    neighbors.push(nodes[y + 1][x]);
  }
  // ←
  if (this.isInside(x - 1, y)) {
    neighbors.push(nodes[y][x - 1]);
  }

  // ↖
  if (this.isInside(x - 1, y - 1)) {
      neighbors.push(nodes[y - 1][x - 1]);
  }
  // ↗
  if (this.isInside(x + 1, y - 1)) {
      neighbors.push(nodes[y - 1][x + 1]);
  }
  // ↘
  if (this.isInside(x + 1, y + 1)) {
      neighbors.push(nodes[y + 1][x + 1]);
  }
  // ↙
  if (this.isInside(x - 1, y + 1)) {
      neighbors.push(nodes[y + 1][x - 1]);
  }

  return neighbors;
}

CustomGrid.prototype.wouldStopFlameAt = function(x, y, remainTime) {
  if (this.isInside(x, y)) {
    if (this.nodes[y][x].value == 1 || this.nodes[y][x].value == 5) {
      return true;
    } else if (this.nodes[y][x].value == 2) {
      const { flameRemain = [] } = this.nodes[y][x];
      for (const remain of flameRemain) {
        if (remain < remainTime) {
          // exist flame of other bomb with smaller remainTime
          return false;
        }
      }

      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
};

CustomGrid.prototype.wouldStopHumanAt = function(x, y) {
  return this.isInside(x, y) && ([1, 2].includes(this.nodes[y][x].value));
};

CustomGrid.prototype.wouldStopVirusAt = function(x, y) {
  return this.isInside(x, y) && ([1, 2].includes(this.nodes[y][x].value));
};

CustomGrid.prototype.dropBombAt = function(x, y){
  if (this.isInside(x, y)) {
    this.nodes[y][x].value = 3;
    this.nodes[y][x].walkable = false;
  }
};

CustomGrid.prototype.removeBombAt = function(x, y){
  if (this.isInside(x, y)) {
    this.nodes[y][x].value = 0;
    this.nodes[y][x].walkable = true;
  }
};

//===============================================================
const Queue = function(elements) {
  this._elements = Array.isArray(elements) ? elements : [];
  this._offset = 0;
};

Queue.prototype.enqueue = function(element) {
  this._elements.push(element);

  return this;
};

Queue.prototype.dequeue = function() {
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

Queue.prototype.front = function() {
  return this.size() > 0 ? this._elements[this._offset] : null;
};

Queue.prototype.back = function() {
  return this.size() > 0 ? this._elements[this._elements.length - 1] : null;
};

Queue.prototype.size = function() {
  return this._elements.length - this._offset;
};

Queue.prototype.isEmpty = function() {
  return this.size() === 0;
};

Queue.prototype.toArray = function() {
  return this._elements.slice(this._offset);
};

Queue.prototype.elements = function() {
  return this._elements;
};

Queue.prototype.clear = function() {
  this._elements = [];
  this._offset = 0;
}

Queue.prototype.clone = function() {
  return new Queue(this._elements.slice(this._offset));
};

//===============================================================
export {
  Direct,
  DirectOf,
  Pos,
  Queue,
  CustomGrid,
  getDirect
}
